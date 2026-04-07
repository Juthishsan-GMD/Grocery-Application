import React from 'react';
import { X, Package, IndianRupee, Image as ImageIcon } from 'lucide-react';

export default function ProductViewModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="relative bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-20"
        >
          <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/5 aspect-square md:aspect-auto bg-gray-100 dark:bg-zinc-800 relative z-0 flex items-center justify-center border-r border-gray-100 dark:border-zinc-800">
           {product.image && (product.image.startsWith('http') || product.image.startsWith('data:') || product.image.startsWith('/')) ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
           ) : (
              <ImageIcon className="w-16 h-16 text-gray-400 opacity-50" />
           )}
           {product.mrp > product.price && (
             <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg border border-emerald-400">
               {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
             </div>
           )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col max-h-[80vh] overflow-y-auto">
           <div className="mb-4">
             <span className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] font-bold tracking-widest uppercase rounded-full mb-3 border border-emerald-200 dark:border-emerald-800/50">
               {product.category || "General"}
             </span>
             <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">{product.name}</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-widest font-mono opacity-70">
               SKU: {product.sku || `GRO-${product.id.toString().slice(-4)}`} • STORE: {product.seller || "FreshBasket™"}
             </p>
           </div>

           <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 mb-6">
             <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
               {product.description || "No specific description available for this item."}
             </p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 flex items-center justify-center rounded-xl">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Base Sell Price</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">₹{product.price}</p>
                </div>
             </div>

             <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 bg-amber-50 text-amber-600 dark:bg-amber-900/20 flex items-center justify-center rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Stock Inventory</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{product.stock}</p>
                </div>
             </div>
           </div>

           {product.variants && product.variants.length > 0 && (
             <div className="mt-auto">
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Available Variants ({product.variants.length})</p>
               <div className="flex flex-wrap gap-2 text-sm max-h-[140px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                 {product.variants.map((v, i) => (
                   <div key={i} className="flex-1 min-w-[45%] p-3 bg-gray-50 dark:bg-zinc-800/80 rounded-xl border border-gray-200 dark:border-zinc-700 flex justify-between items-center transition-colors hover:bg-gray-100 hover:border-gray-300">
                     <span className="font-bold text-gray-800 dark:text-gray-200">{v.unit}</span>
                     <div className="flex flex-col items-end">
                       <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{v.price}</span>
                       <span className="text-[10px] text-gray-500">{v.stock} in stock</span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
