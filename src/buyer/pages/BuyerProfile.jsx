import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiPackage, 
  FiSettings, FiLogOut, FiEdit2, FiCamera, FiShield,
  FiChevronRight, FiCheckCircle, FiSave, FiX
} from 'react-icons/fi';
import '../../styles/pages/BuyerProfile.css';

const BuyerProfile = () => {
  const { currentUser, loginUser, logoutUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setEditForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || 'Saravampatti, Coimbatore'
    });

    // Fetch orders for this user
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        const userOrders = data.filter(o => o.customer_email === currentUser.email);
        setOrders(userOrders);
      })
      .catch(err => console.error('Error fetching user orders:', err))
      .finally(() => setLoading(false));
  }, [currentUser, navigate, authLoading]);

  if (authLoading) return <div className="loading-screen-modern">Restoring session...</div>;
  if (!currentUser) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleSave = async () => {
    try {
      const resp = await fetch(`http://localhost:5000/api/auth/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          role: currentUser.role
        })
      });
      const data = await resp.json();
      if (resp.ok) {
        loginUser(data.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  return (
    <div className="profile-page-modern">
      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="profile-header-card">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
              <button className="avatar-edit-btn" title="Change Photo">
                <FiCamera size={14} />
              </button>
            </div>
            <h2 className="profile-user-name">{currentUser.name || 'User Name'}</h2>
            <p className="profile-user-email">{currentUser.email}</p>
            <div className="profile-badge">
              <FiShield size={12} /> Verified Member
            </div>
          </div>

          <nav className="profile-nav-menu">
            <button 
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser size={18} /> <span>Account Info</span>
              <FiChevronRight className="chevron" size={14} />
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiPackage size={18} /> <span>My Orders</span>
              <span className="nav-badge">{orders.length}</span>
              <FiChevronRight className="chevron" size={14} />
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings size={18} /> <span>Settings</span>
              <FiChevronRight className="chevron" size={14} />
            </button>
            <button className="profile-nav-item logout" onClick={handleLogout}>
              <FiLogOut size={18} /> <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="profile-main-content">
          {activeTab === 'profile' && (
            <div className="profile-section-card glass-effect">
              <div className="section-header">
                <h3>General Information</h3>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="edit-btn save" onClick={handleSave}><FiSave size={14} /> Save</button>
                    <button className="edit-btn cancel" onClick={() => setIsEditing(false)}><FiX size={14} /> Cancel</button>
                  </div>
                ) : (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}><FiEdit2 size={14} /> Edit</button>
                )}
              </div>
              
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon bg-green"><FiUser size={18} /></div>
                  <div className="info-details">
                    <label>Full Name</label>
                    {isEditing ? (
                      <input 
                        className="profile-input"
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <p>{currentUser.name || 'Not Provided'}</p>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon bg-blue"><FiMail size={18} /></div>
                  <div className="info-details">
                    <label>Email Address</label>
                    {isEditing ? (
                      <input 
                        className="profile-input"
                        value={editForm.email}
                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                      />
                    ) : (
                      <p>{currentUser.email}</p>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon bg-orange"><FiPhone size={18} /></div>
                  <div className="info-details">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input 
                        className="profile-input"
                        value={editForm.phone}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      />
                    ) : (
                      <p>{currentUser.phone || '+91 98765 43210'}</p>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon bg-purple"><FiMapPin size={18} /></div>
                  <div className="info-details">
                    <label>City / Address</label>
                    {isEditing ? (
                      <input 
                        className="profile-input"
                        value={editForm.address}
                        onChange={e => setEditForm({...editForm, address: e.target.value})}
                      />
                    ) : (
                      <p>{currentUser.address || 'Saravampatti, Coimbatore'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-stats-row">
                <div className="stat-card">
                  <h4>Total Spent</h4>
                  <p>₹{orders.reduce((sum, o) => sum + Number(o.total_amount), 0).toLocaleString()}</p>
                </div>
                <div className="stat-card">
                  <h4>Orders Placed</h4>
                  <p>{orders.length}</p>
                </div>
                <div className="stat-card">
                  <h4>Saved Items</h4>
                  <p>12</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-section-card glass-effect">
              <div className="section-header">
                <h3>Recent Orders</h3>
              </div>
              
              {loading ? (
                <div className="loading-spinner">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <FiPackage size={48} />
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/shop')} className="shop-now-btn">Start Shopping</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div className="order-item-card" key={order.id}>
                      <div className="order-card-header">
                        <div className="order-id">
                          <span className="label">Order ID:</span>
                          <span className="value">#{order.id}</span>
                        </div>
                        <div className={`order-status-badge ${order.status?.toLowerCase()}`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="order-card-body">
                        <div className="order-summary-info">
                          <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="order-total">Total: <strong>₹{Number(order.total_amount).toLocaleString()}</strong></p>
                        </div>
                        <div className="order-items-preview">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="item-thumbnail" title={item.name}>
                              <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://via.placeholder.com/40'} />
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="items-extra">+{order.items.length - 3} more</div>
                          )}
                        </div>
                      </div>
                      <div className="order-card-footer">
                        <button className="view-details-link">Track Order</button>
                        <button className="view-details-link secondary">View Invoice</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-section-card glass-effect">
              <div className="section-header">
                <h3>Account Settings</h3>
              </div>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Email Notifications</label>
                    <p>Receive updates on your orders and special offers.</p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Order Updates via WhatsApp</label>
                    <p>Get real-time tracking links on your phone.</p>
                  </div>
                  <div className="toggle-switch"></div>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Two-Factor Authentication</label>
                    <p>Secure your account with an extra layer of protection.</p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>
              </div>
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <button className="delete-account-btn">Delete My Account</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuyerProfile;
