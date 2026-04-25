const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET ADMIN FINANCE STATS
router.get('/admin/stats', async (req, res) => {
  try {
    // 1. Core Financial Stats
    const statsQuery = `
      SELECT 
        COALESCE(SUM(total_revenue), 0) as "grossRevenue",
        COALESCE(SUM(platform_commission), 0) as "netProfit"
      FROM daily_finances
    `;
    const statsRes = await pool.query(statsQuery);

    const countsQuery = `
      SELECT 
        (SELECT COUNT(DISTINCT o.order_id) FROM orders o JOIN payments p ON o.order_id = p.order_id WHERE p.payment_status = 'Completed') as "totalOrders",
        (SELECT COUNT(*) FROM products) as "totalProducts",
        (SELECT COUNT(*) FROM customers) as "totalCustomers"
    `;
    const countsRes = await pool.query(countsQuery);

    const payoutQuery = `
      SELECT COALESCE(SUM(amount), 0) as "totalPayouts" 
      FROM seller_payouts 
      WHERE payout_status = 'Processed'
    `;
    const payoutRes = await pool.query(payoutQuery);

    // 2. Trend Data (Last 9 Months - Aggregating from Orders/Payments for accuracy if rollups are empty)
    const trendQuery = `
      SELECT 
        TO_CHAR(o.placed_at, 'Mon') as month, 
        SUM(o.total_amount) as revenue, 
        SUM(o.subtotal * 0.1) as profit,
        COUNT(o.order_id) as orders
      FROM orders o
      JOIN payments p ON o.order_id = p.order_id
      WHERE p.payment_status = 'Completed'
        AND o.placed_at >= CURRENT_DATE - INTERVAL '9 months'
      GROUP BY TO_CHAR(o.placed_at, 'Mon'), EXTRACT(MONTH FROM o.placed_at)
      ORDER BY EXTRACT(MONTH FROM o.placed_at)
    `;
    const trendRes = await pool.query(trendQuery);

    // 2b. Weekly Trend (Last 7 days)
    const weeklyTrendQuery = `
      SELECT 
        TO_CHAR(placed_at, 'Dy') as name, 
        SUM(total_amount) as sales, 
        COUNT(order_id) as orders
      FROM orders
      WHERE placed_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY name, date_trunc('day', placed_at)
      ORDER BY date_trunc('day', placed_at)
    `;
    const weeklyTrendRes = await pool.query(weeklyTrendQuery);

    // 2c. Yearly Trend (Historical)
    const yearlyTrendQuery = `
      SELECT 
        TO_CHAR(placed_at, 'YYYY') as name, 
        SUM(total_amount) as sales, 
        COUNT(order_id) as orders
      FROM orders
      GROUP BY name
      ORDER BY name
    `;
    const yearlyTrendRes = await pool.query(yearlyTrendQuery);

    // 3. Category Breakdown
    const categoryQuery = `
      SELECT c.name, ROUND(SUM(oi.total_price) * 100.0 / NULLIF((SELECT SUM(total_price) FROM order_items), 0), 1) as value
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      JOIN payments py ON oi.order_id = py.order_id
      WHERE py.payment_status = 'Completed'
      GROUP BY c.name
      ORDER BY value DESC
      LIMIT 5
    `;
    const categoryRes = await pool.query(categoryQuery);

    // 4. Product Performance Ranking
    const performanceQuery = `
      SELECT 
        p.name, 
        SUM(oi.quantity) as "unitsSold", 
        COALESCE(AVG(r.rating), 0) as reviews, 
        COUNT(r.review_id) as "reviewCount",
        ROUND(COALESCE(AVG(r.rating), 0) * 20, 0) as performance
      FROM products p
      LEFT JOIN order_items oi ON p.product_id = oi.product_id
      LEFT JOIN reviews r ON p.product_id = r.product_id
      LEFT JOIN payments py ON oi.order_id = py.order_id
      WHERE py.payment_status = 'Completed' OR py.payment_status IS NULL
      GROUP BY p.product_id, p.name
      ORDER BY "unitsSold" DESC NULLS LAST
      LIMIT 5
    `;
    const performanceRes = await pool.query(performanceQuery);

    // 5. Recent Orders
    const recentOrdersQuery = `
      SELECT o.order_id as id, c.full_name as customer, 
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.order_id) as items, 
             o.total_amount as total, o.order_status as status, 
             TO_CHAR(o.placed_at, 'HH12:MI AM') as time
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.placed_at DESC
      LIMIT 5
    `;
    const recentOrdersRes = await pool.query(recentOrdersQuery);

    const s = statsRes.rows[0];
    const c = countsRes.rows[0];
    const p = payoutRes.rows[0];
    const gross = parseFloat(s.grossRevenue);
    const profit = parseFloat(s.netProfit);
    const margin = gross > 0 ? (profit / gross) * 100 : 0;

    res.json({
      stats: {
        totalRevenue: gross,
        totalOrders: parseInt(c.totalOrders),
        totalProducts: parseInt(c.totalProducts),
        totalCustomers: parseInt(c.totalCustomers),
        totalPayouts: parseFloat(p.totalPayouts),
        netProfit: profit,
        profitMargin: margin.toFixed(1)
      },
      revenueTrend: trendRes.rows,
      weeklyTrend: weeklyTrendRes.rows,
      yearlyTrend: yearlyTrendRes.rows,
      categoryData: categoryRes.rows,
      productPerformance: performanceRes.rows.map((p, i) => ({ ...p, rank: i + 1 })),
      recentOrders: recentOrdersRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

// GET ADMIN TRANSACTIONS
router.get('/admin/transactions', async (req, res) => {
  try {
    const query = `
      SELECT 
        ft.finance_transaction_id as id,
        ft.transaction_type as type,
        s.store_name as seller,
        ft.amount,
        ft.created_at as date,
        'Completed' as status
      FROM finance_transactions ft
      LEFT JOIN daily_finances df ON ft.daily_finance_id = df.daily_finance_id
      LEFT JOIN sellers s ON df.seller_id = s.seller_id
      ORDER BY ft.created_at DESC
      LIMIT 100
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// GET ADMIN PAYOUTS
router.get('/admin/payouts', async (req, res) => {
  try {
    const query = `
      SELECT 
        sp.seller_payout_id as id,
        s.store_name as name,
        sp.amount,
        sp.payout_status as status,
        sp.processed_at as date,
        COALESCE((SELECT SUM(total_revenue) FROM daily_finances WHERE seller_id = sp.seller_id), 0) as revenue
      FROM seller_payouts sp
      JOIN sellers s ON sp.seller_id = s.seller_id
      ORDER BY sp.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payouts' });
  }
});

// GET DAILY TREND (Current Week)
router.get('/admin/daily-trend', async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(date, 'Dy') as day,
        SUM(total_revenue) as revenue
      FROM daily_finances
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY TO_CHAR(date, 'Dy'), date
      ORDER BY date
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch daily trend' });
  }
});

// MARK PAYOUT AS COMPLETED
router.post('/admin/payouts/:id/complete', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE seller_payouts SET payout_status = 'Processed', processed_at = CURRENT_TIMESTAMP WHERE seller_payout_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Payout not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update payout' });
  }
});

// GET SELLER ANALYTICS
router.get('/seller/:sellerId/analytics', async (req, res) => {
  const { sellerId } = req.params;
  const { range = 'weekly' } = req.query;

  try {
    let dateInterval = "'7 days'";
    if (range === 'monthly') dateInterval = "'6 months'";
    else if (range === 'yearly') dateInterval = "'5 years'";

    // 1. Overall Stats
    const statsQuery = `
      SELECT 
        COALESCE(SUM(total_revenue), 0) as "totalRevenue",
        COALESCE(SUM(net_seller_earnings), 0) as "netEarnings",
        COALESCE((SELECT COUNT(DISTINCT o.order_id) FROM orders o JOIN order_items oi ON o.order_id = oi.order_id JOIN payments p ON o.order_id = p.order_id WHERE oi.seller_id = $1 AND p.payment_status = 'Completed' AND o.placed_at >= CURRENT_DATE - INTERVAL ${dateInterval}), 0) as "totalOrders"
      FROM daily_finances
      WHERE seller_id = $1 AND date >= CURRENT_DATE - INTERVAL ${dateInterval}
    `;
    const statsRes = await pool.query(statsQuery, [sellerId]);

    // 2. Trend Data based on range
    let trendQuery = '';
    if (range === 'weekly') {
      trendQuery = `
        SELECT 
          TO_CHAR(df.date, 'Dy') as label, 
          COALESCE(SUM(ft.amount), 0) as revenue, 
          COUNT(ft.finance_transaction_id) as orders
        FROM daily_finances df
        LEFT JOIN finance_transactions ft ON df.daily_finance_id = ft.daily_finance_id
        WHERE df.seller_id = $1 AND df.date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY df.date, TO_CHAR(df.date, 'Dy')
        ORDER BY df.date
      `;
    } else if (range === 'monthly') {
      trendQuery = `
        SELECT 
          TO_CHAR(df.date, 'Mon') as label, 
          COALESCE(SUM(ft.amount), 0) as revenue, 
          COUNT(ft.finance_transaction_id) as orders
        FROM daily_finances df
        LEFT JOIN finance_transactions ft ON df.daily_finance_id = ft.daily_finance_id
        WHERE df.seller_id = $1 AND df.date >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY TO_CHAR(df.date, 'Mon'), EXTRACT(MONTH FROM df.date)
        ORDER BY EXTRACT(MONTH FROM df.date)
      `;
    } else { // yearly
      trendQuery = `
        SELECT 
          TO_CHAR(df.date, 'YYYY') as label, 
          COALESCE(SUM(ft.amount), 0) as revenue, 
          COUNT(ft.finance_transaction_id) as orders
        FROM daily_finances df
        LEFT JOIN finance_transactions ft ON df.daily_finance_id = ft.daily_finance_id
        WHERE df.seller_id = $1 AND df.date >= CURRENT_DATE - INTERVAL '5 years'
        GROUP BY TO_CHAR(df.date, 'YYYY')
        ORDER BY TO_CHAR(df.date, 'YYYY')
      `;
    }
    const trendRes = await pool.query(trendQuery, [sellerId]);

    // 3. Category Breakdown (Based on Sales Revenue)
    const catQuery = `
      SELECT c.name, COALESCE(SUM(oi.total_price), 0) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      JOIN payments py ON oi.order_id = py.order_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE oi.seller_id = $1 AND py.payment_status = 'Completed' AND o.placed_at >= CURRENT_DATE - INTERVAL ${dateInterval}
      GROUP BY c.name
    `;
    const catRes = await pool.query(catQuery, [sellerId]);
    const totalRev = catRes.rows.reduce((sum, r) => sum + parseFloat(r.revenue), 0);
    const categoryBreakdown = catRes.rows.map((r, i) => ({
      name: r.name,
      value: totalRev > 0 ? Math.round((parseFloat(r.revenue) / totalRev) * 100) : 0,
      color: ['#10B981', '#34D399', '#f59e0b', '#f97316', '#64748b'][i % 5]
    }));

    res.json({
      stats: statsRes.rows[0],
      trend: trendRes.rows,
      categories: categoryBreakdown
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch seller analytics' });
  }
});

module.exports = router;
