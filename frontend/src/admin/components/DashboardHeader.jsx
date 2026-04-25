import { useState, useEffect, useCallback } from "react";
import { Bell, X, Mail, Phone, LogOut, Menu, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeToggle } from "../../components/common/ThemeToggle";

export function DashboardHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/admin/${currentUser.id}`);
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

  const initials = (currentUser?.name || "AD").split(" ").map(n => n[0]).join("").toUpperCase();


  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 lg:px-5">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-2 relative">
        <button onClick={() => navigate("/")} className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Back to Store">
          <Home className="h-4 w-4 text-muted-foreground" />
        </button>
        <ThemeToggle />
        <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary border-2 border-background" />
          )}
        </button>
        <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-bold hover:opacity-90 transition-opacity">
          {initials}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-card rounded-lg border shadow-lg z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs">No notifications yet</div>
              ) : (
                notifications.map((notif) => {
                  const titleMatch = notif.message.match(/\[(.*?)\]/);
                  const title = titleMatch ? titleMatch[1] : (notif.type === 'info' ? 'Update' : notif.type === 'success' ? 'Success' : 'Alert');
                  const message = notif.message.replace(/\[.*?\]\s?/, '');
                  
                  return (
                    <div 
                      key={notif.notification_id} 
                      onClick={() => markAsRead(notif.notification_id)}
                      className={`p-3 border-b hover:bg-secondary/50 transition-colors cursor-pointer relative group ${!notif.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notif.type === "success" ? "bg-success/10 text-success" 
                          : notif.type === "warning" ? "bg-warning/10 text-warning" 
                          : notif.type === "error" ? "bg-destructive/10 text-destructive"
                          : "bg-info/10 text-info"
                        }`}>
                          {notif.type === "success" ? "✓" : notif.type === "warning" ? "!" : notif.type === "error" ? "✕" : "i"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-xs ${!notif.is_read ? 'text-primary' : 'text-card-foreground'}`}>{title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(notif.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => deleteNotification(e, notif.notification_id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-opacity"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {showProfile && (
          <div className="absolute right-0 top-12 w-72 bg-card rounded-lg border shadow-lg z-50">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">{initials}</div>
                <div>
                  <p className="font-semibold text-sm text-card-foreground">{currentUser?.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.role || "Administrator"}</p>
                </div>
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">{currentUser?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">{currentUser?.phone || "Not Set"}</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary rounded transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
