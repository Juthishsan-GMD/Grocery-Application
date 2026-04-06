import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart2, MessageSquare,
  CreditCard, Settings, Bell, Search, ChevronDown, Star, TrendingUp,
  TrendingDown, Edit2, Trash2, Plus, Eye, Send, Check, Clock, Truck,
  Filter, Download, Moon, Sun, Menu, X, ChevronRight, ArrowUpRight,
  ArrowDownRight, Shield, Store, Mail, Phone, MapPin, Lock, ToggleLeft,
  ToggleRight, LogOut, User, Zap, Award, RefreshCw, AlertCircle, IndianRupee,
  ShoppingBag, Users, Tag, ArrowLeft, Upload, Image as ImageIcon, CheckCircle2,
  Package as PackageIcon
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { products as staticProducts } from "../../constants/data";
import { useProducts } from "../../contexts/ProductContext";

// ─── DUMMY DATA ──────────────────────────────────────────────────────────────

const SELLER = {
  name: "Arjun Mehta",
  storeName: "FreshBasket™",
  email: "seller@freshbasket.com",
  phone: "+91 99887 76655",
  location: "Surat, Gujarat",
  avatar: null,
  verified: true,
  joined: "Apr 2024",
  rating: 4.9,
};

const CATEGORIES = ["All", "Vegetables", "Fruits", "Dairy", "Bakery", "Meat", "Beverages", "Snacks"];

const generateProducts = () => [
  { id: 1, name: "Organic Tomatoes (1kg)", price: 45, category: "Vegetables", stock: 120, sold: 870, image: "OT", status: "active" },
  { id: 2, name: "Fresh Milk (1L)", price: 65, category: "Dairy", stock: 50, sold: 1200, image: "FM", status: "active" },
  { id: 3, name: "Sourdough Bread", price: 95, category: "Bakery", stock: 15, sold: 450, image: "SB", status: "active" },
  { id: 4, name: "Alphonso Mangoes (1dz)", price: 850, category: "Fruits", stock: 30, sold: 120, image: "AM", status: "active" },
  { id: 5, name: "Free-range Eggs (12pc)", price: 180, category: "Dairy", stock: 40, sold: 600, image: "FE", status: "active" },
  { id: 6, name: "Greek Yogurt (500g)", price: 210, category: "Dairy", stock: 25, sold: 340, image: "GY", status: "active" },
  { id: 7, name: "Carrots (500g)", price: 30, category: "Vegetables", stock: 80, sold: 920, image: "CR", status: "active" },
  { id: 8, name: "Cold Brew Coffee (250ml)", price: 120, category: "Beverages", stock: 60, sold: 280, image: "CB", status: "active" },
];

const generateOrders = () => [
  { id: "ORD-001", customer: "Priya Sharma", product: "22K Gold Bangles Set", amount: 42500, status: "Delivered", date: "2025-03-24", city: "Delhi", trackingId: "TRK100234" },
  { id: "ORD-002", customer: "Rahul Nair", product: "Diamond Tennis Bracelet", amount: 210000, status: "Shipped", date: "2025-03-25", city: "Bangalore", trackingId: "TRK567890" },
  { id: "ORD-003", customer: "Sneha Patel", product: "925 Silver Anklet Pair", amount: 3200, status: "Pending", date: "2025-03-26", city: "Ahmedabad", trackingId: "TRK223344" },
  { id: "ORD-004", customer: "Karthik Raj", product: "Solitaire Diamond Ring", amount: 135000, status: "Delivered", date: "2025-03-22", city: "Chennai", trackingId: "TRK334455" },
  { id: "ORD-005", customer: "Divya Menon", product: "Emerald Pendant Necklace", amount: 67500, status: "Shipped", date: "2025-03-27", city: "Kochi", trackingId: "TRK445566" },
  { id: "ORD-006", customer: "Amit Verma", product: "Platinum Wedding Band", amount: 28000, status: "Pending", date: "2025-03-28", city: "Pune", trackingId: "TRK556677" },
  { id: "ORD-007", customer: "Meera Iyer", product: "Gold Chain Necklace 18K", amount: 31000, status: "Delivered", date: "2025-03-20", city: "Hyderabad", trackingId: "TRK667788" },
  { id: "ORD-008", customer: "Rohan Gupta", product: "Silver Filigree Earrings", amount: 1800, status: "Pending", date: "2025-03-29", city: "Jaipur", trackingId: "TRK778899" },
];

const generateMessages = () => [
  { id: 1, customer: "Priya Sharma", avatar: "PS", message: "Is the 22K bangle set available in size 2.6?", time: "10:32 AM", unread: true, replies: [] },
  { id: 2, customer: "Rahul Nair", avatar: "RN", message: "Can I get a custom engraving on the bracelet?", time: "Yesterday", unread: true, replies: ["Hi Rahul! Yes, we offer custom engraving. Please share the text you'd like."] },
  { id: 3, customer: "Sneha Patel", avatar: "SP", message: "What's the return policy for silver items?", time: "2 days ago", unread: false, replies: [] },
  { id: 4, customer: "Karthik Raj", avatar: "KR", message: "My order is showing delayed. When will it arrive?", time: "3 days ago", unread: false, replies: ["Sorry for the delay! Your order is on the way and will arrive within 2 days."] },
];

const generateReviews = () => [
  { id: 1, customer: "Priya Sharma", product: "22K Gold Bangles Set", rating: 5, comment: "Absolutely stunning quality! The finish is impeccable and my family loved the bangles.", date: "Mar 20, 2025", replied: false },
  { id: 2, customer: "Karthik Raj", product: "Solitaire Diamond Ring", rating: 5, comment: "Perfect ring for my proposal. The diamond sparkles beautifully!", date: "Mar 18, 2025", replied: true, reply: "Thank you so much! Wishing you both a wonderful journey ahead! 💍" },
  { id: 3, customer: "Meera Iyer", product: "Gold Chain Necklace 18K", rating: 4, comment: "Beautiful craftsmanship. Slight delay in delivery but worth the wait.", date: "Mar 15, 2025", replied: false },
  { id: 4, customer: "Divya Menon", product: "Emerald Pendant Necklace", rating: 5, comment: "The pendant is even more gorgeous in person. Love the packaging too!", date: "Mar 10, 2025", replied: true, reply: "We're so glad you loved it! The packaging is designed to match our jewelry quality." },
];

const generatePayments = () => [
  { id: "PAY-001", date: "Mar 25, 2025", amount: 252500, orders: 3, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-002", date: "Mar 18, 2025", amount: 138200, orders: 2, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-003", date: "Mar 11, 2025", amount: 97800, orders: 4, status: "Completed", method: "UPI" },
  { id: "PAY-004", date: "Mar 04, 2025", amount: 315600, orders: 5, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-005", date: "Apr 01, 2025", amount: 68700, orders: 2, status: "Pending", method: "Bank Transfer" },
];

// Enhanced cancelled products dummy data with all required fields
const CANCELLED_PRODUCTS = [
  {
    id: 1,
    productName: "Wireless Earbuds",
    trackingId: "TRK112233",
    adminApproval: "Pending",
    shiprocketStatus: "In Transit",
    status: "cancelled",
    name: "Wireless Earbuds",
    cancelledCount: 1
  },
  {
    id: 2,
    productName: "Smartphone Case",
    trackingId: "TRK445566",
    adminApproval: "Approved",
    shiprocketStatus: "Returned",
    status: "cancelled",
    name: "Smartphone Case",
    cancelledCount: 1
  },
  {
    id: 3,
    productName: "Bluetooth Speaker",
    trackingId: "TRK778899",
    adminApproval: "Rejected",
    shiprocketStatus: "Not Shipped",
    status: "cancelled",
    name: "Bluetooth Speaker",
    cancelledCount: 1
  }
];

// Revenue data generators
const genWeeklyData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(d => ({ time: d, revenue: Math.floor(Math.random() * 45000 + 12000) }));
};
const genTodayData = () => {
  const hours = ["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];
  return hours.map(h => ({ time: h, revenue: Math.floor(Math.random() * 35000 + 5000) }));
};
const genYesterdayData = () => {
  const hours = ["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];
  return hours.map(h => ({ time: h, revenue: Math.floor(Math.random() * 28000 + 4000) }));
};
const genMonthlyData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    time: `Mar ${i + 1}`,
    revenue: Math.floor(Math.random() * 120000 + 20000),
  }));
};
const genMonthlyBar = () => {
  const months = ["Oct","Nov","Dec","Jan","Feb","Mar"];
  return months.map(m => ({ month: m, revenue: Math.floor(Math.random() * 900000 + 200000), orders: Math.floor(Math.random() * 80 + 20) }));
};

