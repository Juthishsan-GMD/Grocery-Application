export const categories = [
  { id: 1, name: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=300' },
  { id: 4, name: 'Breads & Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300' },
  { id: 5, name: 'Beverages', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=300' },
  { id: 6, name: 'Snacks', image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&q=80&w=300' }
];

// Completely emptying static products as per user request to use Admin products only
export const defaultProducts = [];

const getLocalProducts = () => {
  try {
    const data = localStorage.getItem('grocery_db_products');
    const deleted = localStorage.getItem('grocery_db_deleted_ids');
    const deletedList = deleted ? JSON.parse(deleted) : [];
    const items = data ? JSON.parse(data) : [];
    return items.filter(i => !deletedList.includes(String(i.id)));
  } catch (e) {
    return [];
  }
};

export const products = getLocalProducts();
