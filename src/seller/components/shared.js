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
  { id: 1, name: "Organic Tomatoes (1kg)", price: 45, category: "Vegetables", stock: 120, sold: 870, image: "OT", status: "active" },
  { id: 2, name: "Fresh Milk (1L)", price: 65, category: "Dairy", stock: 50, sold: 1200, image: "FM", status: "active" },
  { id: 3, name: "Sourdough Bread", price: 95, category: "Bakery", stock: 15, sold: 450, image: "SB", status: "active" },
  { id: 4, name: "Alphonso Mangoes (1dz)", price: 850, category: "Fruits", stock: 30, sold: 120, image: "AM", status: "active" },
  { id: 5, name: "Free-range Eggs (12pc)", price: 180, category: "Dairy", stock: 40, sold: 600, image: "FE", status: "active" },
  { id: 6, name: "Greek Yogurt (500g)", price: 210, category: "Dairy", stock: 25, sold: 340, image: "GY", status: "active" },
  { id: 7, name: "Carrots (500g)", price: 30, category: "Vegetables", stock: 80, sold: 920, image: "CR", status: "active" },
  { id: 8, name: "Cold Brew Coffee (250ml)", price: 120, category: "Beverages", stock: 60, sold: 280, image: "CB", status: "active" },
];

export const generateOrders = () => [
  { id: "ORD-001", customer: "Priya Sharma", product: "22K Gold Bangles Set", amount: 42500, status: "Delivered", date: "2025-03-24", city: "Delhi", trackingId: "TRK100234" },
  { id: "ORD-002", customer: "Rahul Nair", product: "Diamond Tennis Bracelet", amount: 210000, status: "Shipped", date: "2025-03-25", city: "Bangalore", trackingId: "TRK567890" },
  { id: "ORD-003", customer: "Sneha Patel", product: "925 Silver Anklet Pair", amount: 3200, status: "Pending", date: "2025-03-26", city: "Ahmedabad", trackingId: "TRK223344" },
  { id: "ORD-004", customer: "Karthik Raj", product: "Solitaire Diamond Ring", amount: 135000, status: "Delivered", date: "2025-03-22", city: "Chennai", trackingId: "TRK334455" },
  { id: "ORD-005", customer: "Divya Menon", product: "Emerald Pendant Necklace", amount: 67500, status: "Shipped", date: "2025-03-27", city: "Kochi", trackingId: "TRK445566" },
  { id: "ORD-006", customer: "Amit Verma", product: "Platinum Wedding Band", amount: 28000, status: "Pending", date: "2025-03-28", city: "Pune", trackingId: "TRK556677" },
  { id: "ORD-007", customer: "Meera Iyer", product: "Gold Chain Necklace 18K", amount: 31000, status: "Delivered", date: "2025-03-20", city: "Hyderabad", trackingId: "TRK667788" },
  { id: "ORD-008", customer: "Rohan Gupta", product: "Silver Filigree Earrings", amount: 1800, status: "Pending", date: "2025-03-29", city: "Jaipur", trackingId: "TRK778899" },
];

export const generateMessages = () => [
  { id: 1, customer: "Priya Sharma", avatar: "PS", message: "Is the 22K bangle set available in size 2.6?", time: "10:32 AM", unread: true, replies: [] },
  { id: 2, customer: "Rahul Nair", avatar: "RN", message: "Can I get a custom engraving on the bracelet?", time: "Yesterday", unread: true, replies: ["Hi Rahul! Yes, we offer custom engraving. Please share the text you'd like."] },
  { id: 3, customer: "Sneha Patel", avatar: "SP", message: "What's the return policy for silver items?", time: "2 days ago", unread: false, replies: [] },
  { id: 4, customer: "Karthik Raj", avatar: "KR", message: "My order is showing delayed. When will it arrive?", time: "3 days ago", unread: false, replies: ["Sorry for the delay! Your order is on the way and will arrive within 2 days."] },
];

