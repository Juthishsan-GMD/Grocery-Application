import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

import ProductCard from '../components/ProductCard';
import CustomSelect from '../../components/common/CustomSelect';

const brandsList = ['FreshFarm', 'OrganicLife', 'DailyNeeds', 'NatureCo', 'WholeGoods'];

const Shop = () => {
  const { products, categories: dynamicCategories } = useProducts();
  const location = useLocation();
  // const { addToCart } = useCart(); // Removed unused variable
  
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
  /*
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
  */

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (!activeCategory || activeCategory === 'All') return products;
    return products.filter(p => 
      String(p.category || '').toLowerCase().trim() === String(activeCategory).toLowerCase().trim()
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
    <div className="pt-[80px] bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-br from-[rgba(85,183,70,0.08)] to-[rgba(255,209,102,0.05)] py-16 text-center border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-[2.5rem] font-extrabold text-gray-900 mb-2">Shop Daily Fresh</h1>
          <p className="text-gray-500 text-[1.1rem]">Displaying only curated items from our fresh marketplace.</p>
        </div>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row gap-10 px-4 py-12 pb-20">
        {/* Dynamic Sidebar */}
        <aside className="w-full lg:w-[270px] shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-lg p-0 mb-6 border-none">
            <h4 className="text-[1rem] font-extrabold text-gray-900 mb-4 pb-2 border-b-2 border-[#55b746] inline-block">Browse Categories</h4>
            <div className="flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
              <div className="border-b border-gray-200 last:border-none">
                <button className="w-full flex justify-between items-center p-[1.2rem] bg-[#55b746] text-white border-none text-[0.95rem] font-bold cursor-pointer transition-colors">
                  <span>Categories</span>
                  <FiChevronDown />
                </button>
                <div className="flex flex-col bg-white">
                  <div 
                    className={`py-[0.8rem] pr-[1.2rem] pl-[1.5rem] cursor-pointer text-[0.9rem] border-b border-slate-100 transition-all flex items-center last:border-none hover:bg-[rgba(16,185,129,0.03)] ${activeCategory === 'All' ? 'bg-[rgba(16,185,129,0.12)] text-[#55b746] font-bold border-l-4 border-[#55b746]' : 'text-gray-500 font-medium hover:text-[#55b746]'}`}
                    onClick={() => setActiveCategory('All')}
                  >
                    Display All
                  </div>
                  {dynamicCategories.map(cat => {
                    const catName = typeof cat === 'string' ? cat : cat.name;
                    const isActive = String(activeCategory).toLowerCase() === String(catName).toLowerCase();
                    const displayCat = catName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    return (
                      <div 
                        key={cat.id || catName}
                        className={`py-[0.8rem] pr-[1.2rem] pl-[1.5rem] cursor-pointer text-[0.9rem] border-b border-slate-100 transition-all flex items-center last:border-none hover:bg-[rgba(16,185,129,0.03)] ${isActive ? 'bg-[rgba(16,185,129,0.12)] text-[#55b746] font-bold border-l-[3px] border-[#55b746]' : 'text-gray-500 font-medium hover:text-[#55b746]'}`}
                        onClick={() => setActiveCategory(catName)}
                      >
                        {displayCat}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Brands Filter */}
          <div className="bg-white rounded-lg p-6 px-5 border border-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.03)] xl:static">
            <h4 className="text-[1rem] font-extrabold text-gray-900 mb-[1.2rem] pb-2 border-b-2 border-[#55b746] inline-block">Sellers / Brands</h4>
            <div className="flex items-center border border-gray-200 rounded-md p-[0.6rem] px-3 mb-4 bg-slate-50 transition-colors focus-within:border-[#55b746]">
              <FiSearch className="text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="border-none bg-transparent w-full text-[0.85rem] outline-none text-gray-900"
              />
            </div>
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300">
              {brandsList.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map(brand => (
                <label key={brand} className="flex items-center gap-2.5 text-[0.9rem] text-gray-500 cursor-pointer select-none font-medium">
                  <input type="checkbox" className="cursor-pointer accent-[#55b746] w-4 h-4" />
                  <span></span>
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 px-6 rounded-xl mb-8 shadow-sm border border-gray-200 gap-4">
            <div className="text-gray-500 text-[0.95rem]">
              Found <strong className="text-gray-900 font-bold">{sortedProducts.length}</strong> items {activeCategory !== 'All' ? `in ${String(activeCategory).split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` : ''}
            </div>
            <div className="flex items-center gap-3 text-[0.95rem] text-gray-500 w-full sm:w-auto">
              <label className="text-[0.8rem] text-gray-500 font-semibold mb-0">Sort:</label>
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-4 sm:gap-6 lg:gap-8">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} cardType="shop" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-8 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-[4rem] mb-4">📦</div>
              <h3 className="text-gray-900 font-bold text-[1.4rem] mb-2">Inventory Empty</h3>
              <p className="text-gray-500 mb-6">Upload products in the Admin Panel to display them here.</p>
              <button className="bg-[#55b746] text-white hover:bg-[#459a37] hover:-translate-y-0.5 transition-all py-3 px-8 text-[1.05rem] rounded-lg font-medium" onClick={() => setActiveCategory('All')}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
