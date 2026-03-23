import { Product } from '@/context/CartContext';

export const products: Product[] = [
  // Vegetables (8 products)
  {
    id: 'veg-1',
    name: 'Fresh Tomatoes',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1546470427-227e917bb2ab?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per kg'
  },
  {
    id: 'veg-2',
    name: 'Organic Spinach',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per bunch'
  },
  {
    id: 'veg-3',
    name: 'Fresh Carrots',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per kg'
  },
  {
    id: 'veg-4',
    name: 'Bell Peppers',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per kg'
  },
  {
    id: 'veg-5',
    name: 'Fresh Broccoli',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per head'
  },
  {
    id: 'veg-6',
    name: 'Organic Lettuce',
    price: 2.79,
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per head'
  },
  {
    id: 'veg-7',
    name: 'Fresh Cauliflower',
    price: 3.29,
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per head'
  },
  {
    id: 'veg-8',
    name: 'Green Beans',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=500&h=500&fit=crop',
    category: 'Vegetables',
    unit: 'per kg'
  },
  
  // Fruits (8 products)
  {
    id: 'fruit-1',
    name: 'Fresh Apples',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per kg'
  },
  {
    id: 'fruit-2',
    name: 'Ripe Bananas',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per dozen'
  },
  {
    id: 'fruit-3',
    name: 'Sweet Oranges',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per kg'
  },
  {
    id: 'fruit-4',
    name: 'Fresh Strawberries',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per 500g'
  },
  {
    id: 'fruit-5',
    name: 'Juicy Watermelon',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784613?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per piece'
  },
  {
    id: 'fruit-6',
    name: 'Fresh Grapes',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1599819177804-f8b8dcb04e5e?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per kg'
  },
  {
    id: 'fruit-7',
    name: 'Ripe Mangoes',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per kg'
  },
  {
    id: 'fruit-8',
    name: 'Fresh Pineapple',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&h=500&fit=crop',
    category: 'Fruits',
    unit: 'per piece'
  },
  
  // Dairy (6 products)
  {
    id: 'dairy-1',
    name: 'Farm Fresh Milk',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop',
    category: 'Dairy',
    unit: 'per liter'
  },
  {
    id: 'dairy-2',
    name: 'Organic Eggs',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&h=500&fit=crop',
    category: 'Dairy',
    unit: 'per dozen'
  },
  {
    id: 'dairy-3',
    name: 'Fresh Paneer',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop',
    category: 'Dairy',
    unit: 'per 500g'
  },
  {
    id: 'dairy-4',
    name: 'Pure Butter',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop',
    category: 'Dairy',
    unit: 'per 250g'
  },
  {
    id: 'dairy-5',
    name: 'Fresh Yogurt',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop',
    category: 'Dairy',
    unit: 'per 500g'
  },
  {
    id: 'dairy-6',
    name: 'Farm Cheese',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=500&fit=crop',
    category: 'Dairy',
    unit: 'per 250g'
  },
  
  // Grains (6 products)
  {
    id: 'grain-1',
    name: 'Organic Rice',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
    category: 'Grains',
    unit: 'per 5kg'
  },
  {
    id: 'grain-2',
    name: 'Whole Wheat Flour',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
    category: 'Grains',
    unit: 'per 2kg'
  },
  {
    id: 'grain-3',
    name: 'Brown Rice',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&h=500&fit=crop',
    category: 'Grains',
    unit: 'per 5kg'
  },
  {
    id: 'grain-4',
    name: 'Organic Oats',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1614961909013-3f3a32c5e6e6?w=500&h=500&fit=crop',
    category: 'Grains',
    unit: 'per kg'
  },
  {
    id: 'grain-5',
    name: 'Quinoa',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
    category: 'Grains',
    unit: 'per kg'
  },
  {
    id: 'grain-6',
    name: 'Pearl Millet',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
    category: 'Grains',
    unit: 'per kg'
  },
  
  // Organic Items (6 products)
  {
    id: 'organic-1',
    name: 'Organic Honey',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784613?w=500&h=500&fit=crop',
    category: 'Organic',
    unit: 'per 500g'
  },
  {
    id: 'organic-2',
    name: 'Cold-Pressed Oil',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop',
    category: 'Organic',
    unit: 'per liter'
  },
  {
    id: 'organic-3',
    name: 'Organic Turmeric',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&h=500&fit=crop',
    category: 'Organic',
    unit: 'per 500g'
  },
  {
    id: 'organic-4',
    name: 'Organic Jaggery',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1604431696980-07e518647bec?w=500&h=500&fit=crop',
    category: 'Organic',
    unit: 'per kg'
  },
  {
    id: 'organic-5',
    name: 'Herbal Tea',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=500&fit=crop',
    category: 'Organic',
    unit: 'per 100g'
  },
  {
    id: 'organic-6',
    name: 'Organic Ghee',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=500&fit=crop',
    category: 'Organic',
    unit: 'per 500g'
  },
];

export const categories = ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Organic'] as const;
export type Category = typeof categories[number];

export const getProductsByCategory = (category: Category) => {
  return products.filter(product => product.category === category);
};