export const generateReviews = () => [
  { id: 1, customer: "Priya Sharma", product: "22K Gold Bangles Set", rating: 5, comment: "Absolutely stunning quality! The finish is impeccable and my family loved the bangles.", date: "Mar 20, 2025", replied: false },
  { id: 2, customer: "Karthik Raj", product: "Solitaire Diamond Ring", rating: 5, comment: "Perfect ring for my proposal. The diamond sparkles beautifully!", date: "Mar 18, 2025", replied: true, reply: "Thank you so much! Wishing you both a wonderful journey ahead! 💍" },
  { id: 3, customer: "Meera Iyer", product: "Gold Chain Necklace 18K", rating: 4, comment: "Beautiful craftsmanship. Slight delay in delivery but worth the wait.", date: "Mar 15, 2025", replied: false },
  { id: 4, customer: "Divya Menon", product: "Emerald Pendant Necklace", rating: 5, comment: "The pendant is even more gorgeous in person. Love the packaging too!", date: "Mar 10, 2025", replied: true, reply: "We're so glad you loved it! The packaging is designed to match our jewelry quality." },
];

export const generatePayments = () => [
  { id: "PAY-001", date: "Mar 25, 2025", amount: 252500, orders: 3, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-002", date: "Mar 18, 2025", amount: 138200, orders: 2, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-003", date: "Mar 11, 2025", amount: 97800, orders: 4, status: "Completed", method: "UPI" },
  { id: "PAY-004", date: "Mar 04, 2025", amount: 315600, orders: 5, status: "Completed", method: "Bank Transfer" },
  { id: "PAY-005", date: "Apr 01, 2025", amount: 68700, orders: 2, status: "Pending", method: "Bank Transfer" },
];

export const CANCELLED_PRODUCTS = [
  { id: 1, productName: "Wireless Earbuds", trackingId: "TRK112233", adminApproval: "Pending", shiprocketStatus: "In Transit", status: "cancelled", name: "Wireless Earbuds", cancelledCount: 1 },
  { id: 2, productName: "Smartphone Case", trackingId: "TRK445566", adminApproval: "Approved", shiprocketStatus: "Returned", status: "cancelled", name: "Smartphone Case", cancelledCount: 1 },
  { id: 3, productName: "Bluetooth Speaker", trackingId: "TRK778899", adminApproval: "Rejected", shiprocketStatus: "Not Shipped", status: "cancelled", name: "Bluetooth Speaker", cancelledCount: 1 }
];

export const genWeeklyData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(d => ({ time: d, revenue: Math.floor(Math.random() * 45000 + 12000) }));
};
export const genTodayData = () => {
  const hours = ["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];
  return hours.map(h => ({ time: h, revenue: Math.floor(Math.random() * 35000 + 5000) }));
};
export const genYesterdayData = () => {
  const hours = ["9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM"];
  return hours.map(h => ({ time: h, revenue: Math.floor(Math.random() * 28000 + 4000) }));
};
export const genMonthlyData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    time: `Mar ${i + 1}`,
    revenue: Math.floor(Math.random() * 120000 + 20000),
  }));
};
export const genMonthlyBar = () => {
  const months = ["Oct","Nov","Dec","Jan","Feb","Mar"];
  return months.map(m => ({ month: m, revenue: Math.floor(Math.random() * 900000 + 200000), orders: Math.floor(Math.random() * 80 + 20) }));
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
  return num >= 100000 ? `₹${(num/100000).toFixed(1)}L` : num >= 1000 ? `₹${(num/1000).toFixed(0)}K` : `₹${num}`;
};

export const statusColor = (s) => {
  if (s === "Delivered") return { bg: "bg-green-100", text: "text-green-600", dot: "bg-green-600" };
  if (s === "Shipped") return { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-600" };
  return { bg: "bg-yellow-100", text: "text-yellow-600", dot: "bg-yellow-600" };
};

export const avatarBg = (str) => {
  const colors = ["bg-emerald-500","bg-blue-300","bg-green-300","bg-pink-300","bg-purple-400","bg-emerald-400"];
  let h = 0; for (let c of str) h = c.charCodeAt(0) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

export const isImg = (s) => s && (s.startsWith("data:image") || s.startsWith("http") || s.startsWith("/"));
