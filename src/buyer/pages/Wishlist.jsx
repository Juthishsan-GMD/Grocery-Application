import React from 'react';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductCard from '../components/shop/ProductCard';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="pt-[120px] min-h-[80vh] px-8 pb-20 bg-gray-50">
      <div className="container max-w-[1200px] mx-auto">
        <h1 className="text-[2.5rem] font-extrabold my-8">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <h2 className="text-gray-500 text-2xl">Your wishlist is empty</h2>
            <p className="text-gray-400 mt-4">Browse products and click the heart icon to save them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8">
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
