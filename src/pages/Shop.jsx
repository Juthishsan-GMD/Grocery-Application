import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { categories, products } from '../data';
import { FiShoppingCart, FiHeart, FiStar, FiChevronRight, FiChevronDown, FiFilter, FiSearch } from 'react-icons/fi';
import '../styles/Shop.css';

import ProductCard from '../components/ProductCard';
import CustomSelect from '../components/CustomSelect';

const sidebarMenus = [
  {
    id: 1,
    title: 'Fruits & Vegetables',
    links: ['Fresh Fruits', 'Fresh Vegetables']
  },
  {
    id: 2,
    title: 'Dairy & Bakery',
    links: ['Dairy & Eggs', 'Breads & Bakery']
  },
  {
    id: 3,
    title: 'Snacks & Drinks',
    links: ['Snacks', 'Beverages']
  }
];

const brandsList = ['FreshFarm', 'OrganicLife', 'DailyNeeds', 'NatureCo', 'WholeGoods'];

const Shop = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');
  const [openMenu, setOpenMenu] = useState('Fruits & Vegetables');
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState('Featured');

  useEffect(() => {
    if (location.state && location.state.category) {
      setActiveCategory(location.state.category);
      // Auto open parent menu based on active category
      const foundParent = sidebarMenus.find(m => m.links.includes(location.state.category));
      if (foundParent) setOpenMenu(foundParent.title);
    } else {
      setActiveCategory('All');
    }
  }, [location.state]);

  // Filter products based on selected category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : activeCategory.startsWith('All-') 
      ? products.filter(p => {
          const parentTitle = activeCategory.split('-')[1];
          const parentMenu = sidebarMenus.find(m => m.title === parentTitle);
          return parentMenu ? parentMenu.links.includes(p.category) : true;
        })
      : products.filter(p => p.category === activeCategory);

  // Sort the strictly filtered products entirely on the UI execution branch
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Best Rating') return b.rating - a.rating;
    return 0; // Featured / Default
  });

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <h1>Shop Groceries</h1>
          <p>Fresh items delivered to your doorstep everyday.</p>
        </div>
      </div>

      <div className="container shop-container">
        {/* Pothys Style Modern Sidebar */}
        <aside className="shop-sidebar-modern">
          <div className="sidebar-main-widget">
            <h4 className="sidebar-widget-title">Categories</h4>
            <div className="sidebar-menus-container">
              {sidebarMenus.map(menu => {
                const isOpen = openMenu === menu.title;
                const localAllValue = `All-${menu.title}`;
                return (
                  <div key={menu.id} className="sidebar-accordion">
                    <button 
                      className={`accordion-header ${isOpen ? 'active-header' : ''}`}
                      onClick={() => setOpenMenu(isOpen ? '' : menu.title)}
                    >
                      <span>{menu.title}</span>
                      {isOpen ? <FiChevronDown /> : <FiChevronRight className="chevron-right-pale" />}
                    </button>
                    {isOpen && (
                      <div className="accordion-body">
                        {/* Only showing 'All' localized strictly to this department */}
                        <div 
                          className={`accordion-link ${activeCategory === localAllValue ? 'active-link' : ''}`}
                          onClick={() => setActiveCategory(localAllValue)}
                        >
                          All
                        </div>
                        {menu.links.map(link => (
                          <div 
                            key={link}
                            className={`accordion-link ${activeCategory === link ? 'active-link' : ''}`}
                            onClick={() => setActiveCategory(link)}
                          >
                            {link}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brands Filter Widget */}
          <div className="sidebar-brands-widget">
            <h4 className="brands-title">Brands</h4>
            <div className="brands-search-wrapper">
              <FiSearch className="b-search-icon" />
              <input 
                type="text" 
                placeholder="Search brands..." 
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </div>
            <div className="brands-list">
              {brandsList.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map(brand => (
                <label key={brand} className="brand-checkbox-container">
                  <input type="checkbox" />
                  <span className="brand-checkmark"></span>
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Products Area */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <div className="results-count">
              Showing <strong>{filteredProducts.length}</strong> results {activeCategory !== 'All' ? `for "${activeCategory}"` : ''}
            </div>
            <div className="sort-by">
              <label>Sort by:</label>
              <div style={{ minWidth: '180px' }}>
                <CustomSelect 
                  value={sortBy} 
                  onChange={setSortBy} 
                  options={[
                    { value: 'Featured', label: 'Featured' },
                    { value: 'Price: Low to High', label: 'Price: Low to High' },
                    { value: 'Price: High to Low', label: 'Price: High to Low' },
                    { value: 'Best Rating', label: 'Best Rating' }
                  ]}
                />
              </div>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="shop-grid">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} cardType="shop" />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No products found in this category.</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => setActiveCategory('All')}
                style={{ marginTop: '1rem' }}
              >
                Clear Filter
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
