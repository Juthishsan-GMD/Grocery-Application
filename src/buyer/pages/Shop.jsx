import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { FiChevronRight, FiChevronDown, FiFilter, FiSearch } from 'react-icons/fi';
import '../../styles/pages/Shop.css';

import ProductCard from '../components/shop/ProductCard';
import CustomSelect from '../../components/common/CustomSelect';

const brandsList = ['FreshFarm', 'OrganicLife', 'DailyNeeds', 'NatureCo', 'WholeGoods'];

const Shop = () => {
  const { products, categories: dynamicCategories } = useProducts();
  const location = useLocation();
  const { addToCart } = useCart();
  
  // Initialize with 'All' or state from navigation
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'All');
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState('Featured');

  // Sync category if navigated via Link state
  useEffect(() => {
    if (location.state && location.state.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  // Derived Categorization for Sidebar (Dynamic from Admin Products)
  const categoryGroups = useMemo(() => {
    // We can group categories into broader labels if they match certain keywords
    // For now, let's just list all unique categories from products
    const groups = [
      {
        title: 'Available Departments',
        links: dynamicCategories.length > 0 ? dynamicCategories : ['General']
      }
    ];
    return groups;
  }, [dynamicCategories]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => 
      String(p.category || '').trim() === String(activeCategory).trim()
    );
  }, [products, activeCategory]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'Price: Low to High') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'Best Rating') return list.sort((a, b) => b.rating - a.rating);
    return list; // Featured
  }, [filteredProducts, sortBy]);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <h1>Shop Daily Fresh</h1>
          <p>Displaying only curated items from our fresh marketplace.</p>
        </div>
      </div>

      <div className="container shop-container">
        {/* Dynamic Sidebar */}
        <aside className="shop-sidebar-modern">
          <div className="sidebar-main-widget">
            <h4 className="sidebar-widget-title">Browse Categories</h4>
            <div className="sidebar-menus-container">
              <div className="sidebar-accordion">
                <button className="accordion-header active-header">
                  <span>Categories</span>
                  <FiChevronDown />
                </button>
                <div className="accordion-body">
                  <div 
                    className={`accordion-link ${activeCategory === 'All' ? 'active-link' : ''}`}
                    onClick={() => setActiveCategory('All')}
                  >
                    Display All
                  </div>
                  {dynamicCategories.map(cat => (
                    <div 
                      key={cat}
                      className={`accordion-link ${activeCategory === cat ? 'active-link' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="sidebar-brands-widget">
            <h4 className="brands-title">Sellers / Brands</h4>
            <div className="brands-search-wrapper">
              <FiSearch className="b-search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
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

        {/* Main Content */}
        <main className="shop-main">
          <div className="shop-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#fff', padding: '1rem', borderRadius: '12px' }}>
            <div className="results-count">
              Found <strong>{sortedProducts.length}</strong> items {activeCategory !== 'All' ? `in ${activeCategory}` : ''}
            </div>
            <div className="sort-by" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sort:</label>
              <div style={{ minWidth: '160px' }}>
                <CustomSelect 
                  value={sortBy} 
                  onChange={setSortBy} 
                  options={[
                    { value: 'Featured', label: 'Recommended' },
                    { value: 'Price: Low to High', label: 'Lowest Price' },
                    { value: 'Price: High to Low', label: 'Highest Price' },
                    { value: 'Best Rating', label: 'Top Rated' }
                  ]}
                />
              </div>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} cardType="shop" />
              ))}
            </div>
          ) : (
            <div className="no-results" style={{ textAlign: 'center', padding: '4rem 0', background: '#fff', borderRadius: '20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Inventory Empty</h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Upload products in the Admin Panel to display them here.</p>
              <button className="btn btn-primary px-8" onClick={() => setActiveCategory('All')}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
