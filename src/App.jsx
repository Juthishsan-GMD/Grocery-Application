import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ScrollToTop from './components/common/ScrollToTop';
import Toast from './components/common/Toast';
import Home from './buyer/pages/Home';
import Shop from './buyer/pages/Shop';
import AuthPage from './buyer/pages/AuthPage';
import Cart from './buyer/pages/Cart';
import CheckoutPage from './buyer/pages/CheckoutPage';
import About from './buyer/pages/About';
import Contact from './buyer/pages/Contact';
import ProductDetails from './buyer/pages/ProductDetails';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { DashboardLayout } from './admin/components/DashboardLayout';
import DashboardHome from './admin/pages/DashboardHome';
import ProductsPage from './admin/pages/ProductsPage';
import AddProductPage from './admin/pages/AddProductPage';
import OrdersPage from './admin/pages/OrdersPage';
import PaymentsPage from './admin/pages/PaymentsPage';
import ReturnsPage from './admin/pages/ReturnsPage';
import FinancePage from './admin/pages/FinancePage';
import ReportsPage from './admin/pages/ReportsPage';
import ProfilePage from './admin/pages/ProfilePage';
import SupportPage from './admin/pages/SupportPage';
import SettingsPage from './admin/pages/SettingsPage';
import SellersPage from './admin/pages/SellersPage';
import PrimaryVendorPage from './admin/pages/PrimaryVendorPage';
import SellerAuthPage from './seller/pages/SellerAuthPage';
import SellerDashboard from './seller/pages/SellerDashboard';
import SellerProtectedRoute from './seller/components/SellerProtectedRoute';
import AccountRedirect from './seller/components/AccountRedirect';
import Wishlist from './buyer/pages/Wishlist';
import './styles/base/App.css';

function StoreLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<AccountRedirect />} />
        </Routes>
      </main>
      <Toast />
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <a href="/" className="logo">
              <span className="logo-icon">🛒</span>
              Fresh<span className="logo-highlight">Basket</span>
            </a>
            <p>Your one-stop shop for fresh, organic, and locally-sourced daily essentials.</p>
          </div>
          <div className="footer-links">
            <div>
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/shop">Shop</a></li>
                <li><a href="/contact">FAQ</a></li>
                <li><Link to="/seller">Seller Login</Link></li>
              </ul>
            </div>
            <div>
              <h3>Categories</h3>
              <ul>
                <li><Link to="/shop" state={{ category: 'Fresh Vegetables' }}>Vegetables</Link></li>
                <li><Link to="/shop" state={{ category: 'Fresh Fruits' }}>Fruits</Link></li>
                <li><Link to="/shop" state={{ category: 'Dairy & Eggs' }}>Dairy</Link></li>
              </ul>
            </div>
            <div>
              <h3>Contact</h3>
              <ul>
                <li>support@freshbasket.com</li>
                <li>+91 9876543210</li>
                <li>Saravampatti, Coimbatore, Tamil Nadu 641001</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FreshBasket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <ScrollToTop />
          <WishlistProvider>
            <CartProvider>
              <Routes>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/add" element={<AddProductPage />} />
                <Route path="products/edit/:id" element={<AddProductPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="returns" element={<ReturnsPage />} />
                <Route path="finance" element={<FinancePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="sellers" element={<SellersPage />} />
                <Route path="vendor" element={<PrimaryVendorPage />} />
              </Route>
              <Route path="/seller" element={<SellerAuthPage />} />
              <Route path="/seller/*" element={<SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute>} />
              <Route path="/*" element={<StoreLayout />} />
            </Routes>
            </CartProvider>
          </WishlistProvider>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
