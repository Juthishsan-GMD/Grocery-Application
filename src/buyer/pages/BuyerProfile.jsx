import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiPackage, 
  FiSettings, FiLogOut, FiEdit2, FiCamera, FiShield,
  FiChevronRight, FiCheckCircle, FiSave, FiX
} from 'react-icons/fi';

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

  if (authLoading) return <div className="min-h-[50vh] flex items-center justify-center text-emerald-500 font-bold">Restoring session...</div>;
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
    <div className="bg-slate-50 min-h-screen pt-20 px-5 pb-10 font-sans">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-7 items-start">
        
        {/* LEFT SIDEBAR */}
        <aside className="bg-white rounded-[20px] p-7 shadow-[0_10px_25px_rgba(0,0,0,0.05)] md:sticky md:top-[100px]">
          <div className="text-center pb-6 border-b border-slate-100 mb-6">
            <div className="relative w-[100px] h-[100px] mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-4xl font-bold shadow-[0_5px_15px_rgba(16,185,129,0.3)]">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-4 border-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-emerald-500" title="Change Photo">
                <FiCamera size={14} />
              </button>
            </div>
            <h2 className="text-[20px] font-bold text-slate-800 m-0 mb-1">{currentUser.name || 'User Name'}</h2>
            <p className="text-[14px] text-slate-500 mb-4">{currentUser.email}</p>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-500 py-1.5 px-3.5 rounded-full text-[12px] font-semibold">
              <FiShield size={12} /> Verified Member
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button 
              className={`group flex items-center gap-3 p-3 rounded-xl border-none cursor-pointer w-full transition-all duration-200 text-[15px] font-medium ${activeTab === 'profile' ? 'bg-emerald-50 text-emerald-500' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser size={18} /> <span className="flex-1 text-left">Account Info</span>
              <FiChevronRight className={`transition-all duration-200 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} size={14} />
            </button>
            <button 
              className={`group flex items-center gap-3 p-3 rounded-xl border-none cursor-pointer w-full transition-all duration-200 text-[15px] font-medium ${activeTab === 'orders' ? 'bg-emerald-50 text-emerald-500' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiPackage size={18} /> <span className="flex-1 text-left">My Orders</span>
              <span className="bg-emerald-500 text-white text-[11px] font-bold py-0.5 px-2 rounded-full mr-1">{orders.length}</span>
              <FiChevronRight className={`transition-all duration-200 ${activeTab === 'orders' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} size={14} />
            </button>
            <button 
              className={`group flex items-center gap-3 p-3 rounded-xl border-none cursor-pointer w-full transition-all duration-200 text-[15px] font-medium ${activeTab === 'settings' ? 'bg-emerald-50 text-emerald-500' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings size={18} /> <span className="flex-1 text-left">Settings</span>
              <FiChevronRight className={`transition-all duration-200 ${activeTab === 'settings' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} size={14} />
            </button>
            <button className="flex items-center gap-3 p-3 rounded-xl bg-transparent border-none cursor-pointer w-full transition-all duration-200 text-[15px] font-medium mt-4 text-red-500 hover:bg-red-50" onClick={handleLogout}>
              <FiLogOut size={18} /> <span className="flex-1 text-left">Log Out</span>
            </button>
          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main>
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-9 shadow-[0_10px_30px_rgba(0,0,0,0.04)] min-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[22px] font-bold text-slate-800">General Information</h3>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-xl text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600 outline-none border-none" onClick={handleSave}><FiSave size={14} /> Save</button>
                    <button className="flex flex-row items-center justify-center gap-2 py-2 px-4 rounded-xl text-[14px] font-semibold cursor-pointer transition-all duration-200 bg-red-50 text-red-500 border border-red-100 hover:bg-red-100" onClick={() => setIsEditing(false)}><FiX size={14} /> Cancel</button>
                  </div>
                ) : (
                  <button className="flex flex-row items-center justify-center gap-2 bg-slate-50 border border-slate-200 py-2 px-4 rounded-xl text-[14px] font-semibold text-slate-500 cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-emerald-500 hover:border-emerald-500" onClick={() => setIsEditing(true)}><FiEdit2 size={14} /> Edit</button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-emerald-500"><FiUser size={18} /></div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-400 mb-0.5 uppercase tracking-wide">Full Name</label>
                    {isEditing ? (
                      <input 
                        className="w-full p-2 border-2 border-slate-200 rounded-lg text-[14px] text-slate-800 bg-white mt-1 outline-none transition-all duration-200 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-[15px] font-bold text-slate-800 m-0">{currentUser.name || 'Not Provided'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-500"><FiMail size={18} /></div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-400 mb-0.5 uppercase tracking-wide">Email Address</label>
                    {isEditing ? (
                      <input 
                        className="w-full p-2 border-2 border-slate-200 rounded-lg text-[14px] text-slate-800 bg-white mt-1 outline-none transition-all duration-200 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                        value={editForm.email}
                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                      />
                    ) : (
                      <p className="text-[15px] font-bold text-slate-800 m-0">{currentUser.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-500"><FiPhone size={18} /></div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-400 mb-0.5 uppercase tracking-wide">Phone Number</label>
                    {isEditing ? (
                      <input 
                        className="w-full p-2 border-2 border-slate-200 rounded-lg text-[14px] text-slate-800 bg-white mt-1 outline-none transition-all duration-200 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                        value={editForm.phone}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      />
                    ) : (
                      <p className="text-[15px] font-bold text-slate-800 m-0">{currentUser.phone || '+91 98765 43210'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-500"><FiMapPin size={18} /></div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-slate-400 mb-0.5 uppercase tracking-wide">City / Address</label>
                    {isEditing ? (
                      <input 
                        className="w-full p-2 border-2 border-slate-200 rounded-lg text-[14px] text-slate-800 bg-white mt-1 outline-none transition-all duration-200 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]"
                        value={editForm.address}
                        onChange={e => setEditForm({...editForm, address: e.target.value})}
                      />
                    ) : (
                      <p className="text-[15px] font-bold text-slate-800 m-0">{currentUser.address || 'Saravampatti, Coimbatore'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-slate-800 text-white p-6 rounded-2xl text-center">
                  <h4 className="text-[12px] font-medium text-white/60 uppercase mb-2">Total Spent</h4>
                  <p className="text-[24px] font-bold m-0">₹{orders.reduce((sum, o) => sum + Number(o.total_amount), 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-800 text-white p-6 rounded-2xl text-center">
                  <h4 className="text-[12px] font-medium text-white/60 uppercase mb-2">Orders Placed</h4>
                  <p className="text-[24px] font-bold m-0">{orders.length}</p>
                </div>
                <div className="bg-slate-800 text-white p-6 rounded-2xl text-center">
                  <h4 className="text-[12px] font-medium text-white/60 uppercase mb-2">Saved Items</h4>
                  <p className="text-[24px] font-bold m-0">12</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-9 shadow-[0_10px_30px_rgba(0,0,0,0.04)] min-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[22px] font-bold text-slate-800">Recent Orders</h3>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-10 text-emerald-500">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-4">
                  <FiPackage size={48} className="text-slate-300" />
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/shop')} className="bg-emerald-500 text-white border-none rounded-xl py-3 px-6 cursor-pointer font-bold mt-2">Start Shopping</button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map(order => (
                    <div className="border border-slate-200 rounded-2xl p-5 transition-all duration-200 flex flex-col gap-4 hover:border-emerald-500 hover:shadow-[0_4px_15px_rgba(0,0,0,0.03)]" key={order.id}>
                      <div className="flex justify-between items-center">
                        <div className="text-[14px]">
                          <span className="text-slate-400 mr-1">Order ID:</span>
                          <span className="font-bold text-slate-800">#{order.id}</span>
                        </div>
                        <div className={`text-[11px] font-bold py-1 px-3 rounded-full uppercase ${order.status?.toLowerCase() === 'pending' ? 'bg-orange-50 text-orange-500' : order.status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                          {order.status || 'Pending'}
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-4 border-y border-slate-100">
                        <div>
                          <p className="text-[13px] text-slate-500 mb-1">{new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="text-[14px] m-0">Total: <strong>₹{Number(order.total_amount).toLocaleString()}</strong></p>
                        </div>
                        <div className="flex gap-2">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden" title={item.name}>
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.src = 'https://via.placeholder.com/40'} />
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="h-11 flex items-center text-[11px] font-bold text-slate-500">+{order.items.length - 3} more</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button className="bg-transparent border-none text-[13px] font-bold text-emerald-500 cursor-pointer">Track Order</button>
                        <button className="bg-transparent border-none text-[13px] font-bold text-slate-500 cursor-pointer">View Invoice</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-9 shadow-[0_10px_30px_rgba(0,0,0,0.04)] min-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[22px] font-bold text-slate-800">Account Settings</h3>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-800 mb-1">Email Notifications</label>
                    <p className="text-[13px] text-slate-500 m-0">Receive updates on your orders and special offers.</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full cursor-pointer relative transition-all duration-200">
                    <div className="absolute top-[3px] left-[27px] w-5 h-5 bg-white rounded-full transition-all duration-200"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-800 mb-1">Order Updates via WhatsApp</label>
                    <p className="text-[13px] text-slate-500 m-0">Get real-time tracking links on your phone.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full cursor-pointer relative transition-all duration-200">
                    <div className="absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full transition-all duration-200"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-slate-50">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-800 mb-1">Two-Factor Authentication</label>
                    <p className="text-[13px] text-slate-500 m-0">Secure your account with an extra layer of protection.</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full cursor-pointer relative transition-all duration-200">
                     <div className="absolute top-[3px] left-[27px] w-5 h-5 bg-white rounded-full transition-all duration-200"></div>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-slate-100">
                <h4 className="text-red-500 text-[16px] font-bold mb-4 mt-0">Danger Zone</h4>
                <button className="bg-red-50 text-red-500 border border-red-100 py-2.5 px-5 rounded-lg font-bold text-[14px] cursor-pointer hover:bg-red-100 transition-colors">Delete My Account</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BuyerProfile;
