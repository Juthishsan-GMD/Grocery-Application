import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Package, FileText, BarChart2, MessageSquare, 
  Settings, Menu, Search, Sun, Moon, User, LogOut, ChevronDown, CheckCircle, Tag, Bell, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// import { SELLER } from '../components/shared'; // Removed unused variable

// Import newly refactored pages
import DashboardPage from './DashboardPage';
import ProductsPage from './ProductsPage';
import OrdersPage from './OrdersPage';
import AnalyticsPage from './AnalyticsPage';
import MessagesPage from './MessagesPage';
import PaymentsPage from './PaymentsPage';
import ReviewsPage from './ReviewsPage';
import SettingsPage from './SettingsPage';
import CouponsPage from './CouponsPage';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logoutUser } = useAuth();
  
  // Sync page state with URL path to handle refreshes
  const [page, setPage] = useState(() => {
    const path = location.pathname.split("/").filter(Boolean).pop();
    const validPages = ["dashboard", "products", "orders", "analytics", "notifications", "payments", "coupons", "reviews", "settings"];
    return validPages.includes(path) ? path : "dashboard";
  });

  // Handle browser navigation (back/forward)
  useEffect(() => {
    const path = location.pathname.split("/").filter(Boolean).pop();
    const validPages = ["dashboard", "products", "orders", "analytics", "notifications", "payments", "coupons", "reviews", "settings"];
    if (validPages.includes(path) && path !== page) {
      setPage(path);
    }
  }, [location.pathname, page]);
  const [dark, setDark] = useState(() => localStorage.getItem("sellerTheme") === "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/seller/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PUT' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, { method: 'DELETE' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "products", label: "Products", icon: Package, badge: products.length || 0 },
    { id: "orders", label: "Orders", icon: FileText, badge: orders.length || 0 },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "notifications", label: "Messages", icon: MessageSquare, badge: unreadCount },
    { id: "payments", label: "Payments", icon: CheckCircle },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "reviews", label: "Reviews", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings }
  ];
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchProducts = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/seller/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Fetch products failed:", err);
    }
  }, [currentUser?.id]);

  const fetchOrders = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/seller/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Fetch orders failed:", err);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    localStorage.setItem("sellerTheme", dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      
      // Messages and reviews can remain mockup for now as per usual context unless endpoints exist
      setMessages([
        { id: 1, customer: "Alice Brown", message: "When will my order arrive?", time: "10:30 AM", avatar: "A", unread: true, replies: [] },
        { id: 2, customer: "Bob Smith", message: "Can I change the delivery address?", time: "Yesterday", avatar: "B", unread: true, replies: [] }
      ]);
      setReviews([
        {
          id: 1, orderId: "ORD-12345", productId: "P001", customer: "Alice Brown", rating: 4, title: "Good quality", comment: "The apples were fresh and crisp.", date: "2025-04-05", reviewImages: [], verified: true
        }
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchProducts, fetchOrders]);

  const hookAddProduct = async (productData) => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, sellerId: currentUser?.id })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        fetchProducts();
        return { ok: true };
      }
      return { ok: false, message: data?.message || 'Failed to add product' };
    } catch (err) {
      console.error(err);
      return { ok: false, message: 'Network error while adding product' };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, sellerId: currentUser?.id })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        fetchProducts();
        return { ok: true };
      }
      return { ok: false, message: data?.message || 'Failed to update product' };
    } catch (err) {
      console.error(err);
      return { ok: false, message: 'Network error while updating product' };
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchProducts();
        return { ok: true };
      }
      return { ok: false, message: 'Failed to delete product' };
    } catch (err) {
      console.error(err);
      return { ok: false, message: 'Network error while deleting product' };
    }
  };

  const props = { 
    products, setProducts, 
    orders, fetchOrders, 
    loading, 
    messages, setMessages, 
    reviews, setReviews,
    hookAddProduct, updateProduct, removeProduct
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage {...props} />;
      case "products": return <ProductsPage {...props} />;
      case "orders": return <OrdersPage {...props} />;
      case "analytics": return <AnalyticsPage {...props} />;
      case "notifications": return <MessagesPage {...props} />;
      case "payments": return <PaymentsPage {...props} />;
      case "coupons": return <CouponsPage {...props} />;
      case "reviews": return <ReviewsPage {...props} />;
      case "settings": return <SettingsPage {...props} dark={dark} setDark={setDark} />;
      default: return <DashboardPage {...props} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 flex overflow-hidden ${dark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-emerald-500/10">
          <div className="w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white shadow-sm">
            <ShoppingBag size={18} />
          </div>
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <div className="font-bold text-[16px] text-emerald-500 tracking-tight">{currentUser?.storeName || "FreshBasket™"}</div>
            <div className="text-[11px] text-slate-500 font-medium">Seller Hub</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button 
              key={id} 
              onClick={() => { setPage(id); navigate("/seller/" + id); }} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-none cursor-pointer transition-all text-left group ${page === id ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <div className="relative">
                {page === id && <div className="absolute -left-3.5 w-1 h-full bg-emerald-500 rounded-r-md" />}
                <Icon size={18} strokeWidth={page === id ? 2.5 : 2} />
              </div>
              <span className={`text-[13.5px] font-medium flex-1 ${page === id ? 'font-bold' : ''}`}>{label}</span>
              {badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${page === id ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-500'}`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-5 sm:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(p => !p)} className="p-2 rounded-lg bg-transparent border-none text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus-within:border-emerald-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all max-w-[380px] flex-1">
              <Search size={15} className="text-slate-400" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search products, orders..." 
                className="bg-transparent border-none outline-none text-[13.5px] text-slate-800 dark:text-slate-200 w-full placeholder-slate-400" 
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-4">
            <button onClick={() => setDark(p => !p)} className="p-2 rounded-lg bg-transparent border-none text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative">
              <button onClick={() => { setNotificationsOpen(p => !p); setProfileOpen(false); }} className="p-2 rounded-lg bg-transparent border-none text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors relative">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
                    <button onClick={() => setNotificationsOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">No notifications yet</div>
                    ) : (
                      notifications.map((notif) => {
                        const titleMatch = notif.message.match(/\[(.*?)\]/);
                        const title = titleMatch ? titleMatch[1] : 'Update';
                        const message = notif.message.replace(/\[.*?\]\s?/, '');
                        return (
                          <div 
                            key={notif.notification_id} 
                            onClick={() => { markAsRead(notif.notification_id); if (notif.order_id) { setPage('orders'); navigate('/seller/orders'); } setNotificationsOpen(false); }}
                            className={`px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group ${!notif.is_read ? 'bg-emerald-500/[0.03]' : ''}`}
                          >
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' 
                                : notif.type === 'warning' ? 'bg-amber-100 text-amber-600' 
                                : notif.type === 'error' ? 'bg-red-100 text-red-600' 
                                : 'bg-blue-100 text-blue-600'
                              }`}>
                                <Bell size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[12px] font-bold ${!notif.is_read ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>{title}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{message}</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                                  {new Date(notif.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteNotification(e, notif.notification_id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-opacity"
                              >
                                <X size={12} className="text-slate-400" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setProfileOpen(p => !p)} className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 cursor-pointer transition-all">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[12px] font-bold">
                  {(currentUser?.name || "S").split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 hidden md:block">
                  {currentUser?.name?.split(" ")[0] || "Seller"}
                </span>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  </div>
                  <button onClick={() => { setPage("settings"); navigate("/seller/settings"); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none">
                    <User size={15} /> My Profile
                  </button>
                  <button onClick={() => { logoutUser(); navigate("/login"); }} className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-5 sm:p-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 h-full">
            {renderPage()}
          </div>
        </main>

      </div>

      {/* Mobile Backdrop */}
      {profileOpen && (
        <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-20 bg-transparent" />
      )}
    </div>
  );
}
