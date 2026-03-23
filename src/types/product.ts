// Product types with nutrition information
// Shared types for frontend and can be synced with backend

export interface Nutrition {
  calories: number; // per 100g
  protein: number; // grams per 100g
  carbohydrates: number;
  fiber: number;
  fat: number;
  vitamins: string[];
  minerals: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  season: string;
  image: string;
  stock: number;
  unit: string;
  farmerId?: string;
  rating?: number;
  reviews?: number;
  freshness: string;
  isOrganic?: boolean;
  isSeasonal?: boolean;
  isTrending?: boolean;
  nutrition?: Nutrition;
  healthBenefits?: string[];
  tags?: ProductTag[];
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 
  | 'Vegetables' 
  | 'Fruits' 
  | 'Dairy' 
  | 'Grains' 
  | 'Organic';

export type ProductTag = 
  | 'high-vitamin-c'
  | 'rich-in-iron'
  | 'high-protein'
  | 'low-calorie'
  | 'high-fiber'
  | 'heart-healthy'
  | 'immunity-boost'
  | 'organic';

export interface ProductFilterParams {
  categories?: ProductCategory[];
  tags?: ProductTag[];
  maxCalories?: number;
  minProtein?: number;
  organicOnly?: boolean;
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'name' | 'calories' | 'protein';
}

export interface CategoryCount {
  category: ProductCategory;
  count: number;
}

export interface TagCount {
  tag: ProductTag;
  count: number;
}

// Smart filter definitions
export const SMART_FILTERS = {
  'high-vitamin-c': {
    label: 'High in Vitamin C',
    description: 'Boost immunity',
    icon: 'Sparkles',
    color: 'orange',
  },
  'rich-in-iron': {
    label: 'Rich in Iron',
    description: 'Energy & blood health',
    icon: 'Zap',
    color: 'red',
  },
  'high-protein': {
    label: 'High Protein',
    description: 'Muscle building',
    icon: 'Apple',
    color: 'blue',
  },
  'low-calorie': {
    label: 'Low Calories',
    description: 'Weight management',
    icon: 'Flame',
    color: 'green',
  },
  'high-fiber': {
    label: 'High Fiber',
    description: 'Digestive health',
    icon: 'Leaf',
    color: 'amber',
  },
  'heart-healthy': {
    label: 'Heart Healthy',
    description: 'Cardiovascular support',
    icon: 'Heart',
    color: 'pink',
  },
  'immunity-boost': {
    label: 'Immunity Boost',
    description: 'Natural defense',
    icon: 'Sparkles',
    color: 'purple',
  },
} as const;

// Category definitions
export const CATEGORIES = {
  Vegetables: {
    label: 'Vegetables',
    icon: 'Leaf',
    color: 'green',
  },
  Fruits: {
    label: 'Fruits',
    icon: 'Apple',
    color: 'red',
  },
  Dairy: {
    label: 'Dairy Products',
    icon: 'Heart',
    color: 'blue',
  },
  Grains: {
    label: 'Grains & Pulses',
    icon: 'Wheat',
    color: 'amber',
  },
  Organic: {
    label: 'Organic Items',
    icon: 'Zap',
    color: 'emerald',
  },
} as const;
