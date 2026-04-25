import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import { ProductProvider, useProducts } from './contexts/ProductContext';
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
import CustomersPage from './admin/pages/CustomersPage';
import SellerAuthPage from './seller/pages/SellerAuthPage';
import SellerDashboard from './seller/pages/SellerDashboard';
import SellerOnboarding from './seller/pages/SellerOnboarding';
import AdminSignupPage from './admin/pages/AdminSignupPage';
import SellerProtectedRoute from './seller/components/SellerProtectedRoute';
import AccountRedirect from './seller/components/AccountRedirect';
import Wishlist from './buyer/pages/Wishlist';
import BuyerProfile from './buyer/pages/BuyerProfile';

function StoreLayout() {
  const navigate = useNavigate();
  const { categories } = useProducts();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
          <Route path="/profile" element={<BuyerProfile />} />
          <Route path="/account" element={<AccountRedirect />} />
        </Routes>
      </main>
      <footer className="bg-gradient-to-br from-emerald-600 to-emerald-500 pt-20 px-4 mt-16 text-white border-t-0">
        <div className="container mx-auto flex justify-between flex-wrap gap-12 mb-16">
          <div className="max-w-[350px]">
            <a href="/" className="text-white text-[1.8rem] font-extrabold flex items-center gap-2 no-underline">
              <span className="text-[1.8rem]">🛒</span>
              Fresh<span className="text-emerald-200">Basket</span>
            </a>
            <p className="text-white/85 mt-5 leading-[1.6]">Your one-stop shop for fresh, organic, and locally-sourced daily essentials.</p>
          </div>
          <div className="flex gap-8 md:gap-16 flex-1 justify-start md:justify-end flex-wrap">
            <div className="min-w-[150px]">
              <h3 className="text-[1.1rem] font-bold mb-6 text-white">Quick Links</h3>
              <ul className="flex flex-col gap-4 list-none m-0 p-0">
                <li><a href="/about" className="text-white/75 text-[0.95rem] transition-all duration-300 no-underline hover:text-white hover:pl-1">About Us</a></li>
                <li><a href="/shop" className="text-white/75 text-[0.95rem] transition-all duration-300 no-underline hover:text-white hover:pl-1">Shop</a></li>
                <li><a href="/contact" className="text-white/75 text-[0.95rem] transition-all duration-300 no-underline hover:text-white hover:pl-1">FAQ</a></li>
                <li><Link to="/seller/auth" className="text-white/75 text-[0.95rem] transition-all duration-300 no-underline hover:text-white hover:pl-1">Seller Login</Link></li>
              </ul>
            </div>
            <div className="min-w-[150px]">
              <h3 className="text-[1.1rem] font-bold mb-6 text-white">Categories</h3>
              <ul className="flex flex-col gap-4 list-none m-0 p-0">
                {categories.slice(0, 4).map(cat => (
                  <li key={cat.id}>
                    <Link 
                      to="/shop" 
                      state={{ category: cat.name }} 
                      className="text-white/75 text-[0.95rem] transition-all duration-300 no-underline hover:text-white hover:pl-1"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-[150px]">
              <h3 className="text-[1.1rem] font-bold mb-6 text-white">Contact</h3>
              <ul className="flex flex-col gap-4 list-none m-0 p-0 text-white/75 text-[0.95rem]">
                <li>support@freshbasket.com</li>
                <li>+91 9876543210</li>
                <li>Saravampatti, Coimbatore, Tamil Nadu 641001</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center py-6 border-t border-white/15 text-white/75 text-[0.9rem]">
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
              <Toast />
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
                <Route path="customers" element={<CustomersPage />} />
                <Route path="vendor" element={<PrimaryVendorPage />} />
              </Route>
                <Route path="/seller/auth" element={<SellerAuthPage />} />
                <Route path="/admin/signup" element={<AdminSignupPage />} />
                <Route path="/seller/onboarding" element={<SellerProtectedRoute><SellerOnboarding /></SellerProtectedRoute>} />
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
