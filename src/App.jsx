import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import './styles/App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        {/* Global Toast Mount */}
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
                </ul>
              </div>
              <div>
                <h3>Categories</h3>
                <ul>
                  <li><a href="/shop">Vegetables</a></li>
                  <li><a href="/shop">Fruits</a></li>
                  <li><a href="/shop">Dairy</a></li>
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
      </CartProvider>
    </Router>
  );
}

export default App;
