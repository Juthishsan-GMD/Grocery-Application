import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { categories, products } from '../data';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== '') {
      const results = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        
        {/* Left: Logo */}
        <div className="nav-left">
          <button className="menu-btn">
            <FiMenu size={24} />
          </button>
          <Link to="/" className="logo">
            <span className="logo-icon">🛒</span>
            Fresh<span className="logo-highlight">Basket</span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="nav-search" style={{ position: 'relative' }}>
          <div className="search-bar-modern">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for groceries..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {/* Live Search Interactive Overlay */}
          {searchQuery.trim().length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Link 
                    key={result.id} 
                    to={`/product/${result.id}`} 
                    className="search-result-item" 
                    onClick={() => setSearchQuery('')}
                  >
                    <img src={result.image} alt={result.name} />
                    <div className="search-item-info">
                      <span className="search-item-name">{result.name}</span>
                      <span className="search-item-cat">{result.category}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="search-no-results">No fresh products found!</div>
              )}
            </div>
          )}
        </div>

        {/* Center Right: Links & Dropdown */}
        <nav className="nav-center">
          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li className="dropdown-wrapper">
              <Link to="/shop" className="dropdown-trigger">
                Categories <FiChevronDown className="dropdown-icon" />
              </Link>
              <ul className="dropdown-menu">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link to="/shop" state={{ category: cat.name }}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li><Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          </ul>
        </nav>
        {/* Right: Actions */}
        <div className="nav-right">
          <button className="icon-btn cart-btn-modern" aria-label="Cart" onClick={() => navigate('/cart')}>
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge-dot">{cartCount}</span>}
          </button>
          <Link to="/login" className="login-link">Login</Link>
          <Link to="/signup" className="btn btn-primary sign-up-btn" style={{ textDecoration: 'none' }}>Sign Up</Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
