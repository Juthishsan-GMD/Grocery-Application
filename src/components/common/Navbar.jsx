import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiSearch, FiChevronDown, FiHeart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { categories } from '../../constants/data';
import '../../styles/components/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { products } = useProducts();
  const { currentUser, logoutUser } = useAuth();

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
          
          <div className="nav-categories-left dropdown-wrapper">
            <Link to="/shop" className="dropdown-trigger categories-btn-left">
              Categories <FiChevronDown className="dropdown-icon" />
            </Link>
            <ul className="dropdown-menu">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to="/shop" state={{ category: cat.name }}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
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
            <li><Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          </ul>
        </nav>
        {/* Right: Actions */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn cart-btn-modern" aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
            <FiHeart size={18} />
            {wishlist.length > 0 && <span className="cart-badge-dot" style={{ backgroundColor: '#ff5252' }}>{wishlist.length}</span>}
          </button>
          <button className="icon-btn cart-btn-modern" aria-label="Cart" onClick={() => navigate('/cart')}>
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge-dot">{cartCount}</span>}
          </button>
          
          {currentUser ? (
            <div className="user-profile-nav dropdown-wrapper" style={{ position: 'relative' }}>
              <div className="dropdown-trigger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, color: '#fff' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{currentUser.name?.split(' ')[0] || 'User'}</span> <FiChevronDown size={14} />
              </div>
              <ul className="dropdown-menu" style={{ right: 0, left: 'auto', minWidth: '150px' }}>
                <li style={{ borderBottom: '1px solid var(--border-color)', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {currentUser.email}
                </li>
                <li>
                  <button onClick={() => { logoutUser(); navigate('/'); }} style={{ width: '100%', background: 'none', border: 'none', padding: '0.8rem 1rem', textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/signup" className="btn btn-primary sign-up-btn" style={{ textDecoration: 'none' }}>Sign Up</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
