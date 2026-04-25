export const SELLER = {
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

export const CATEGORIES = ["All", "Vegetables", "Fruits", "Dairy", "Bakery", "Meat", "Beverages", "Snacks"];

export const generateProducts = () => [
  { id: "PRO001", name: "Organic Tomatoes (1kg)", price: 45, category: "Vegetables", stock: 120, sold: 870, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2670&auto=format&fit=crop", status: "active" },
  { id: "PRO002", name: "Fresh Milk (1L)", price: 65, category: "Dairy", stock: 50, sold: 1200, image: "https://images.unsplash.com/photo-1563636619-e910f01859ec?q=80&w=2564&auto=format&fit=crop", status: "active" },
  { id: "PRO003", name: "Sourdough Bread", price: 95, category: "Bakery", stock: 15, sold: 450, image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=2574&auto=format&fit=crop", status: "active" },
  { id: "PRO004", name: "Alphonso Mangoes (1dz)", price: 850, category: "Fruits", stock: 30, sold: 120, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=2574&auto=format&fit=crop", status: "active" },
  { id: "PRO005", name: "Free-range Eggs (12pc)", price: 180, category: "Dairy", stock: 40, sold: 600, image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=2586&auto=format&fit=crop", status: "active" },
  { id: "PRO006", name: "Greek Yogurt (500g)", price: 210, category: "Dairy", stock: 25, sold: 340, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2574&auto=format&fit=crop", status: "active" },
  { id: "PRO007", name: "Carrots (500g)", price: 30, category: "Vegetables", stock: 80, sold: 920, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2574&auto=format&fit=crop", status: "active" },
  { id: "PRO008", name: "Cold Brew Coffee (250ml)", price: 120, category: "Beverages", stock: 60, sold: 280, image: "https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=2574&auto=format&fit=crop", status: "active" },
];

export const generateOrders = () => [
  { id: "ORD-001", customer_name: "Priya Sharma", customer_email: "priya@example.com", customer_phone: "+91 98765 43210", items: [{ name: "Organic Tomatoes (1kg)", quantity: 2 }], total_amount: 90, status: "Delivered", created_at: "2025-03-24", city: "Delhi", tracking_id: "TRK100234" },
  { id: "ORD-002", customer_name: "Rahul Nair", customer_email: "rahul@example.com", customer_phone: "+91 87654 32109", items: [{ name: "Alphonso Mangoes (1dz)", quantity: 1 }], total_amount: 850, status: "Shipped", created_at: "2025-03-25", city: "Bangalore", tracking_id: "TRK567890" },
  { id: "ORD-003", customer_name: "Sneha Patel", customer_email: "sneha@example.com", customer_phone: "+91 76543 21098", items: [{ name: "Fresh Milk (1L)", quantity: 3 }], total_amount: 195, status: "Processing", created_at: "2025-03-26", city: "Ahmedabad", tracking_id: "TRK223344" },
  { id: "ORD-004", customer_name: "Karthik Raj", customer_email: "karthik@example.com", customer_phone: "+91 65432 10987", items: [{ name: "Free-range Eggs (12pc)", quantity: 2 }], total_amount: 360, status: "Delivered", created_at: "2025-03-22", city: "Chennai", tracking_id: "TRK334455" },
  { id: "ORD-005", customer_name: "Divya Menon", customer_email: "divya@example.com", customer_phone: "+91 54321 09876", items: [{ name: "Sourdough Bread", quantity: 2 }, { name: "Greek Yogurt (500g)", quantity: 1 }], total_amount: 400, status: "Shipped", created_at: "2025-03-27", city: "Kochi", tracking_id: "TRK445566" },
  { id: "ORD-006", customer_name: "Amit Verma", customer_email: "amit@example.com", customer_phone: "+91 43210 98765", items: [{ name: "Organic Tomatoes (1kg)", quantity: 5 }], total_amount: 225, status: "Processing", created_at: "2025-03-28", city: "Pune", tracking_id: "TRK556677" },
  { id: "ORD-007", customer_name: "Meera Iyer", customer_email: "meera@example.com", customer_phone: "+91 32109 87654", items: [{ name: "Cold Brew Coffee (250ml)", quantity: 4 }], total_amount: 480, status: "Delivered", created_at: "2025-03-20", city: "Hyderabad", tracking_id: "TRK667788" },
  { id: "ORD-008", customer_name: "Rohan Gupta", customer_email: "rohan@example.com", customer_phone: "+91 21098 76543", items: [{ name: "Carrots (500g)", quantity: 3 }], total_amount: 90, status: "Processing", created_at: "2025-03-29", city: "Jaipur", tracking_id: "TRK778899" },
];

export const generateMessages = () => [
  { id: 1, customer: "Priya Sharma", avatar: "PS", message: "Are the tomatoes organic certified?", time: "10:32 AM", unread: true, replies: [] },
  { id: 2, customer: "Rahul Nair", avatar: "RN", message: "When will the Alphonso mangoes be back in stock?", time: "Yesterday", unread: true, replies: ["Hi Rahul! We expect a new batch this Thursday."] },
  { id: 3, customer: "Sneha Patel", avatar: "SP", message: "What's the shelf life of the sourdough bread?", time: "2 days ago", unread: false, replies: [] },
  { id: 4, customer: "Karthik Raj", avatar: "KR", message: "My milk packet was slightly leaked. Can I get a replacement?", time: "3 days ago", unread: false, replies: ["We're sorry for the inconvenience! A replacement has been dispatched."] },
];

export const generateReviews = () => [
  { id: 1, customer: "Priya Sharma", product: "Organic Tomatoes (1kg)", rating: 5, comment: "Very fresh and juicy. Great for salads!", date: "Mar 20, 2025", replied: false },
  { id: 2, customer: "Karthik Raj", product: "Free-range Eggs (12pc)", rating: 5, comment: "High quality eggs, yolks are deep yellow. Highly recommend.", date: "Mar 18, 2025", replied: true, reply: "Thank you for the kind words! We source them daily from local farms." },
  { id: 3, customer: "Meera Iyer", product: "Cold Brew Coffee (250ml)", rating: 4, comment: "Strong and smooth. Just a bit overpriced.", date: "Mar 15, 2025", replied: false },
  { id: 4, customer: "Divya Menon", product: "Greek Yogurt (500g)", rating: 5, comment: "Best yogurt I've had. Very creamy!", date: "Mar 10, 2025", replied: true, reply: "Glad you enjoyed it! It's our top-selling dairy product." },
];

export const generatePayments = () => [
  { id: "PAY-001", date: "Mar 25, 2025", amount: 2500, orders: 12, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-002", date: "Mar 18, 2025", amount: 1380, orders: 8, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-003", date: "Mar 11, 2025", amount: 978, orders: 6, status: "Completed", method: "UPI" },
  { id: "PAY-004", date: "Mar 04, 2025", amount: 3156, orders: 15, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-005", date: "Apr 01, 2025", amount: 687, orders: 4, status: "Pending", method: "Bank Transfer" },
];

export const CANCELLED_PRODUCTS = [
  { id: "PRO009", productName: "Fresh Spinach", trackingId: "TRK112233", adminApproval: "Pending", shiprocketStatus: "In Transit", status: "cancelled", name: "Fresh Spinach", cancelledCount: 1 },
  { id: "PRO010", productName: "Red Bell Peppers", trackingId: "TRK445566", adminApproval: "Approved", shiprocketStatus: "Returned", status: "cancelled", name: "Red Bell Peppers", cancelledCount: 1 },
  { id: "PRO011", productName: "Blueberries (125g)", trackingId: "TRK778899", adminApproval: "Rejected", shiprocketStatus: "Not Shipped", status: "cancelled", name: "Blueberries (125g)", cancelledCount: 1 }
];

export const genWeeklyData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(d => ({ time: d, revenue: Math.floor(Math.random() * 5000 + 1000) }));
};
export const genTodayData = () => {
  const hours = ["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];
  return hours.map(h => ({ time: h, revenue: Math.floor(Math.random() * 500 + 100) }));
};
export const genYesterdayData = () => {
  const hours = ["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];
  return hours.map(h => ({ time: h, revenue: Math.floor(Math.random() * 450 + 80) }));
};
export const genMonthlyData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    time: `Mar ${i + 1}`,
    revenue: Math.floor(Math.random() * 4000 + 1000),
  }));
};
export const genMonthlyBar = () => {
  const months = ["Oct","Nov","Dec","Jan","Feb","Mar"];
  return months.map(m => ({ month: m, revenue: Math.floor(Math.random() * 20000 + 5000), orders: Math.floor(Math.random() * 200 + 50) }));
};

export const PIE_DATA = [
  { name: "Vegetables", value: 35, color: "#10B981" },
  { name: "Fruits", value: 25, color: "#34D399" },
  { name: "Dairy", value: 20, color: "#6EE7B7" },
  { name: "Bakery", value: 15, color: "#FBBF24" },
  { name: "Other", value: 5, color: "#FDE68A" },
];

export const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);
export const fmtShort = (n) => {
  const num = Number(n) || 0;
  return num >= 100000 ? `₹${(num/100000).toFixed(1)}L` : num >= 1000 ? `₹${(num/1000).toFixed(1)}K` : `₹${num}`;
};

export const statusColor = (s) => {
  if (s === "Delivered") return { bg: "bg-green-100", text: "text-green-600", dot: "bg-green-600" };
  if (s === "Shipped") return { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-600" };
  if (s === "Processing") return { bg: "bg-amber-100", text: "text-amber-600", dot: "bg-amber-600" };
  return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-600" };
};

export const avatarBg = (str) => {
  const colors = ["bg-emerald-500","bg-blue-400","bg-green-400","bg-pink-400","bg-purple-400","bg-emerald-400"];
  let h = 0; for (let c of str) h = c.charCodeAt(0) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

export const isImg = (s) => s && (s.startsWith("data:image") || s.startsWith("http") || s.startsWith("/"));

