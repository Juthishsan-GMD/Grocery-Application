import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiSearch, FiChevronDown, FiHeart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { categories } from '../../constants/data';

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

  const navLinkClass = (path) => `text-[0.95rem] relative transition-colors py-1 flex items-center gap-1 no-underline hover:text-white hover:font-semibold ${location.pathname === path ? 'text-white font-semibold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-white after:rounded-sm' : 'text-white/80 font-medium'}`;

  return (
    <header className={`absolute top-0 left-0 w-full z-[1000] py-5 transition-all duration-300 shadow-md ${scrolled ? 'fixed !py-3 shadow-lg bg-gradient-to-br from-[#047857] to-[#059669]' : 'bg-gradient-to-br from-[#059669] to-[#10b981]'}`}>
      <div className="container mx-auto flex justify-between items-center gap-6 px-4 md:px-0">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <button className="lg:hidden text-white bg-transparent border-none cursor-pointer">
            <FiMenu size={24} />
          </button>
          <Link to="/" className="text-[1.5rem] font-extrabold flex items-center gap-2 text-white no-underline tracking-[-0.5px]">
            <span className="text-[1.8rem]">🛒</span>
            Fresh<span className="text-[#a7f3d0] font-semibold">Basket</span>
          </Link>
          
          <div className="hidden md:block ml-2 relative group">
            <Link to="/shop" className="text-[0.95rem] font-semibold text-white flex items-center gap-1.5 py-2 px-5 rounded-[10px] no-underline transition-all duration-300 bg-white/10 hover:bg-white/20 hover:-translate-y-[1px] border border-white/10">
              Categories <FiChevronDown className="text-[0.9rem] mt-0.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>
            <ul className="absolute top-full left-0 bg-white min-w-[200px] rounded-xl shadow-lg py-2 opacity-0 invisible translate-y-2.5 transition-all duration-300 z-[1000] list-none border border-gray-100 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to="/shop" state={{ category: cat.name }} className="block py-2 px-5 text-gray-500 transition-all text-[0.9rem] font-medium hover:bg-gray-50 hover:text-emerald-600 hover:pl-6 no-underline">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-[320px] hidden xl:block relative">
          <div className="flex items-center bg-white/15 rounded-full py-2 px-5 transition-all border border-white/20 focus-within:bg-white focus-within:border-white focus-within:ring-[3px] focus-within:ring-white/30 group/search">
            <FiSearch className="text-white/85 text-[1.1rem] mr-3 transition-all group-focus-within/search:text-emerald-600" />
            <input 
              type="text" 
              placeholder="Search for groceries..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 border-none bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/70 group-focus-within/search:text-gray-900"
            />
          </div>
          {/* Live Search Interactive Overlay */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden z-[9999] border border-black/5 animate-slide-down">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Link 
                    key={result.id} 
                    to={`/product/${result.id}`} 
                    className="flex items-center gap-4 p-4 no-underline border-b border-gray-100 transition-colors last:border-b-0 hover:bg-emerald-600/5 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  >
                    <img src={result.image} alt={result.name} className="w-[50px] h-[50px] object-contain rounded-xl bg-gray-50 p-1 border border-gray-100" />
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-extrabold text-[0.95rem]">{result.name}</span>
                      <span className="text-gray-500 text-[0.8rem] font-semibold uppercase mt-0.5">{result.category}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 font-bold">No fresh products found!</div>
              )}
            </div>
          )}
        </div>

        {/* Center Right: Links & Dropdown */}
        <nav className="hidden lg:flex justify-center">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            <li><Link to="/" className={navLinkClass('/')}>Home</Link></li>
            <li><Link to="/shop" className={navLinkClass('/shop')}>Shop</Link></li>
            <li><Link to="/about" className={navLinkClass('/about')}>About Us</Link></li>
            <li><Link to="/contact" className={navLinkClass('/contact')}>Contact</Link></li>
          </ul>
        </nav>
        {/* Right: Actions */}
        <div className="flex items-center gap-5 ml-4">
          <button className="bg-transparent border-none text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all relative hover:bg-white/15" aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
            <FiHeart size={18} />
            {wishlist.length > 0 && <span className="absolute -top-0.5 -right-1 bg-[#ff5252] min-w-[18px] h-[18px] px-1 rounded-full border-2 border-emerald-600 flex items-center justify-center text-[0.7rem] font-extrabold text-white">{wishlist.length}</span>}
          </button>
          <button className="bg-transparent border-none text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all relative hover:bg-white/15" aria-label="Cart" onClick={() => navigate('/cart')}>
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-1 bg-amber-500 min-w-[18px] h-[18px] px-1 rounded-full border-2 border-emerald-600 flex items-center justify-center text-[0.7rem] font-extrabold text-white">{cartCount}</span>}
          </button>
          
          {currentUser ? (
            <div className="relative group/user cursor-pointer">
              <div className="flex items-center gap-2 font-semibold text-white">
                <div className="w-[36px] h-[36px] rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold">
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{currentUser.name?.split(' ')[0] || 'User'}</span> 
                <FiChevronDown size={14} className="transition-transform duration-300 group-hover/user:rotate-180" />
              </div>
              <ul className="absolute top-full right-0 left-auto bg-white min-w-[150px] rounded-xl shadow-lg py-2 opacity-0 invisible translate-y-2.5 transition-all duration-300 z-[1000] list-none border border-gray-100 group-hover/user:opacity-100 group-hover/user:visible group-hover/user:translate-y-0">
                <li className="border-b border-gray-100 px-4 py-2 text-[0.85rem] text-gray-500">
                  {currentUser.email}
                </li>
                <li>
                  <Link to="/profile" className="block px-4 py-3 text-gray-900 text-[0.95rem] font-semibold transition-colors hover:bg-gray-50 hover:text-emerald-600 hover:pl-5 no-underline">
                    My Profile
                  </Link>
                </li>
                <li>
                  <button onClick={() => { logoutUser(); navigate('/'); }} className="w-full bg-transparent border-none px-4 py-3 text-left cursor-pointer text-gray-900 text-[0.95rem] font-semibold transition-colors hover:bg-gray-50 hover:text-emerald-600 hover:pl-5">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-[0.95rem] font-semibold text-white transition-colors hover:text-emerald-200 no-underline">Login</Link>
              <Link to="/signup" className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full font-bold text-[0.95rem] bg-white text-emerald-600 border-none transition-colors hover:bg-gray-100 hover:text-emerald-700 no-underline">Sign Up</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;