const PIE_DATA = [
  { name: "Vegetables", value: 35, color: "#10B981" },
  { name: "Fruits", value: 25, color: "#34D399" },
  { name: "Dairy", value: 20, color: "#6EE7B7" },
  { name: "Bakery", value: 15, color: "#FBBF24" },
  { name: "Other", value: 5, color: "#FDE68A" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;

const statusColor = (s) => {
  if (s === "Delivered") return { bg: "rgba(134,239,172,0.15)", text: "#16a34a", dot: "#16a34a" };
  if (s === "Shipped") return { bg: "rgba(147,197,253,0.15)", text: "#2563eb", dot: "#2563eb" };
  return { bg: "rgba(253,224,71,0.15)", text: "#ca8a04", dot: "#ca8a04" };
};

const avatarBg = (str) => {
  const colors = ["#10B981","#93c5fd","#86efac","#f9a8d4","#a78bfa","#34d399"];
  let h = 0; for (let c of str) h = c.charCodeAt(0) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

const isImg = (s) => s && (s.startsWith("data:image") || s.startsWith("http") || s.startsWith("/"));

// ─── SKELETON ────────────────────────────────────────────────────────────────

const Skeleton = ({ w = "100%", h = 20, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: "var(--sk)", animation: "skeleton 1.4s ease infinite" }} />
);

// ─── MAIN APP ────────────────────────────────────────────────────────────────

 function App() {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const pathname = location.pathname.replace(/^\/seller\//, "") || "dashboard";
    const validPages = ["dashboard","products","orders","analytics","notifications","payments","reviews","settings"];
    if (validPages.includes(pathname)) {
      setPage(pathname);
    }
  }, [location.pathname]);

  const { products: contextProducts, addProduct: hookAddProduct, removeProduct, updateProduct } = useProducts();

  const [products, setProducts] = useState([]);
  const [orders] = useState(generateOrders);
  const [messages, setMessages] = useState(generateMessages);
  const [reviews, setReviews] = useState(generateReviews);

  useEffect(() => {
    setProducts(contextProducts);
  }, [contextProducts]);

  useEffect(() => { 
   
  }, []);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  const D = dark ? DARK : LIGHT;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "notifications", label: "Notifications", icon: MessageSquare, badge: messages.filter(m => m.unread).length },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  

  const renderPage = () => {
    const props = { products, setProducts, orders, messages, setMessages, reviews, setReviews, D, dark, loading, hookAddProduct, removeProduct, updateProduct };
    switch (page) {
      case "dashboard": return <DashboardPage {...props} />;
      case "products": return <ProductsPage {...props} />;
      case "orders": return <OrdersPage {...props} />;
      case "analytics": return <AnalyticsPage {...props} />;
      case "notifications": return <MessagesPage {...props} />;
      case "payments": return <PaymentsPage {...props} D={D} />;
      case "reviews": return <ReviewsPage {...props} />;
      case "settings": return <SettingsPage {...props} dark={dark} setDark={setDark} />;
      default: return <DashboardPage {...props} />;
    }
  };

  return (
    <div style={{ ...styles.root, background: D.bg, color: D.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh" }}>
      <style>{CSS(D) + ANIMATIONS}</style>

      <aside style={{ ...styles.sidebar, background: D.card, borderRight: `1px solid ${D.border}`, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", boxShadow: "4px 0 24px rgba(0,0,0,0.06)" }}>
        <div style={styles.sidebarLogo}>
          <div style={{ ...styles.logoMark, background: "linear-gradient(135deg, #10B981, #34D399)" }}>
            <ShoppingBag size={18} color="#fff" />
          </div>
          {sidebarOpen && (
            <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#10B981", letterSpacing: "-0.3px" }}>FreshBasket™</div>
              <div style={{ fontSize: 11, color: D.muted, marginTop: 1 }}>Seller Hub</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: "0px 0px", margin:0,overflowY: "auto" }}>
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => { setPage(id); navigate("/seller/" + id); }} style={{ ...styles.navItem, background: page === id ? "linear-gradient(135deg, rgba(201,161,74,0.15), rgba(201,161,74,0.05))" : "transparent", color: page === id ? "#10B981" : D.muted, borderLeft: page === id ? "3px solid #10B981" : "3px solid transparent" }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, fontWeight: page === id ? 600 : 400 }}>{label}</span>
              {badge > 0 && <span style={{ ...styles.badge, marginLeft: "auto" }}>{badge}</span>}
            </button>
          ))}
        </nav>

       
      </aside>

      <div style={{ ...styles.main, marginLeft: sidebarOpen ? 240 : 0 }}>
        <header style={{ ...styles.topbar, background: D.card, borderBottom: `1px solid ${D.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={styles.iconBtn}>
              <Menu size={20} color={D.muted} />
            </button>
            <div style={{ ...styles.searchBar, background: D.bg, border: `1px solid ${D.border}` }}>
              <Search size={15} color={D.muted} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, orders..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13.5, color: D.text, width: "100%" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setDark(p => !p)} style={styles.iconBtn}>
              {dark ? <Sun size={18} color={D.muted} /> : <Moon size={18} color={D.muted} />}
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }} style={{ ...styles.profileBtn, border: `2px solid ${D.border}` }}>
                <div style={{ ...styles.avatar, width: 32, height: 32, background: "#10B981", fontSize: 12 }}>AM</div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{SELLER.name.split(" ")[0]}</span>
                <ChevronDown size={14} color={D.muted} />
              </button>
              {profileOpen && (
                <div style={{ ...styles.dropdown, background: D.card, border: `1px solid ${D.border}`, right: 0, width: 200 }}>
                  {[{ icon: User, label: "My Profile" }, { icon: LogOut, label: "Sign Out" }].map(({ icon: Icon, label }) => (
                    <button key={label} onClick={() => { if (label === "My Profile") setPage("settings"); setProfileOpen(false); }} style={{ ...styles.dropItem, color: label === "Sign Out" ? "#ef4444" : D.text }}>
                      <Icon size={15} /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ padding: "28px 28px 40px", minHeight: "calc(100vh - 60px)" }}>
          {renderPage()}
        </main>
      </div>

      {(notifOpen || profileOpen) && <div onClick={() => { setNotifOpen(false); setProfileOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 99 }} />}
    </div>
  );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────

function DashboardPage({ products, orders, D, loading }) {
  const navigate = useNavigate();
  const safeProducts = products || [];
  const safeOrders = orders || [];

  const [revenueFilter, setRevenueFilter] = useState("weekly");
  const [weeklyData] = useState(genWeeklyData);
  const [yesterdayData] = useState(genYesterdayData);
  const [monthlyData] = useState(genMonthlyData);

  const revenueData = revenueFilter === "weekly" ? weeklyData : revenueFilter === "yesterday" ? yesterdayData : monthlyData;
  const totalRevenue = revenueData?.reduce((s, d) => s + (d?.revenue || 0), 0) || 0;
  const prevRevenue = revenueFilter === "weekly" 
    ? (weeklyData?.reduce((s, d) => s + (d?.revenue || 0), 0) || 0) * 0.94 
    : totalRevenue * 0.91;
  const pctChange = prevRevenue !== 0 ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : 0;
  const up = pctChange > 0;

  // Derive counts from products data - LIVE DATA
  const mostSoldCount = useMemo(() => {
    return safeProducts.filter(p => p && p.sold > 50).length;
  }, [safeProducts]);

  const leastSoldCount = useMemo(() => {
    return safeProducts.filter(p => p && p.sold < 20).length;
  }, [safeProducts]);

  const cancelledCount = useMemo(() => {
    return safeProducts.filter(p => p && p.status === "cancelled").length;
  }, [safeProducts]);

  const handleRevenueClick = () => {
    navigate('/seller/analytics');
  };

  const handleMostSoldClick = () => {
    navigate('/seller/products?view=most');
  };
  
  const handleLeastSoldClick = () => {
    navigate('/seller/products?view=least');
  };
  
  const handleCancelledClick = () => {
    navigate('/seller/products?view=cancelled');
  };
  
  const stats = [
    { 
      label: "Total Revenue", 
      value: "₹18.4L", 
      sub: "+12.5% this month", 
      icon: IndianRupee, 
      color: "#10B981", 
      bg: "rgba(16,185,129,0.1)",
      onClick: handleRevenueClick
    },
    { 
      label: "Most Sold Products", 
      value: mostSoldCount || 0, 
      sub: `${mostSoldCount} top selling items`, 
      icon: ShoppingBag, 
      color: "#60a5fa", 
      bg: "rgba(96,165,250,0.1)",
      onClick: handleMostSoldClick
    },
    { 
      label: "Least Sold Products", 
      value: leastSoldCount || 0, 
      sub: `${leastSoldCount} low performing items`, 
      icon: Package, 
      color: "#34d399", 
      bg: "rgba(52,211,153,0.1)",
      onClick: handleLeastSoldClick
    },
    { 
      label: "Most Cancelled Products", 
      value: cancelledCount || 0, 
      sub: `${cancelledCount} items with cancellations`, 
      icon: Users, 
      color: "#a78bfa", 
      bg: "rgba(167,139,250,0.1)",
      onClick: handleCancelledClick
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${SELLER.name?.split(" ")[0] || "Seller"}! `} D={D} />

      <div style={{ ...styles.card(D), background: "linear-gradient(135deg, #1a1208 0%, #2d1e08 50%, #1a1208 100%)", padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(201,161,74,0.08)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -60, width: 160, height: 160, borderRadius: "50%", background: "rgba(201,161,74,0.05)" }} />
        <div style={{ ...styles.avatar, width: 64, height: 64, background: "linear-gradient(135deg, #10B981, #f0c97a)", fontSize: 22, fontWeight: 700, flexShrink: 0, boxShadow: "0 0 0 4px rgba(201,161,74,0.3)" }}>AM</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{SELLER.storeName || "LuxeJewels™"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(201,161,74,0.2)", border: "1px solid rgba(201,161,74,0.4)", color: "#10B981", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
              <Shield size={10} /> Verified Seller
            </span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{SELLER.name || "Arjun Mehta"} · {SELLER.email || "arjun@luxejewels.com"} · Member since {SELLER.joined || "Jan 2022"}</div>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            {[["4.8★", "Rating"], ["937", "Sales"], ["₹18.4L", "Revenue"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: "#10B981", fontWeight: 700, fontSize: 16 }}>{v}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <button style={{ ...styles.goldBtn, flexShrink: 0 }}><Edit2 size={14} /> Edit Profile</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {stats.map((s, i) => (
          <div 
            key={i} 
            onClick={s.onClick} 
            style={{ 
              ...styles.card(D), 
              padding: "20px 22px", 
              display: "flex", 
              gap: 14, 
              alignItems: "flex-start",
              cursor: s.onClick ? "pointer" : "default",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              if (s.onClick) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (s.onClick) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {loading ? <><Skeleton w={44} h={44} r={12} /><div style={{ flex: 1 }}><Skeleton w="60%" h={14} /><Skeleton w="80%" h={22} /></div></> : (
              <>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: D.muted, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#16a34a", marginTop: 3 }}>{s.sub}</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ ...styles.card(D), padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Revenue Analytics</div>
            {loading ? <Skeleton w={160} h={36} /> : (
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#10B981" }}>{fmtShort(totalRevenue)}</span>
                <span style={{ fontSize: 13, color: up ? "#16a34a" : "#ef4444", display: "flex", alignItems: "center", gap: 3 }}>
                  {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {up ? "+" : ""}{pctChange}%
                </span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["weekly", "yesterday", "monthly"].map(f => (
              <button key={f} onClick={() => setRevenueFilter(f)} style={{ ...styles.filterBtn, background: revenueFilter === f ? "#10B981" : D.bg, color: revenueFilter === f ? "#fff" : D.muted, border: `1px solid ${revenueFilter === f ? "#10B981" : D.border}` }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading ? <Skeleton w="100%" h={220} r={12} /> : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} />
              <Tooltip content={<CustomTooltip D={D} />} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#goldGrad)" dot={false} activeDot={{ r: 5, fill: "#10B981" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <div style={{ ...styles.card(D), padding: 24, maxWidth: "800px", width: "100%" }}>
          <SectionHeader title="Recent Orders" action="View All" D={D} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} h={48} r={10} />) :
              safeOrders.slice(0, 5).map((o, i) => {
                const sc = statusColor(o?.status || "Pending");
                return (
                  <div key={`order-${o?.id || i}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: D.bg, borderRadius: 10 }}>
                    <div style={{ ...styles.avatar, width: 34, height: 34, background: avatarBg(o?.customer || "User"), fontSize: 12 }}>{(o?.customer || "U").split(" ").map(w => w[0]).join("")}</div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o?.customer || "Unknown"}</div>
                      <div style={{ fontSize: 11, color: D.muted }}>{o?.id || "N/A"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{fmtShort(o?.amount || 0)}</div>
                      <span style={{ fontSize: 11, background: sc.bg, color: sc.text, padding: "1px 7px", borderRadius: 20, display: "inline-block" }}>{o?.status || "Pending"}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BACK BUTTON ─────────────────────────────────────────────────────────────

function BackButton({ label = "← Back to Products", to = "/seller/products", D }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      style={{
        ...styles.outlineBtn(D),
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
}

const CATEGORY_OPTIONS = ["Fresh Vegetables", "Fresh Fruits", "Dairy & Eggs", "Breads & Bakery", "Beverages", "Snacks"];

const SUBCATEGORY_OPTIONS = {
  "Fresh Vegetables": ["Root", "Leafy Greens", "Cruciferous", "Marrows"],
  "Fresh Fruits":     ["Citrus", "Berries", "Tropical", "Melons"],
  "Dairy & Eggs":     ["Milk", "Cheese", "Yogurt", "Eggs"],
  "Breads & Bakery":  ["Breads", "Pastries", "Cakes", "Cookies"],
  "Beverages":        ["Juices", "Tea", "Coffee", "Water", "Soft Drinks"],
  "Snacks":           ["Chips", "Nuts", "Chocolates", "Popcorn"],
};

const UNIT_OPTIONS = ["1 kg", "500 g", "250 g", "100 g", "1 pc", "1 Pack", "1 Liter", "500 ml", "1 Dozen"];

const selectClass = "flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200";

// ─── PRODUCT EDITOR ──────────────────────────────────────────────────────────

function ProductEditor({ editProduct, onSave, onCancel, D, dark }) {
  const [form, setForm] = useState({
    name: editProduct?.name || "",
    sku: editProduct?.sku || "",
    category: editProduct?.category ? editProduct.category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Fresh Vegetables",
    subCategory: editProduct?.subCategory || editProduct?.subcategory || "",
    price: editProduct?.price || "",
    mrp: editProduct?.mrp || editProduct?.price || "",
    stock: editProduct?.stock || "",
    description: editProduct?.description || "",
    unit: editProduct?.unit || "1 kg",
    images: editProduct?.images || (editProduct?.imageData ? [editProduct.imageData] : []),
    featured: editProduct?.featured || false,
    status: editProduct?.status || "active"
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm(p => ({ ...p, category: value, subCategory: "" }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(p => ({ ...p, images: [...(p.images || []), reader.result] }));
        if (errors.images) setErrors(p => ({ ...p, images: "" }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required";
    if (!form.subCategory) errs.subCategory = "Please select a subcategory";
    if (!form.price || Number(form.price) <= 0) errs.price = "Valid price required";
    if (!form.stock && form.stock !== "0") errs.stock = "Stock count required";
    if (form.images.length === 0) errs.images = "Upload at least one product image";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = async () => {
    if (!validate()) return;
    setSubmitting(true);
    
    // Normalize category and subcategory for saving
    const finalProduct = {
      ...form,
      id: editProduct?.id || `seller-${Date.now()}`,
      category: form.category.toLowerCase().trim(),
      subCategory: (form.subCategory || "").toLowerCase().trim(),
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      stock: Number(form.stock),
      image: form.images[0],
      isNew: !editProduct,
      rating: editProduct?.rating || 4.5,
      seller: SELLER.storeName
    };

    await onSave(finalProduct);
    setSubmitting(false);
  };

  const currentSubcategories = SUBCATEGORY_OPTIONS[form.category] || SUBCATEGORY_OPTIONS["Fresh Vegetables"];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              onClick={onCancel} 
              style={{ 
                height: "40px", width: "40px", display: "flex", alignItems: "center", justifyContent: "center", 
                background: "transparent", border: `1px solid ${D.border}`, borderRadius: "12px", 
                cursor: "pointer", color: D.text, transition: "all 0.2s" 
              }}
              onMouseEnter={e => e.currentTarget.style.background = D.bg}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: D.text, margin: 0 }}>
                {editProduct ? "Edit Fresh Item" : "Add Fresh Item"}
              </h1>
              <p style={{ color: D.muted, fontSize: "14px", margin: "4px 0 0 0" }}>
                List a new grocery product to the marketplace
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
             <Button variant="outline" onClick={onCancel} style={{ borderRadius: "12px" }}>Discard</Button>
             <Button 
               onClick={handlePublish} 
               disabled={submitting} 
               style={{ 
                 padding: "0 32px", height: "44px", borderRadius: "12px", 
                 background: "#10B981", color: "#fff", fontWeight: "600",
                 border: "none"
               }}
             >
               {submitting ? "Processing..." : "Publish Product"}
             </Button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
          {/* Main Grid for layout parity with Admin */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px", alignItems: "start" }}>
              
              {/* Left Column: Form Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* General Information Card */}
                <div style={{ ...styles.card(D), padding: "24px", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", paddingBottom: "16px", borderBottom: `1px solid ${D.border}` }}>
                    <ShoppingBag size={20} color="#10B981" />
                    <h3 style={{ fontWeight: "700", fontSize: "18px", margin: 0 }}>Product Details</h3>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Product Name *</label>
                      <Input 
                        name="name" value={form.name} onChange={handleChange} 
                        placeholder="e.g. Organic Cavendish Bananas" 
                        style={{ height: "48px", borderRadius: "12px", color: D.text, background: D.bg }}
                      />
                      {errors.name && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.name}</p>}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div>
                         <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Category *</label>
                         <select name="category" value={form.category} onChange={handleCategoryChange} className={selectClass} style={{ background: D.bg, color: D.text }}>
                           {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                      <div>
                         <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Subcategory *</label>
                         <select name="subCategory" value={form.subCategory} onChange={handleChange} className={selectClass} style={{ background: D.bg, color: D.text }}>
                           <option value="">Select Option</option>
                           {currentSubcategories.map((s) => <option key={s} value={s}>{s}</option>)}
                         </select>
                         {errors.subCategory && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.subCategory}</p>}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Description *</label>
                      <Textarea
                        name="description" value={form.description} onChange={handleChange} rows={6}
                        placeholder="Tell customers about the freshness, farm source, and benefits..."
                        style={{ borderRadius: "12px", color: D.text, background: D.bg, minHeight: "150px" }}
                      />
                      {errors.description && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.description}</p>}
                    </div>
                  </div>
                </div>

                {/* Images & Inventory Card */}
                <div style={{ ...styles.card(D), padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", paddingBottom: "16px", borderBottom: `1px solid ${D.border}` }}>
                    <ImageIcon size={20} color="#10B981" />
                    <h3 style={{ fontWeight: "700", fontSize: "18px", margin: 0 }}>Images & Inventory</h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                      <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", display: "block" }}>Upload Product Images *</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                        {form.images.map((img, i) => (
                          <div key={i} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "12px", overflow: "hidden", border: `1px solid ${D.border}`, background: D.bg, group: "true" }}>
                            <img src={img} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button type="button" onClick={() => removeImage(i)}
                              style={{ 
                                position: "absolute", top: "8px", right: "8px", width: "28px", height: "28px", 
                                background: "rgba(239, 68, 68, 0.9)", color: "white", borderRadius: "50%", 
                                border: "none", display: "flex", alignItems: "center", justifyContent: "center", 
                                cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" 
                              }}>
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        {form.images.length < 4 && (
                          <label style={{ 
                            aspectRatio: "1/1", borderRadius: "12px", border: `2px dashed ${D.border}`, 
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                            cursor: "pointer", transition: "all 0.3s", background: "transparent"
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "#10B981"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = D.border}
                          >
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: D.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                              <Upload size={20} color={D.muted} />
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: "600", color: D.muted }}>Add Image</span>
                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
                          </label>
                        )}
                      </div>
                      {errors.images && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "12px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.images}</p>}
                    </div>

                    <div style={{ height: "1px", background: D.border }} />

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Sell Price (₹) *</label>
                        <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="99" style={{ height: "48px", borderRadius: "12px", background: D.bg, color: D.text }} />
                        {errors.price && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px" }}>{errors.price}</p>}
                      </div>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>MRP (₹) *</label>
                        <Input name="mrp" type="number" value={form.mrp} onChange={handleChange} placeholder="120" style={{ height: "48px", borderRadius: "12px", background: D.bg, color: D.text }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block" }}>Stock Quantity *</label>
                        <Input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="100" style={{ height: "48px", borderRadius: "12px", background: D.bg, color: D.text }} />
                        {errors.stock && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "6px" }}>{errors.stock}</p>}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", display: "block" }}>Unit/Weight Range *</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {UNIT_OPTIONS.map((u) => (
                          <button 
                            key={u} 
                            type="button" 
                            onClick={() => setForm(p => ({ ...p, unit: u }))}
                            style={{ 
                              padding: "10px 16px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", 
                              border: `1px solid ${form.unit === u ? "#10B981" : D.border}`,
                              background: form.unit === u ? "#10B981" : "transparent",
                              color: form.unit === u ? "#fff" : D.muted,
                              cursor: "pointer", transition: "all 0.2s",
                              boxShadow: form.unit === u ? "0 4px 10px rgba(16,185,129,0.2)" : "none",
                              transform: form.unit === u ? "scale(1.05)" : "scale(1)"
                            }}>
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sidebar Preview */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "24px" }}>
                
                {/* Live Preview Card */}
                <div style={{ ...styles.card(D), overflow: "hidden" }}>
                  <div style={{ padding: "16px", background: "rgba(16,185,129,0.05)", borderBottom: `1px solid ${D.border}` }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                      <ImageIcon size={16} color="#10B981" /> Store Preview
                    </h3>
                  </div>
                  
                  <div style={{ padding: "24px", display: "flex", justifyContent: "center", background: D.bg }}>
                    <div style={{ 
                      width: "100%", maxWidth: "240px", background: dark ? "#313131" : "#fff", 
                      borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", overflow: "hidden", 
                      border: `1px solid ${D.border}`, transition: "all 0.3s" 
                    }}>
                      <div style={{ position: "relative", aspectRatio: "4/5", background: dark ? "#404040" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {form.images[0] ? (
                          <img src={form.images[0]} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImageIcon size={40} color={D.muted} style={{ opacity: 0.2 }} />
                        )}
                        {form.price && form.mrp && Number(form.mrp) > Number(form.price) && (
                          <div style={{ position: "absolute", top: "12px", left: "12px", background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: "800", padding: "4px 8px", borderRadius: "8px" }}>
                            {Math.round(((form.mrp - form.price) / form.mrp) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "800", color: "#10B981", textTransform: "uppercase", letterSpacing: "1px" }}>{form.category}</div>
                        <h4 style={{ fontWeight: "700", fontSize: "14px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.name || "Product Title"}</h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: "800", fontSize: "18px", color: D.text }}>₹{form.price || "0"}</span>
                          {form.mrp && <span style={{ fontSize: "11px", color: D.muted, textDecoration: "line-through" }}>₹{form.mrp}</span>}
                          <span style={{ fontSize: "11px", color: D.muted }}>/ {form.unit}</span>
                        </div>
                        <button style={{ 
                          width: "100%", height: "36px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", 
                          color: "#10B981", fontSize: "12px", fontWeight: "700", border: "none", cursor: "default" 
                        }}>
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: "24px", borderTop: `1px solid ${D.border}`, display: "flex", flexDirection: "column", gap: "16px" }}>
                    <label style={{ 
                      display: "flex", alignItems: "center", gap: "12px", padding: "12px", 
                      borderRadius: "12px", border: `1px solid ${D.border}`, background: D.bg, 
                      cursor: "pointer", transition: "all 0.2s" 
                    }}>
                      <input 
                        type="checkbox" 
                        name="featured" 
                        checked={form.featured} 
                        onChange={handleChange}
                        style={{ width: "18px", height: "18px", borderRadius: "4px", accentColor: "#10B981", cursor: "pointer" }} 
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: D.text }}>Featured Item</span>
                        <span style={{ fontSize: "11px", color: D.muted }}>Show in recommended sections</span>
                      </div>
                      {form.featured && <CheckCircle2 size={16} color="#10B981" style={{ marginLeft: "auto" }} />}
                    </label>

                    <div style={{ background: "rgba(16,185,129,0.05)", borderRadius: "12px", padding: "16px", border: `1px solid rgba(16,185,129,0.1)` }}>
                      <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                         <CheckCircle2 size={16} color="#10B981" style={{ marginTop: "2px" }} />
                         <div>
                           <p style={{ fontSize: "12px", fontWeight: "700", color: "#10B981", margin: "0 0 4px 0" }}>Visibility Status</p>
                           <p style={{ fontSize: "10px", color: "#10B981", opacity: 0.7, margin: 0, lineHeight: "1.4" }}>Once published, this product will be immediately discoverable in the shop category.</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS PAGE ───────────────────────────────────────────────────────────

function ProductsPage({ products, setProducts, D, dark, loading, orders = [], hookAddProduct, removeProduct, updateProduct }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search || "");
  const viewMode = searchParams.get("view");

  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editorView, setEditorView] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [view, setView] = useState("table");
  const { toast } = useToast();

  const availableCategories = useMemo(() => {
    return CATEGORY_OPTIONS;
  }, []);
  
  const filterCategories = ["All", ...availableCategories];

  const safeProducts = products || [];
  const safeOrders = orders || [];
  
  const filtered = safeProducts.filter(p => {
    if (!p) return false;
    
    const pCat = (p.category || "").toLowerCase().trim();
    const selCat = catFilter.toLowerCase().trim();
    
    const matchesCat = selCat === "all" || pCat === selCat;
    const matchesSearch = (p.name || "").toLowerCase().includes((search || "").toLowerCase());
    
    return matchesCat && matchesSearch;
  });

  console.log("SELECTED:", catFilter);
  console.log("FILTERED:", filtered);

  const topProducts = [...safeProducts]
    .sort((a, b) => (b?.sold || 0) - (a?.sold || 0))
    .slice(0, 5);

  const leastSoldProducts = [...safeProducts]
    .sort((a, b) => (a?.sold || 0) - (b?.sold || 0))
    .slice(0, 5);

  const cancelledProducts = (() => {
    try {
      if (!safeOrders || !Array.isArray(safeOrders) || safeOrders.length === 0) {
        return [];
      }
      
      const cancelCountMap = {};
      
      safeOrders.forEach(order => {
        if (order?.status === "cancelled") {
          (order?.items || []).forEach(item => {
            const productId = item?.productId;
            const quantity = item?.quantity || 0;
            if (productId) {
              cancelCountMap[productId] = (cancelCountMap[productId] || 0) + quantity;
            }
          });
        }
      });
      
      const cancelled = safeProducts
        .filter(p => cancelCountMap[p.id] > 0 || p.status === "cancelled")
        .map(p => ({
          ...p,
          cancelledCount: cancelCountMap[p.id] || 0
        }))
        .sort((a, b) => (b?.cancelledCount || 0) - (a?.cancelledCount || 0))
        .slice(0, 5);
      
      return cancelled;
    } catch (error) {
      console.error("Error calculating cancelled products:", error);
      return [];
    }
  })();

  const enhancedCancelledProducts = useMemo(() => {
    const baseCancelled = cancelledProducts.length > 0 ? cancelledProducts : [];
    
    if (baseCancelled.length > 0) {
      return baseCancelled.map(product => ({
        ...product,
        productName: product.name || product.productName,
        trackingId: product.trackingId || `TRK${Math.floor(Math.random() * 900000 + 100000)}`,
        adminApproval: product.adminApproval || (Math.random() > 0.6 ? "Approved" : Math.random() > 0.3 ? "Pending" : "Rejected"),
        shiprocketStatus: product.shiprocketStatus || ["Not Shipped", "In Transit", "Delivered", "Returned"][Math.floor(Math.random() * 4)]
      }));
    }
    
    return CANCELLED_PRODUCTS;
  }, [cancelledProducts]);

  const [cancelledProductsData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cancelledProductsData")) || enhancedCancelledProducts;
    } catch {
      return enhancedCancelledProducts;
    }
  });

  const openAdd = () => { 
    setEditProduct(null); 
    setEditorView(true); 
  };
  
  const openEdit = (p) => { 
    if (!p) return;
    setEditProduct(p); 
    setEditorView(true); 
  };
  
  const deleteProduct = (id) => {
    if (!id) return;
    removeProduct(id);
  };
  
  const saveProduct = async (productData) => {
    if (editProduct) {
      await updateProduct(editProduct.id, productData);
      toast({ title: "Product Updated", description: "Your changes have been saved successfully." });
    } else {
      await hookAddProduct(productData);
      toast({ title: "Product Published", description: "Your new product is now live in the store." });
    }
    setEditorView(false);
    setEditProduct(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: "100%", padding: "0 16px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <PageHeader title="Products" subtitle="Loading products..." D={D} />
          <button style={{ ...styles.goldBtn, opacity: 0.6 }} disabled><Plus size={15} /> Add Product</button>
        </div>
        <Skeleton w="100%" h={300} r={16} />
      </div>
    );
  }

  if (viewMode === "most") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <BackButton D={D} />
        <PageHeader title="Top Products" subtitle="Your best-selling products by units sold" D={D} />
        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="#10B981" />
            <div style={{ fontWeight: 700, fontSize: 16 }}>Top Products</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topProducts.map((p, i) => (
              <div key={p?.id || i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: D.bg, borderRadius: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "#10B981" : i === 1 ? "#d4af37" : D.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: i < 2 ? "#fff" : D.muted }}>{i + 1}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isImg(p.imageData || p.image) ? "transparent" : `${avatarBg(p?.name || "P")}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: avatarBg(p?.name || "P"), overflow: "hidden" }}>
                  {isImg(p.imageData || p.image) ? <img src={p.imageData || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (p?.name ? p.name[0] : "P")}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p?.name || "Product"}</div>
                  <div style={{ fontSize: 11, color: D.muted }}>{p?.sold || 0} sold</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>{fmtShort(p?.price || 0)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: D.muted }}>Total sold</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#10B981" }}>{topProducts.reduce((sum, p) => sum + (p?.sold || 0), 0)}</div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "least") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <BackButton D={D} />
        <PageHeader title="Least Sold Products" subtitle="Your lowest-performing products by units sold" D={D} />
        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <TrendingDown size={18} color="#ef4444" />
            <div style={{ fontWeight: 700, fontSize: 16 }}>Least Sold Products</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {leastSoldProducts.length > 0 ? leastSoldProducts.map((p, i) => (
              <div key={p?.id || i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: D.bg, borderRadius: 10 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: D.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: D.muted }}>{i + 1}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isImg(p.imageData || p.image) ? "transparent" : `${avatarBg(p?.name || "P")}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: avatarBg(p?.name || "P"), overflow: "hidden" }}>
                  {isImg(p.imageData || p.image) ? <img src={p.imageData || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (p?.name ? p.name[0] : "P")}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p?.name || "Product"}</div>
                  <div style={{ fontSize: 11, color: D.muted }}>{p?.sold || 0} sold</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>{fmtShort(p?.price || 0)}</div>
              </div>
            )) : <div style={{ textAlign: "center", padding: "40px 20px", color: D.muted }}>No data available</div>}
          </div>
          {leastSoldProducts.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: D.muted }}>Total sold (least performers)</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>{leastSoldProducts.reduce((sum, p) => sum + (p?.sold || 0), 0)}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === "cancelled") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <BackButton D={D} />
        <PageHeader title="Most Cancelled Products" subtitle="Products with the highest cancellation rate" D={D} />
        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <AlertCircle size={18} color="#f59e0b" />
            <div style={{ fontWeight: 700, fontSize: 16 }}>Cancelled Products</div>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Product Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Admin Approval</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Tracking ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Shiprocket Status</th>
                </tr>
              </thead>
              <tbody>
                {cancelledProductsData.length > 0 ? cancelledProductsData.map((p, i) => (
                  <tr key={`cancelled-view-${p.id || i}`} style={{ borderBottom: `1px solid ${D.border}` }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>
                      {p.productName || p.name || "Product"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ 
                        fontSize: 12, 
                        padding: "4px 12px", 
                        borderRadius: 20, 
                        background: p.adminApproval === "Approved" ? "rgba(134,239,172,0.15)" : 
                                   p.adminApproval === "Rejected" ? "rgba(239,68,68,0.1)" : 
                                   "rgba(253,224,71,0.15)",
                        color: p.adminApproval === "Approved" ? "#16a34a" : 
                               p.adminApproval === "Rejected" ? "#ef4444" : 
                               "#ca8a04"
                      }}>
                        {p.adminApproval || "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, fontFamily: "monospace", color: D.muted }}>
                      {p.trackingId || "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ 
                        fontSize: 12, 
                        padding: "4px 12px", 
                        borderRadius: 20,
                        background: p.shiprocketStatus === "Delivered" ? "rgba(134,239,172,0.15)" : 
                                   p.shiprocketStatus === "In Transit" ? "rgba(147,197,253,0.15)" : 
                                   p.shiprocketStatus === "Returned" ? "rgba(239,68,68,0.1)" : 
                                   "rgba(203,213,225,0.2)",
                        color: p.shiprocketStatus === "Delivered" ? "#16a34a" : 
                               p.shiprocketStatus === "In Transit" ? "#2563eb" : 
                               p.shiprocketStatus === "Returned" ? "#ef4444" : 
                               D.muted
                      }}>
                        {p.shiprocketStatus || "Not Shipped"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "60px 20px" }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: D.text, marginBottom: 6 }}>No cancelled products</div>
                      <div style={{ fontSize: 13, color: D.muted }}>All your orders are going through smoothly</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {cancelledProductsData.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: D.muted }}>Total cancelled entries</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>{cancelledProductsData.length}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <PageHeader title="Products" subtitle={`${safeProducts.length} products in your store`} D={D} />
        <button onClick={openAdd} style={styles.goldBtn}><Plus size={15} /> Add Product</button>
      </div>

      <div style={{ ...styles.card(D), padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ ...styles.searchBar, background: D.bg, border: `1px solid ${D.border}`, flex: 1, minWidth: 200 }}>
            <Search size={14} color={D.muted} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search products..." 
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: D.text, width: "100%" }} 
            />
          </div>
          {filterCategories.map(c => (
            <button 
              key={c} 
              onClick={() => setCatFilter(c)} 
              style={{ 
                ...styles.filterBtn, 
                background: catFilter === c ? "#10B981" : D.bg, 
                color: catFilter === c ? "#fff" : D.muted, 
                border: `1px solid ${catFilter === c ? "#10B981" : D.border}` 
              }}
            >
              {c}
            </button>
          ))}
          <button onClick={() => setView(v => v === "table" ? "grid" : "table")} style={styles.iconBtn}>
            <Filter size={16} color={D.muted} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" sub="Try adjusting your search or filters" />
      ) : view === "table" ? (
        <div style={{ ...styles.card(D), overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                {["Product", "SKU", "Category", "Price", "Stock", "Sold", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => p && (
                <tr key={`row-${p.id || 'new'}-${i}`} style={{ borderBottom: `1px solid ${D.border}` }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 45, height: 45, borderRadius: 8, background: isImg(p.imageData || p.image) ? "transparent" : `${avatarBg(p.name || "P")}22`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isImg(p.imageData || p.image) ? (
                          <img src={p.imageData || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 700, color: avatarBg(p.name || "P") }}>{p.name ? p.name[0] : "P"}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name || "Product"}</div>
                        {p.description && (
                          <div style={{ fontSize: 11, color: D.muted, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {p.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: D.muted }}>
                    {p.sku || "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, background: "rgba(16,185,129,0.1)", color: "#10B981", padding: "3px 10px", borderRadius: 20 }}>
                      {p.category || "General"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>{fmt(p.price || 0)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: (p.stock || 0) < 5 ? "#ef4444" : D.text }}>{p.stock || 0}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{p.sold || 0}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ ...styles.iconBtn, background: "rgba(16,185,129,0.1)", width: 30, height: 30 }}><Edit2 size={13} color="#10B981" /></button>
                      <button onClick={() => deleteProduct(p.id)} style={{ ...styles.iconBtn, background: "rgba(239,68,68,0.1)", width: 30, height: 30 }}><Trash2 size={13} color="#ef4444" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {filtered.map((p, i) => p && (
            <div key={`grid-${p.id || 'new'}-${i}`} style={{ ...styles.card(D), padding: 20, transition: "transform 0.2s", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "100%", height: 200, borderRadius: 12, background: isImg(p.imageData || p.image) ? "transparent" : `${avatarBg(p.name || "P")}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, overflow: "hidden" }}>
                {isImg(p.imageData || p.image) ? (
                  <img src={p.imageData || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 48, fontWeight: 700, color: avatarBg(p.name || "P") }}>
                    {p.name ? p.name[0] : "P"}
                  </span>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                  {p.name || "Product"}
                </div>
                
                {p.sku && (
                  <div style={{ fontSize: 11, color: D.muted, marginBottom: 6 }}>
                    SKU: {p.sku}
                  </div>
                )}
                
                {p.description && (
                  <div style={{ fontSize: 12, color: D.muted, marginBottom: 6, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {p.description}
                  </div>
                )}
                
                <div style={{ fontSize: 12, color: D.muted, marginBottom: 8 }}>
                  {p.category || "General"} · Stock: {p.stock || 0}
                </div>
                
                <div style={{ fontSize: 18, fontWeight: 700, color: "#10B981", marginBottom: 16 }}>
                  {fmt(p.price || 0)}
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button onClick={() => openEdit(p)} style={{ ...styles.goldBtn, padding: "8px 12px", fontSize: 12, flex: 1 }}>
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => deleteProduct(p.id)} style={{ ...styles.iconBtn, background: "rgba(239,68,68,0.1)", flex: 1, borderRadius: 8 }}>
                  <Trash2 size={13} color="#ef4444" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Products Section */}
      {topProducts.length > 0 && (
        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="#10B981" />
            <div style={{ fontWeight: 700, fontSize: 16 }}>Top Products</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topProducts.map((p, i) => (
              <div key={`top-${p?.id || 'new'}-${i}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: D.bg, borderRadius: 10, transition: "transform 0.2s" }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "#10B981" : i === 1 ? "#d4af37" : D.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: i < 2 ? "#fff" : D.muted }}>{i + 1}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isImg(p.imageData || p.image) ? "transparent" : `${avatarBg(p?.name || "P")}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: avatarBg(p?.name || "P"), overflow: "hidden" }}>
                  {isImg(p.imageData || p.image) ? <img src={p.imageData || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (p?.name ? p.name[0] : "P")}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p?.name || "Product"}</div>
                  <div style={{ fontSize: 11, color: D.muted }}>{p?.sold || 0} sold</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>{fmtShort(p?.price || 0)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: D.muted }}>Total sold</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#10B981" }}>{topProducts.reduce((sum, p) => sum + (p?.sold || 0), 0)}</div>
          </div>
        </div>
      )}

      {/* Least Sold Products Section */}
      <div style={{ ...styles.card(D), padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <TrendingDown size={18} color="#ef4444" />
          <div style={{ fontWeight: 700, fontSize: 16 }}>Least Sold Products</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {leastSoldProducts.length > 0 ? (
            leastSoldProducts.map((p, i) => (
              <div key={`least-${p?.id || 'new'}-${i}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: D.bg, borderRadius: 10, transition: "transform 0.2s" }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: D.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: D.muted }}>{i + 1}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isImg(p.imageData || p.image) ? "transparent" : `${avatarBg(p?.name || "P")}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: avatarBg(p?.name || "P"), overflow: "hidden" }}>
                  {isImg(p.imageData || p.image) ? <img src={p.imageData || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (p?.name ? p.name[0] : "P")}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p?.name || "Product"}</div>
                  <div style={{ fontSize: 11, color: D.muted }}>{p?.sold || 0} sold</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>{fmtShort(p?.price || 0)}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: D.muted }}>No data available</div>
          )}
        </div>
        {leastSoldProducts.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: D.muted }}>Total sold (least performers)</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>{leastSoldProducts.reduce((sum, p) => sum + (p?.sold || 0), 0)}</div>
          </div>
        )}
      </div>

      {/* Cancelled Products Section - Table Format */}
      <div style={{ ...styles.card(D), padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <AlertCircle size={18} color="#f59e0b" />
          <div style={{ fontWeight: 700, fontSize: 16 }}>Cancelled Products</div>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Product Name</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Admin Approval</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Tracking ID</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>Shiprocket Status</th>
               </tr>
            </thead>
            <tbody>
              {cancelledProductsData.length > 0 ? cancelledProductsData.map((p, i) => (
                <tr key={`cancel-${p.id || 'new'}-${i}`} style={{ borderBottom: `1px solid ${D.border}` }}>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500 }}>
                    {p.productName || p.name || "Product"}
                   </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ 
                      fontSize: 12, 
                      padding: "4px 12px", 
                      borderRadius: 20, 
                      background: p.adminApproval === "Approved" ? "rgba(134,239,172,0.15)" : 
                                 p.adminApproval === "Rejected" ? "rgba(239,68,68,0.1)" : 
                                 "rgba(253,224,71,0.15)",
                      color: p.adminApproval === "Approved" ? "#16a34a" : 
                             p.adminApproval === "Rejected" ? "#ef4444" : 
                             "#ca8a04"
                    }}>
                      {p.adminApproval || "Pending"}
                    </span>
                   </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, fontFamily: "monospace", color: D.muted }}>
                    {p.trackingId || "—"}
                   </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ 
                      fontSize: 12, 
                      padding: "4px 12px", 
                      borderRadius: 20,
                      background: p.shiprocketStatus === "Delivered" ? "rgba(134,239,172,0.15)" : 
                                 p.shiprocketStatus === "In Transit" ? "rgba(147,197,253,0.15)" : 
                                 p.shiprocketStatus === "Returned" ? "rgba(239,68,68,0.1)" : 
                                 "rgba(203,213,225,0.2)",
                      color: p.shiprocketStatus === "Delivered" ? "#16a34a" : 
                             p.shiprocketStatus === "In Transit" ? "#2563eb" : 
                             p.shiprocketStatus === "Returned" ? "#ef4444" : 
                             D.muted
                    }}>
                      {p.shiprocketStatus || "Not Shipped"}
                    </span>
                   </td>
                 </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: D.text, marginBottom: 6 }}>No cancelled products</div>
                    <div style={{ fontSize: 13, color: D.muted }}>All your orders are going through smoothly</div>
                   </td>
                 </tr>
              )}
            </tbody>
           </table>
        </div>
        
        {cancelledProductsData.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: D.muted }}>Total cancelled entries</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>{cancelledProductsData.length}</div>
          </div>
        )}
      </div>

      {editorView && (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", minHeight: "100%", background: D.bg, zIndex: 100, padding: "24px" }}>
          <ProductEditor 
            editProduct={editProduct} 
            onSave={saveProduct} 
            onCancel={() => setEditorView(false)} 
            D={D} 
            dark={dark}
          />
        </div>
      )}
    </div>
  );
}

// ─── ORDERS PAGE ─────────────────────────────────────────────────────────────

function OrdersPage({ orders, D, loading }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [localOrders, setLocalOrders] = useState(orders);

  const filtered = localOrders.filter(o => statusFilter === "All" || o.status === statusFilter);
  const updateStatus = (id, status) => setLocalOrders(os => os.map(o => o.id === id ? { ...o, status } : o));

  const statuses = ["All", "Pending", "Shipped", "Delivered", "Returned"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Orders" subtitle={`${localOrders.length} total orders`} D={D} />

      <div style={{ display: "flex", gap: 12 }}>
        {statuses.map(s => {
          const count = s === "All" ? localOrders.length : localOrders.filter(o => o.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ ...styles.card(D), padding: "12px 20px", display: "flex", gap: 8, alignItems: "center", cursor: "pointer", border: statusFilter === s ? "2px solid #10B981" : `2px solid ${D.border}`, flex: 1, justifyContent: "center" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: statusFilter === s ? "#10B981" : D.text }}>{count}</span>
              <span style={{ fontSize: 12, color: D.muted }}>{s}</span>
            </button>
          );
        })}
      </div>

      {loading ? <Skeleton w="100%" h={300} r={16} /> : (
        <div style={{ ...styles.card(D), overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                {["Order ID", "Customer", "Product", "Amount", "Status", "Tracking ID", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>{h}</th>
                ))}
               </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const sc = statusColor(o.status);
                return (
                  <tr key={`order-row-${o.id || i}`} style={{ borderBottom: `1px solid ${D.border}` }} onMouseEnter={e => e.currentTarget.style.background = D.bg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#10B981" }}>{o.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ ...styles.avatar, width: 30, height: 30, background: avatarBg(o.customer || "User"), fontSize: 11 }}>{(o.customer || "U").split(" ").map(w => w[0]).join("")}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{o.customer}</div>
                          <div style={{ fontSize: 11, color: D.muted }}>{o.city}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: D.muted, maxWidth: 160 }}><span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</span></td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>{fmtShort(o.amount)}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, width: "fit-content", background: sc.bg, color: sc.text, fontSize: 12, padding: "3px 10px", borderRadius: 20 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />{o.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: D.muted, fontFamily: "monospace" }}>{o.trackingId || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: D.muted }}>{o.date}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setSelected(o)} style={{ ...styles.iconBtn, background: D.bg }}><Eye size={13} color={D.muted} /></button>
                        {o.status === "Pending" && <button onClick={() => updateStatus(o.id, "Shipped")} style={{ ...styles.iconBtn, background: "rgba(96,165,250,0.1)" }}><Truck size={13} color="#2563eb" /></button>}
                        {o.status === "Shipped" && <button onClick={() => updateStatus(o.id, "Delivered")} style={{ ...styles.iconBtn, background: "rgba(134,239,172,0.1)" }}><Check size={13} color="#16a34a" /></button>}
                        {o.status === "Returned" && <button onClick={() => updateStatus(o.id, "Pending")} style={{ ...styles.iconBtn, background: "rgba(239,68,68,0.1)" }}><RefreshCw size={13} color="#ef4444" /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal title={`Order ${selected.id}`} onClose={() => setSelected(null)} D={D}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Customer", selected.customer], ["City", selected.city], ["Product", selected.product], ["Amount", fmt(selected.amount)], ["Tracking ID", selected.trackingId || "—"], ["Date", selected.date]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${D.border}` }}>
                <span style={{ fontSize: 13, color: D.muted }}>{k}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span style={{ fontSize: 13, color: D.muted }}>Status</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: statusColor(selected.status).text }}>{selected.status}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `1px solid ${D.border}`, marginTop: 8 }}>
              <span style={{ fontSize: 13, color: D.muted }}>Update Status</span>
              <select 
                value={selected.status}
                onChange={(e) => {
                  updateStatus(selected.id, e.target.value);
                  setSelected({...selected, status: e.target.value});
                }}
                style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${D.border}`, background: D.bg, color: D.text }}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ANALYTICS PAGE ──────────────────────────────────────────────────────────

function AnalyticsPage({ D, loading }) {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState("weekly");
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeChart, setActiveChart] = useState("revenue");

  const [revenueFilter, setRevenueFilter] = useState("weekly");
  const [weeklyData] = useState(genWeeklyData);
  const [yesterdayData] = useState(genYesterdayData);
  const [monthlyData] = useState(genMonthlyData);
  const revenueData = revenueFilter === "weekly" ? weeklyData : revenueFilter === "yesterday" ? yesterdayData : monthlyData;
  const revTotal = (revenueData || []).reduce((s, d) => s + (d?.revenue || 0), 0);
  const prevRevTotal = revenueFilter === "weekly"
    ? revTotal * 0.94
    : revTotal * 0.91;
  const revPct = prevRevTotal !== 0 ? (((revTotal - prevRevTotal) / prevRevTotal) * 100).toFixed(1) : 0;
  const revUp = Number(revPct) > 0;

  const generateData = (filter) => {
    let data = [];
    let total = 0;

    try {
      switch (filter) {
        case "weekly":
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          data = days.map(day => ({
            label: day,
            revenue: Math.floor(Math.random() * 35000 + 15000),
            orders: Math.floor(Math.random() * 25 + 8)
          }));
          break;
        case "monthly":
          data = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return {
              label: `${date.getMonth() + 1}/${date.getDate()}`,
              revenue: Math.floor(Math.random() * 28000 + 12000),
              orders: Math.floor(Math.random() * 20 + 5)
            };
          });
          break;
        case "yearly":
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          data = months.map(month => ({
            label: month,
            revenue: Math.floor(Math.random() * 850000 + 150000),
            orders: Math.floor(Math.random() * 75 + 25)
          }));
          break;
        default:
          data = [];
      }
      total = data.reduce((sum, item) => sum + (item?.revenue || 0), 0);
    } catch (error) {
      console.error("Error generating chart data:", error);
      data = [];
      total = 0;
    }
    
    setChartData(data);
    setTotalRevenue(total);
  };

  useEffect(() => {
    generateData(dateRange);
  }, [dateRange]);

  const chartStyles = {
    chart: { transition: "all 0.3s ease" },
    chartHide: { display: "none" },
    chartShow: { display: "block" },
    toggleBtn: {
      padding: "6px 14px",
      borderRadius: "20px",
      border: `1px solid ${D.border}`,
      background: "transparent",
      cursor: "pointer",
      fontSize: "12px",
      color: D.muted,
      transition: "all 0.2s ease",
    },
    toggleBtnActive: {
      background: "#10B981",
      color: "#fff",
      borderColor: "#10B981",
    },
    toggleGroup: {
      display: "flex",
      gap: "8px",
      marginBottom: "20px",
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button
        onClick={() => navigate("/seller/dashboard")}
        style={{
          ...styles.outlineBtn(D),
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
        }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <PageHeader title="Analytics & Reports" subtitle={`Track your business performance${totalRevenue ? ` - Total Revenue: ${fmtShort(totalRevenue)}` : ''}`} D={D} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["weekly", "monthly", "yearly"].map(f => (
            <button key={f} onClick={() => setDateRange(f)} style={{ ...styles.filterBtn, background: dateRange === f ? "#10B981" : D.card, color: dateRange === f ? "#fff" : D.muted, border: `1px solid ${dateRange === f ? "#10B981" : D.border}` }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...styles.card(D), padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Revenue Analytics</div>
            {loading ? <Skeleton w={160} h={36} /> : (
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#10B981" }}>{fmtShort(revTotal)}</span>
                <span style={{ fontSize: 13, color: revUp ? "#16a34a" : "#ef4444", display: "flex", alignItems: "center", gap: 3 }}>
                  {revUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {revUp ? "+" : ""}{revPct}% vs previous period
                </span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["weekly", "yesterday", "monthly"].map(f => (
              <button key={f} onClick={() => setRevenueFilter(f)} style={{ ...styles.filterBtn, background: revenueFilter === f ? "#10B981" : D.bg, color: revenueFilter === f ? "#fff" : D.muted, border: `1px solid ${revenueFilter === f ? "#10B981" : D.border}` }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading ? <Skeleton w="100%" h={220} r={12} /> : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} />
              <Tooltip content={<CustomTooltip D={D} />} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#analyticsGoldGrad)" dot={false} activeDot={{ r: 5, fill: "#10B981" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={chartStyles.toggleGroup}>
            <button onClick={() => setActiveChart("revenue")} style={{ ...chartStyles.toggleBtn, ...(activeChart === "revenue" ? chartStyles.toggleBtnActive : {}) }}>Revenue</button>
            <button onClick={() => setActiveChart("orders")} style={{ ...chartStyles.toggleBtn, ...(activeChart === "orders" ? chartStyles.toggleBtnActive : {}) }}>Orders</button>
          </div>

          <div className="chart" style={{ ...chartStyles.chart, ...(activeChart === "revenue" ? chartStyles.chartShow : chartStyles.chartHide) }}>
            {loading ? <Skeleton h={220} r={10} /> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} interval={dateRange === "monthly" ? 4 : 0} />
                  <YAxis tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} />
                  <Tooltip content={<CustomTooltip D={D} />} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: D.muted }}>No data available</div>
            )}
          </div>

          <div className="chart" style={{ ...chartStyles.chart, ...(activeChart === "orders" ? chartStyles.chartShow : chartStyles.chartHide) }}>
            {loading ? <Skeleton h={220} r={10} /> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} interval={dateRange === "monthly" ? 4 : 0} />
                  <YAxis tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip content={<CustomTooltip D={D} />} />
                  <Bar dataKey="orders" fill="#93c5fd" radius={[6, 6, 0, 0]} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: D.muted }}>No data available</div>
            )}
          </div>
        </div>

        <div style={{ ...styles.card(D), padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>Category Breakdown</div>
          {loading ? <Skeleton h={220} r={10} /> : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={PIE_DATA || []} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={2} stroke={D.card}>
                    {(PIE_DATA || []).map((d, i) => <Cell key={i} fill={d?.color || "#10B981"} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {(PIE_DATA || []).map(d => d && (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, display: "inline-block" }} />
                      <span style={{ fontSize: 12, color: D.muted }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ ...styles.card(D), padding: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 20, fontSize: 15 }}>
          Sales Trend ({dateRange === "weekly" ? "Last 7 Days" : dateRange === "monthly" ? "Last 30 Days" : "Last 12 Months"})
        </div>
        {loading ? <Skeleton h={200} r={10} /> : (
          chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={D.border} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} interval={dateRange === "monthly" ? 4 : 0} />
                <YAxis tick={{ fontSize: 11, fill: D.muted }} axisLine={false} tickLine={false} tickFormatter={fmtShort} width={55} />
                <Tooltip content={<CustomTooltip D={D} />} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#10B981" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: D.muted }}>No data available</div>
          )
        )}
      </div>
    </div>
  );
}

// ─── MESSAGES PAGE ───────────────────────────────────────────────────────────

function MessagesPage({ messages, setMessages, D }) {
  const safeMessages = messages || [];
  const [activeMsg, setActiveMsg] = useState(safeMessages[0] || null);
  const [reply, setReply] = useState("");

  const sendReply = () => {
    if (!reply.trim() || !activeMsg) return;
    setMessages(ms => (ms || []).map(m => m.id === activeMsg.id ? { ...m, replies: [...(m.replies || []), reply], unread: false } : m));
    setActiveMsg(m => ({ ...m, replies: [...(m?.replies || []), reply] }));
    setReply("");
  };

  const markRead = (id) => setMessages(ms => (ms || []).map(m => m.id === id ? { ...m, unread: false } : m));

  if (!safeMessages.length) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <PageHeader title="Messages" subtitle="0 unread messages" D={D} />
        <EmptyState icon={MessageSquare} title="No messages" sub="Your inbox is empty" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Notifications" subtitle={`${safeMessages.filter(m => m?.unread).length} unread messages`} D={D} />
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, height: 520 }}>
        <div style={{ ...styles.card(D), overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px", borderBottom: `1px solid ${D.border}`, fontWeight: 600, fontSize: 14 }}>Inbox</div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {safeMessages.map(m => m && (
              <div key={m.id} onClick={() => { setActiveMsg(m); markRead(m.id); }} style={{ padding: "14px 16px", borderBottom: `1px solid ${D.border}`, cursor: "pointer", background: activeMsg?.id === m.id ? "rgba(201,161,74,0.08)" : "transparent", borderLeft: activeMsg?.id === m.id ? "3px solid #10B981" : "3px solid transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ ...styles.avatar, width: 34, height: 34, background: avatarBg(m.avatar || "U"), fontSize: 12 }}>{m.avatar || "U"}</div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{m.customer || "Unknown"}</span>
                      {m.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />}
                    </div>
                    <div style={{ fontSize: 11, color: D.muted }}>{m.time || ""}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: D.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message || ""}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.card(D), display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {activeMsg ? (
            <>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${D.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ ...styles.avatar, width: 40, height: 40, background: avatarBg(activeMsg.avatar || "U"), fontSize: 14 }}>{activeMsg.avatar || "U"}</div>
                <div><div style={{ fontWeight: 600 }}>{activeMsg.customer || "Unknown"}</div><div style={{ fontSize: 12, color: D.muted }}>{activeMsg.time || ""}</div></div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ alignSelf: "flex-start", maxWidth: "75%" }}>
                  <div style={{ background: D.bg, padding: "12px 16px", borderRadius: "0 16px 16px 16px", fontSize: 13, lineHeight: 1.5 }}>{activeMsg.message || ""}</div>
                </div>
                {(activeMsg.replies || []).map((r, i) => (
                  <div key={i} style={{ alignSelf: "flex-end", maxWidth: "75%" }}>
                    <div style={{ background: "linear-gradient(135deg, #10B981, #e0b96a)", color: "#fff", padding: "12px 16px", borderRadius: "16px 0 16px 16px", fontSize: 13, lineHeight: 1.5 }}>{r}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 16px", borderTop: `1px solid ${D.border}`, display: "flex", gap: 10 }}>
                <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} placeholder="Type your reply..." style={{ ...styles.input(D), flex: 1 }} />
                <button onClick={sendReply} style={{ ...styles.goldBtn, padding: "0 20px" }}><Send size={15} /></button>
              </div>
            </>
          ) : <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: D.muted }}>Select a conversation</div>}
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENTS PAGE ───────────────────────────────────────────────────────────

function PaymentsPage({ D, loading }) {
  const payments = generatePayments();
  const total = payments.filter(p => p.status === "Completed").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Payments" subtitle="Track your earnings and payouts" D={D} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total Earned", value: fmtShort(total), icon: IndianRupee, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
          { label: "Pending Payout", value: fmtShort(pending), icon: Clock, color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
          { label: "Completed", value: payments.filter(p => p.status === "Completed").length.toString(), icon: Check, color: "#34d399", bg: "rgba(52,211,153,0.1)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ ...styles.card(D), padding: "20px 24px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: D.muted, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...styles.card(D), overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${D.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>Payment History</span>
          <button style={styles.outlineBtn(D)}><Download size={14} /> Export</button>
        </div>
        {loading ? <div style={{ padding: 20 }}><Skeleton h={200} r={10} /></div> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${D.border}` }}>
                {["Payment ID", "Date", "Amount", "Orders", "Method", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: D.muted }}>{h}</th>
                ))}
                </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${D.border}` }} onMouseEnter={e => e.currentTarget.style.background = D.bg} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#10B981" }}>{p.id}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{p.date}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>{fmt(p.amount)}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{p.orders} orders</td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>{p.method}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, background: p.status === "Completed" ? "rgba(134,239,172,0.15)" : "rgba(253,224,71,0.15)", color: p.status === "Completed" ? "#16a34a" : "#ca8a04", padding: "3px 10px", borderRadius: 20 }}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── REVIEWS PAGE ────────────────────────────────────────────────────────────

function ReviewsPage({ reviews, setReviews, D }) {
  const [replyText, setReplyText] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const [sortBy, setSortBy] = useState("latest");
  const [filterRating, setFilterRating] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [showAddReview, setShowAddReview] = useState(false);
  const [filterWithImages, setFilterWithImages] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [activeTab, setActiveTab] = useState("reviews");
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newReview, setNewReview] = useState({
    productId: "",
    rating: 0,
    title: "",
    description: "",
    images: []
  });

  const products = [
    { id: "P001", name: "Premium Wireless Headphones", image: "/api/placeholder/80/80", price: 199.99, sku: "AUD-HP-001", category: "Electronics" },
    { id: "P002", name: "Ultra-Slim Laptop", image: "/api/placeholder/80/80", price: 899.99, sku: "COM-LP-002", category: "Computers" },
    { id: "P003", name: "Smart Fitness Watch", image: "/api/placeholder/80/80", price: 249.99, sku: "FIT-WT-003", category: "Wearables" },
    { id: "P004", name: "Noise-Cancelling Earbuds", image: "/api/placeholder/80/80", price: 129.99, sku: "AUD-EB-004", category: "Electronics" },
    { id: "P005", name: "Portable Power Bank", image: "/api/placeholder/80/80", price: 49.99, sku: "ACC-PB-005", category: "Accessories" }
  ];

  const userPurchasedProducts = ["P001", "P002", "P003"];

  const aiInsights = {
    sentiment: "disappointed",
    issues: [
      { label: "Quality Issues", percentage: 60, color: "#ef4444" },
      { label: "Durability", percentage: 25, color: "#f59e0b" },
      { label: "Support", percentage: 15, color: "#3b82f6" }
    ]
  };

  const isVerifiedPurchase = (productId) => {
    return userPurchasedProducts.includes(productId);
  };

  const getProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      return { id: productId, name: "Product Unavailable", image: null, sku: "N/A", category: "Unknown", isAvailable: false };
    }
    return { ...product, isAvailable: true };
  };

  const handleHelpful = (reviewId) => {
    setHelpfulVotes(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const currentImageCount = newReview.images.length;
    const remainingSlots = maxImages - currentImageCount;
    
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed per review`);
      return;
    }
    
    const filesToUpload = files.slice(0, remainingSlots);
    
    filesToUpload.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setNewReview(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
  };

  const submitNewReview = () => {
    if (!newReview.productId || !newReview.rating || !newReview.title || !newReview.description) return;
    
    const newReviewObj = {
      id: Date.now(),
      orderId: `ORD-${Math.floor(Math.random() * 100000)}`,
      productId: newReview.productId,
      customer: "Current User",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.description,
      date: new Date().toLocaleDateString(),
      reviewImages: newReview.images,
      helpfulCount: 0,
      verified: isVerifiedPurchase(newReview.productId),
      replied: false,
      reply: null,
      status: "pending"
    };
    
    setReviews(prev => [newReviewObj, ...prev]);
    setShowAddReview(false);
    setNewReview({ productId: "", rating: 0, title: "", description: "", images: [] });
  };

  const filteredReviews = reviews
    .filter(r => {
      if (activeTab === "reviews") return true;
      if (activeTab === "questions") return false;
      return true;
    })
    .filter(r => {
      if (selectedProductFilter !== "all" && r.productId !== selectedProductFilter) return false;
      if (filterWithImages && (!r.reviewImages || r.reviewImages.length === 0)) return false;
      if (filterRating && r.rating !== filterRating) return false;
      if (searchTerm && !(r.comment || "").toLowerCase().includes(searchTerm.toLowerCase()) && !r.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (dateRange === "week") {
        const reviewDate = new Date(r.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (reviewDate < weekAgo) return false;
      }
      if (dateRange === "month") {
        const reviewDate = new Date(r.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (reviewDate < monthAgo) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "latest": return new Date(b.date) - new Date(a.date);
        case "highest": return b.rating - a.rating;
        case "lowest": return a.rating - b.rating;
        default: return 0;
      }
    });

  const handleSelectReview = (reviewId) => {
    setSelectedReviews(prev => {
      const newSelection = prev.includes(reviewId) ? prev.filter(id => id !== reviewId) : [...prev, reviewId];
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on ${selectedReviews.length} reviews`);
    setSelectedReviews([]);
    setShowBulkActions(false);
  };

  const submitReply = (id) => {
    if (!replyText[id]?.trim()) return;
    setReviews(rs => rs.map(r => r.id === id ? { ...r, replied: true, reply: replyText[id] } : r));
    setReplyOpen(s => ({ ...s, [id]: false }));
  };

  const handleProductClick = (productId) => {
    console.log(`Navigate to product: ${productId}`);
    alert(`Product details page would open for product ID: ${productId}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: D.text, margin: 0 }}>Review Request</h1>
        </div>
        <button style={styles.goldBtn}>+ Create</button>
      </div>

      <div style={{ display: "flex", gap: 24, borderBottom: `2px solid ${D.border}`, marginBottom: 8 }}>
        <button onClick={() => setActiveTab("reviews")} style={{ padding: "8px 0", fontSize: 14, fontWeight: 600, color: activeTab === "reviews" ? "#10B981" : D.muted, borderBottom: activeTab === "reviews" ? `2px solid #10B981` : "none", background: "none", border: "none", cursor: "pointer" }}>
          My Reviews ({reviews.length})
        </button>
        <button onClick={() => setActiveTab("widget")} style={{ padding: "8px 0", fontSize: 14, fontWeight: 600, color: activeTab === "widget" ? "#10B981" : D.muted, borderBottom: activeTab === "widget" ? `2px solid #10B981` : "none", background: "none", border: "none", cursor: "pointer" }}>
          Review Widget
        </button>
        <button onClick={() => setActiveTab("questions")} style={{ padding: "8px 0", fontSize: 14, fontWeight: 600, color: activeTab === "questions" ? "#10B981" : D.muted, borderBottom: activeTab === "questions" ? `2px solid #10B981` : "none", background: "none", border: "none", cursor: "pointer" }}>
          Question & Answer
        </button>
        <button style={{ marginLeft: "auto", fontSize: 13, color: "#10B981", background: "none", border: "none", cursor: "pointer" }}>+ Add View</button>
      </div>

      <div style={{ ...styles.card(D), padding: "16px 20px", background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(201,161,74,0.05) 100%)", borderLeft: `4px solid #ef4444` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          {/* <span style={{ fontSize: 20 }}></span> */}
          <span style={{ fontSize: 14, fontWeight: 600, color: D.text }}>Customers are disappointed</span>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {aiInsights.issues.map(issue => (
            <div key={issue.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 60, height: 4, background: D.border, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${issue.percentage}%`, height: "100%", background: issue.color }} />
              </div>
              <span style={{ fontSize: 12, color: D.muted }}>{issue.percentage}% {issue.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input type="text" placeholder="Search reviews..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...styles.input(D), width: "100%" }} />
        </div>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ ...styles.input(D), width: "auto" }}>
          <option value="all">Date Range: All Time</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
        <select value={selectedProductFilter} onChange={(e) => setSelectedProductFilter(e.target.value)} style={{ ...styles.input(D), width: "auto", minWidth: 160 }}>
          <option value="all">All Products</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <select value={filterRating || ""} onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)} style={{ ...styles.input(D), width: "auto" }}>
          <option value="">Star Rating</option>
          <option value="5">5 Stars ★★★★★</option>
          <option value="4">4 Stars ★★★★☆</option>
          <option value="3">3 Stars ★★★☆☆</option>
          <option value="2">2 Stars ★★☆☆☆</option>
          <option value="1">1 Star ★☆☆☆☆</option>
        </select>
        <button style={{ ...styles.outlineBtn(D), fontSize: 12 }}>Advanced Filter</button>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ ...styles.input(D), width: "auto" }}>
          <option value="latest">Sort By: Latest</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))", gap: 16, marginTop: 8 }}>
        {filteredReviews.length === 0 ? (
          <div style={{ ...styles.card(D), padding: "60px 24px", textAlign: "center", gridColumn: "1/-1" }}>
            {/* <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div> */}
            <div style={{ fontSize: 16, fontWeight: 600, color: D.text, marginBottom: 8 }}>No reviews found</div>
            <button onClick={() => setShowAddReview(true)} style={styles.goldBtn}>Write a Review</button>
          </div>
        ) : (
          filteredReviews.map(r => {
            const product = getProduct(r.productId);
            const hasImages = r.reviewImages && r.reviewImages.length > 0;
            const isSelected = selectedReviews.includes(r.id);
            
            return (
              <div key={r.id} style={{ ...styles.card(D), padding: 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}>
                  <input type="checkbox" checked={isSelected} onChange={() => handleSelectReview(r.id)} style={{ width: 18, height: 18, cursor: "pointer" }} />
                </div>
                <div style={{ padding: "20px 20px 16px 44px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: D.muted }}>Order-{r.orderId || r.id}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <StarRating rating={r.rating} size={14} />
                      <span style={{ fontSize: 11, color: D.muted }}>{r.date}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 11, color: D.muted }}>Item:</span>
                    <div onClick={() => handleProductClick(product.id)} style={{ fontSize: 14, fontWeight: 600, color: "#10B981", cursor: "pointer", marginTop: 2 }}>{product.name}</div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 13, color: D.text, lineHeight: 1.5, margin: 0 }}>
                      {(r.comment || "").length > 100 ? `${(r.comment || "").substring(0, 100)}...` : (r.comment || "")}
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ ...styles.avatar, width: 32, height: 32, background: avatarBg(r.customer || "User"), fontSize: 12 }}>
                        {(r.customer || "U").split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{r.customer}</div>
                        {r.verified && <span style={{ fontSize: 10, color: "#16a34a" }}>✅ Verified</span>}
                      </div>
                    </div>
                    
                    {hasImages && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {r.reviewImages.slice(0, 3).map((img, idx) => (
                          <img key={idx} src={img} alt={`Product ${idx + 1}`} style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover", cursor: "pointer", border: `1px solid ${D.border}` }} onClick={() => window.open(img, '_blank')} />
                        ))}
                        {r.reviewImages.length > 3 && (
                          <div style={{ width: 48, height: 48, borderRadius: 6, background: D.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: D.muted }}>
                            +{r.reviewImages.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${D.border}` }}>
                    <button style={{ ...styles.outlineBtn(D), fontSize: 12, padding: "4px 12px" }}>Publish</button>
                    <button style={{ ...styles.outlineBtn(D), fontSize: 12, padding: "4px 12px" }}>Archive</button>
                    <button style={{ ...styles.iconBtn, background: D.bg, marginLeft: "auto" }}>⋮</button>
                    <button style={{ ...styles.iconBtn, background: D.bg }}>↗</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showBulkActions && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: D.cardBg, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", borderRadius: 12, padding: "12px 24px", display: "flex", gap: 16, alignItems: "center", zIndex: 1000, border: `1px solid ${D.border}` }}>
          <span style={{ fontSize: 13, color: D.text }}>{selectedReviews.length} items selected</span>
          <button onClick={() => handleBulkAction("publish")} style={{ ...styles.outlineBtn(D), fontSize: 12, padding: "6px 12px" }}>Publish</button>
          <button onClick={() => handleBulkAction("archive")} style={{ ...styles.outlineBtn(D), fontSize: 12, padding: "6px 12px" }}>Archive</button>
          <button onClick={() => handleBulkAction("like")} style={{ ...styles.outlineBtn(D), fontSize: 12, padding: "6px 12px" }}>Like</button>
          <button onClick={() => handleBulkAction("share")} style={{ ...styles.outlineBtn(D), fontSize: 12, padding: "6px 12px" }}>Share</button>
        </div>
      )}

      {showAddReview && (
        <Modal title="Share Your Experience" onClose={() => setShowAddReview(false)} D={D}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Select Product *</label>
              <select value={newReview.productId} onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })} style={{ ...styles.input(D), width: "100%" }}>
                <option value="">Choose a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Rating *</label>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", color: star <= newReview.rating ? "#FBBF24" : "#D1D5DB" }}>★</button>
                ))}
              </div>
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Review Title *</label>
              <input type="text" value={newReview.title} onChange={(e) => setNewReview({ ...newReview, title: e.target.value })} placeholder="Summarize your experience" style={styles.input(D)} />
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Review Description *</label>
              <textarea rows={4} value={newReview.description} onChange={(e) => setNewReview({ ...newReview, description: e.target.value })} placeholder="Share details about your experience with this product..." style={styles.input(D)} />
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Add Photos (Optional - Max 5 images)</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={newReview.images.length >= 5} style={{ ...styles.input(D), padding: "8px" }} />
              {newReview.images.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {newReview.images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img src={img} alt={`Preview ${idx + 1}`} style={{ width: 60, height: 60, borderRadius: 6, objectFit: "cover" }} />
                      <button onClick={() => removeImage(idx)} style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 12, cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setShowAddReview(false)} style={styles.outlineBtn(D)}>Cancel</button>
              <button onClick={submitNewReview} style={styles.goldBtn}>Submit Review</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SETTINGS PAGE ───────────────────────────────────────────────────────────

function SettingsPage({ D, dark, setDark }) {
  const [notifPrefs, setNotifPrefs] = useState({ orders: true, payments: true, reviews: false, messages: true });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Settings" subtitle="Manage your account & preferences" D={D} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><User size={16} color="#10B981" /> Profile Settings</div>
          {[["Store Name", "LuxeJewels™"], ["Full Name", SELLER.name], ["Email", SELLER.email], ["Phone", SELLER.phone]].map(([l, v]) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: D.muted, display: "block", marginBottom: 6 }}>{l}</label>
              <input defaultValue={v} style={{ ...styles.input(D), width: "100%" }} />
            </div>
          ))}
          <button onClick={save} style={{ ...styles.goldBtn, marginTop: 8 }}>{saved ? <><Check size={14} /> Saved!</> : "Save Changes"}</button>
        </div>

        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><Lock size={16} color="#10B981" /> Security</div>
          {[["Current Password", "password"], ["New Password", "password"], ["Confirm Password", "password"]].map(([l, t]) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: D.muted, display: "block", marginBottom: 6 }}>{l}</label>
              <input type={t} placeholder="••••••••" style={{ ...styles.input(D), width: "100%" }} />
            </div>
          ))}
          <button style={{ ...styles.goldBtn, marginTop: 8 }}>Update Password</button>
        </div>

        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><Bell size={16} color="#10B981" /> Notification Preferences</div>
          {Object.entries(notifPrefs).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${D.border}` }}>
              <span style={{ fontSize: 14, textTransform: "capitalize" }}>{k} notifications</span>
              <button onClick={() => setNotifPrefs(p => ({ ...p, [k]: !p[k] }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {v ? <ToggleRight size={28} color="#10B981" /> : <ToggleLeft size={28} color={D.muted} />}
              </button>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card(D), padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><Zap size={16} color="#10B981" /> Appearance</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${D.border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Dark Mode</div>
              <div style={{ fontSize: 12, color: D.muted }}>Toggle dark/light theme</div>
            </div>
            <button onClick={() => setDark(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              {dark ? <ToggleRight size={28} color="#10B981" /> : <ToggleLeft size={28} color={D.muted} />}
            </button>
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Store Location</div>
            <input defaultValue={SELLER.location} style={{ ...styles.input(D), width: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const PageHeader = ({ title, subtitle, D }) => (
  <div style={{ marginBottom: 4 }}>
    <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
    <p style={{ fontSize: 13, color: D.muted, margin: "4px 0 0" }}>{subtitle}</p>
  </div>
);

const SectionHeader = ({ title, action, D }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
    {action && <button style={{ fontSize: 12, color: "#10B981", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>{action} <ChevronRight size={14} /></button>}
  </div>
);

const StarRating = ({ rating, size = 13 }) => (
  <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={size} fill={s <= Math.round(rating) ? "#10B981" : "none"} color={s <= Math.round(rating) ? "#10B981" : "#d1d5db"} />)}
  </div>
);

const EmptyState = ({ icon: Icon, title, sub }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 10 }}>
    <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={28} color="#10B981" />
    </div>
    <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
    <div style={{ fontSize: 13, color: "#94a3b8" }}>{sub}</div>
  </div>
);

const Modal = ({ title, onClose, children, D }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ ...styles.card(D), width: "100%", maxWidth: 460, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
        <button onClick={onClose} style={styles.iconBtn}><X size={18} color="#94a3b8" /></button>
      </div>
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, D }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: D?.card || "#fff", border: `1px solid ${D?.border || "#e2e8f0"}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 11, color: D?.muted || "#94a3b8", marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color || "#10B981" }}>{fmtShort(p.value)}</div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── THEME ────────────────────────────────────────────────────────────────────

