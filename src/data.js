export const categories = [
  {
    id: 1,
    name: 'Fresh Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 2,
    name: 'Fresh Fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 3,
    name: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 4,
    name: 'Breads & Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 5,
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=300',
  }
];

export const products = [
  // FRESH VEGETABLES (4 items)
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 45.00,
    unit: '1 kg',
    variants: [{ unit: '250 g', price: 15 }, { unit: '500 g', price: 28 }, { unit: '1 kg', price: 45 }],
    category: 'Fresh Vegetables',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
    discount: 10
  },
  {
    id: 101,
    name: 'Fresh Spinach',
    price: 30.00,
    unit: '1 bunch',
    variants: [{ unit: '1 bunch', price: 30 }, { unit: '2 bunches', price: 55 }],
    category: 'Fresh Vegetables',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },
  {
    id: 102,
    name: 'Crisp Carrots',
    price: 40.00,
    unit: '500 g',
    variants: [{ unit: '500 g', price: 40 }, { unit: '1 kg', price: 75 }],
    category: 'Fresh Vegetables',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400',
    discount: 5
  },
  {
    id: 103,
    name: 'Broccoli Crowns',
    price: 60.00,
    unit: '1 head',
    variants: [{ unit: '1 head', price: 60 }, { unit: '2 heads', price: 110 }],
    category: 'Fresh Vegetables',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },

  // FRESH FRUITS (4 items)
  {
    id: 2,
    name: 'Fresh Strawberries',
    price: 250.00,
    unit: '1 pack',
    variants: [{ unit: '250 g (1 pack)', price: 250 }, { unit: '500 g (2 packs)', price: 450 }],
    category: 'Fresh Fruits',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },
  {
    id: 5,
    name: 'Organic Avocados',
    price: 350.00,
    unit: '4 pack',
    variants: [{ unit: '2 pack', price: 190 }, { unit: '4 pack', price: 350 }, { unit: '6 pack', price: 500 }],
    category: 'Fresh Fruits',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400',
    discount: 5
  },
  {
    id: 104,
    name: 'Sweet Bananas',
    price: 60.00,
    unit: '1 Dozen',
    variants: [{ unit: 'Half Dozen', price: 35 }, { unit: '1 Dozen', price: 60 }],
    category: 'Fresh Fruits',
    rating: 4.6,
    image: 'https://m.media-amazon.com/images/I/51W9iO9AwhL._AC_UF1000,1000_QL80_.jpg',
    discount: 10
  },
  {
    id: 105,
    name: 'Honeycrisp Apples',
    price: 180.00,
    unit: '1 kg',
    variants: [{ unit: '500 g', price: 95 }, { unit: '1 kg', price: 180 }],
    category: 'Fresh Fruits',
    rating: 4.8,
    image: 'https://images.squarespace-cdn.com/content/v1/5df96db488991a57e21778da/1721934031044-N2YTH3M1A9IPSQQ1SOGP/DSC_0694-2.JPG',
    discount: 0
  },

  // DAIRY & EGGS (4 items)
  {
    id: 3,
    name: 'Whole Milk',
    price: 65.00,
    unit: '1 Liter',
    variants: [{ unit: '500 ml', price: 35 }, { unit: '1 Liter', price: 65 }, { unit: '2 Liters', price: 125 }],
    category: 'Dairy & Eggs',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },
  {
    id: 6,
    name: 'Free Range Eggs',
    price: 120.00,
    unit: '1 Dozen',
    variants: [{ unit: 'Half Dozen', price: 65 }, { unit: '1 Dozen', price: 120 }, { unit: 'Tray (30 eggs)', price: 280 }],
    category: 'Dairy & Eggs',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },
  {
    id: 106,
    name: 'Aged Cheddar Cheese',
    price: 220.00,
    unit: '200 g block',
    variants: [{ unit: '200 g block', price: 220 }, { unit: '400 g block', price: 400 }],
    category: 'Dairy & Eggs',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=400',
    discount: 5
  },
  {
    id: 107,
    name: 'Greek Yogurt',
    price: 140.00,
    unit: '500 g tub',
    variants: [{ unit: '250 g tub', price: 80 }, { unit: '500 g tub', price: 140 }],
    category: 'Dairy & Eggs',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },

  // BREADS & BAKERY (4 items)
  {
    id: 4,
    name: 'Sourdough Bread',
    price: 150.00,
    unit: '1 Loaf',
    variants: [{ unit: 'Half Loaf', price: 80 }, { unit: '1 Loaf', price: 150 }],
    category: 'Breads & Bakery',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=400',
    discount: 15
  },
  {
    id: 108,
    name: 'French Baguette',
    price: 90.00,
    unit: '1 Stick',
    variants: [{ unit: '1 Stick', price: 90 }, { unit: '2 Sticks', price: 170 }],
    category: 'Breads & Bakery',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1597079910443-60c43fc4f729?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },
  {
    id: 109,
    name: 'Chocolate Croissant',
    price: 75.00,
    unit: '1 piece',
    variants: [{ unit: '1 piece', price: 75 }, { unit: 'Pack of 4', price: 280 }],
    category: 'Breads & Bakery',
    rating: 4.9,
    image: 'https://images.getrecipekit.com/v1608585894_13_vjwdhl.jpg?aspect_ratio=16:9&quality=90&',
    discount: 5
  },
  {
    id: 110,
    name: 'Whole Wheat Buns',
    price: 60.00,
    unit: 'Pack of 6',
    variants: [{ unit: 'Pack of 4', price: 45 }, { unit: 'Pack of 6', price: 60 }],
    category: 'Breads & Bakery',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },

  // BEVERAGES (4 items)
  {
    id: 8,
    name: 'Orange Juice (100% Raw)',
    price: 90.00,
    unit: '1 Bottle',
    variants: [{ unit: '250 ml', price: 30 }, { unit: '500 ml', price: 50 }, { unit: '1 Bottle (1L)', price: 90 }],
    category: 'Beverages',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },
  {
    id: 111,
    name: 'Green Tea Leaves',
    price: 250.00,
    unit: '100 g packet',
    variants: [{ unit: '100 g packet', price: 250 }, { unit: '250 g jar', price: 550 }],
    category: 'Beverages',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&q=80&w=400',
    discount: 10
  },
  {
    id: 112,
    name: 'Roasted Coffee Beans',
    price: 450.00,
    unit: '250 g',
    variants: [{ unit: '250 g', price: 450 }, { unit: '500 g', price: 850 }],
    category: 'Beverages',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },
  {
    id: 113,
    name: 'Sparkling Mineral Water',
    price: 45.00,
    unit: '750 ml Bottle',
    variants: [{ unit: '500 ml Bottle', price: 30 }, { unit: '750 ml Bottle', price: 45 }],
    category: 'Beverages',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=400',
    discount: 0
  },

  // SNACKS (4 items)
  {
    id: 7,
    name: 'Classic Potato Chips',
    price: 50.00,
    unit: '1 Bag',
    variants: [{ unit: 'Small Bag (50g)', price: 20 }, { unit: '1 Bag (150g)', price: 50 }, { unit: 'Family Pack', price: 90 }],
    category: 'Snacks',
    rating: 4.5,
    image: 'https://shahnamkeen.in/cdn/shop/files/Sadachips.jpg?v=1761974270&width=1946',
    discount: 20
  },
  {
    id: 114,
    name: 'Premium Mixed Nuts',
    price: 350.00,
    unit: '200 g jar',
    variants: [{ unit: '100 g pouch', price: 180 }, { unit: '200 g jar', price: 350 }],
    category: 'Snacks',
    rating: 4.8,
    image: 'https://royalfantasy.in/cdn/shop/products/Mix-Special-1.jpg?v=1627473753',
    discount: 0
  },
  {
    id: 115,
    name: 'Dark Chocolate Bar (70%)',
    price: 180.00,
    unit: '1 Bar (100g)',
    variants: [{ unit: '1 Bar (100g)', price: 180 }, { unit: 'Pack of 3', price: 500 }],
    category: 'Snacks',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=400',
    discount: 5
  },
  {
    id: 116,
    name: 'Caramel Popcorn',
    price: 85.00,
    unit: '1 Tub',
    variants: [{ unit: 'Small Bag', price: 45 }, { unit: '1 Tub', price: 85 }, { unit: 'Jumbo Bucket', price: 150 }],
    category: 'Snacks',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=400',
    discount: 0
  }
];
