import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin');
    if (admin === 'true') {
      setIsAdmin(true);
    }
    const seller = localStorage.getItem('isSeller');
    if (seller === 'true') {
      setIsSeller(true);
    }
    const user = localStorage.getItem('current_user');
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = (email, password) => {
    // Keep internal admin check for simplicity
    if (email === 'admin@freshbasket.com' && password === 'admin123') {
      const adminUser = { id: 'ADM001', name: 'System Admin', email, role: 'admin' };
      setIsAdmin(true);
      setCurrentUser(adminUser);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('current_user', JSON.stringify(adminUser));
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminProfile');
  };

  const loginUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('current_user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    if (userData.role === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
    }
    if (userData.role === 'seller') {
      setIsSeller(true);
      localStorage.setItem('isSeller', 'true');
      if (userData.onboardingDone !== undefined) {
        localStorage.setItem('fb_onboarding_done', userData.onboardingDone.toString());
      }
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setIsSeller(false);
    localStorage.removeItem('current_user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isSeller');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('fb_onboarding_done');
    localStorage.removeItem('fb_onboarding_draft');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isSeller, adminLogin, adminLogout, currentUser, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