const LIGHT = { bg: "#f0fdf4", card: "#ffffff", text: "#064e3b", muted: "#059669", border: "#dcfce7", sk: "#ecfdf5" };
const DARK = { bg: "#022c22", card: "#064e3b", text: "#ecfdf5", muted: "#34d399", border: "#065f46", sk: "#065f46" };

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = {
  root: { display: "flex", transition: "background 0.3s, color 0.3s", width: "100%", height: "100vh", overflow: "hidden", margin: 0 },
  sidebar: { position: "fixed", left: 0, top: 0, bottom: 0, width: 240, display: "flex", flexDirection: "column", zIndex: 200, transition: "transform 0.3s ease" },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 12, padding: "20px 16px", borderBottom: "1px solid rgba(16,185,129,0.1)" },
  logoMark: { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  navItem: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, cursor: "pointer", border: "none", textAlign: "left", transition: "all 0.15s", marginBottom: 2 },
  badge: { background: "#10B981", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 20, minWidth: 18, textAlign: "center" },
  main: { flex: 1, minWidth: 0, width: "calc(100vw - 240px)", marginLeft: 240, overflowY: "auto", height: "100vh", padding: "0px", boxSizing: "border-box" },
  topbar: { position: "sticky", top: 0, zIndex: 100, height: 60, display: "flex", alignItems: "center", padding: "0px", gap: 16 },
  searchBar: { display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, flex: 1, maxWidth: 380 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" },
  profileBtn: { display: "flex", alignItems: "center", gap: 8, background: "transparent", cursor: "pointer", padding: "4px 10px", borderRadius: 10 },
  dropdown: { position: "absolute", top: "calc(100% + 8px)", borderRadius: 14, zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden" },
  notifItem: { display: "flex", gap: 10, padding: "12px 14px", alignItems: "flex-start" },
  dropItem: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, textAlign: "left" },
  avatar: { borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", flexShrink: 0 },
  card: (D) => ({ background: D.card, borderRadius: 16, border: `1px solid ${D.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }),
  goldBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #10B981, #e0b96a)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 },
  outlineBtn: (D) => ({ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: D.text, border: `1px solid ${D.border}`, borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer" }),
  filterBtn: { padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" },
  input: (D) => ({ background: D.bg, border: `1px solid ${D.border}`, borderRadius: 10, padding: "9px 14px", fontSize: 13, color: D.text, outline: "none" }),
};

const CSS = (D) => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; }
  :root { --sk: ${D.sk}; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${D.border}; border-radius: 10px; }
  @keyframes skeleton { 0%,100%{opacity:1} 50%{opacity:0.4} }
  button:hover { opacity: 0.88; }
  input:focus { border-color: #10B981 !important; box-shadow: 0 0 0 3px rgba(201,161,74,0.15); }
  select { appearance: none; cursor: pointer; }
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
`;

const ANIMATIONS = `
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  main > div { animation: fadeIn 0.3s ease; }
`;

export default App;