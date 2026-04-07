import React from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductCard from '../components/shop/ProductCard';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div style={{ paddingTop: '120px', minHeight: '80vh', padding: '120px 2rem 5rem', backgroundColor: '#f9fafb' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '2rem 0' }}>My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', borderRadius: '16px', border: '1px dashed #e5e7eb' }}>
            <h2 style={{ color: '#6b7280', fontSize: '1.5rem' }}>Your wishlist is empty</h2>
            <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Browse products and click the heart icon to save them here.</p>
          </div>
        ) : (
          <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
