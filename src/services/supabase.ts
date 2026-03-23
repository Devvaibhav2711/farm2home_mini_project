// Supabase Service Layer for Farm2Home
import { supabase } from '@/integrations/supabase/client';
import type {
  ProductCategory,
  OrderStatus,
  PaymentMethod
} from '@/integrations/supabase/types';

// ============================================
// PRODUCTS SERVICE
// ============================================

export interface ProductFilters {
  categories?: string[];
  tags?: string[];
  maxCalories?: number;
  minProtein?: number;
  organicOnly?: boolean;
  search?: string;
  sort?: string;
}

export const productsService = {
  async getAll(filters?: ProductFilters) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (filters?.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }

    if (filters?.organicOnly) {
      query = query.eq('is_organic', true);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    // Sort options
    switch (filters?.sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      case 'calories':
        query = query.order('nutrition->calories', { ascending: true });
        break;
      case 'protein':
        query = query.order('nutrition->protein', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Additional client-side filtering for nutrition values
    let filteredData = data || [];

    if (filters?.maxCalories && filters.maxCalories < 500) {
      filteredData = filteredData.filter((p: any) => {
        const calories = p.nutrition?.calories || 0;
        return calories <= filters.maxCalories!;
      });
    }

    if (filters?.minProtein && filters.minProtein > 0) {
      filteredData = filteredData.filter((p: any) => {
        const protein = p.nutrition?.protein || 0;
        return protein >= filters.minProtein!;
      });
    }

    // Transform to match existing frontend format
    return filteredData.map(transformProduct);
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformProduct(data);
  },

  async create(product: CreateProductInput) {
    const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        slug: `${slug}-${Date.now()}`,
        description: product.description || '',
        price: product.price,
        category: product.category as ProductCategory,
        stock: product.stock || 100,
        unit: product.unit || 'kg',
        image: product.image || 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&q=80',
        season: product.season || 'All Season',
        freshness: product.freshness || 'Fresh',
        is_organic: product.isOrganic || false,
        is_seasonal: product.isSeasonal || false,
        is_trending: product.isTrending || false,
        is_active: true,
        nutrition: product.nutrition || {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fiber: 0,
          fat: 0,
          vitamins: [],
          minerals: []
        },
        health_benefits: product.healthBenefits || [],
        tags: product.tags || []
      })
      .select()
      .single();

    if (error) throw error;
    return transformProduct(data);
  },

  async update(id: string, updates: Partial<CreateProductInput>) {
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.stock !== undefined) updateData.stock = updates.stock;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.season !== undefined) updateData.season = updates.season;
    if (updates.freshness !== undefined) updateData.freshness = updates.freshness;
    if (updates.isOrganic !== undefined) updateData.is_organic = updates.isOrganic;
    if (updates.isSeasonal !== undefined) updateData.is_seasonal = updates.isSeasonal;
    if (updates.isTrending !== undefined) updateData.is_trending = updates.isTrending;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transformProduct(data);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock?: number;
  unit?: string;
  image?: string;
  season?: string;
  freshness?: string;
  isOrganic?: boolean;
  isSeasonal?: boolean;
  isTrending?: boolean;
  nutrition?: any;
  healthBenefits?: string[];
  tags?: string[];
}

function transformProduct(p: any) {
  return {
    _id: p.id,
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category,
    stock: p.stock,
    unit: p.unit,
    image: p.image,
    season: p.season,
    freshness: p.freshness,
    isOrganic: p.is_organic,
    isSeasonal: p.is_seasonal,
    isTrending: p.is_trending,
    isFeatured: p.is_featured,
    rating: p.rating,
    reviews: p.reviews_count,
    nutrition: p.nutrition || {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fiber: 0,
      fat: 0,
      vitamins: [],
      minerals: []
    },
    healthBenefits: p.health_benefits || [],
    tags: p.tags || [],
    createdAt: p.created_at,
    updatedAt: p.updated_at
  };
}

// ============================================
// ORDERS SERVICE
// ============================================

export interface CreateOrderInput {
  userId: string;
  items: OrderItemInput[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: string;
  status?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
}

interface OrderItemInput {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  productImage?: string;
  productUnit?: string;
}

export const ordersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformOrder);
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformOrder);
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformOrder(data);
  },

  async create(orderInput: CreateOrderInput) {
    // Map payment method
    const paymentMethodMap: Record<string, PaymentMethod> = {
      'cod': 'cod',
      'phonepe': 'phonepe',
      'googlepay': 'googlepay',
      'card': 'card',
      'upi': 'upi'
    };

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderInput.userId,
        subtotal: orderInput.totalAmount,
        total_amount: orderInput.totalAmount,
        payment_method: paymentMethodMap[orderInput.paymentMethod] || 'cod',
        payment_status: 'pending',
        status: 'pending' as OrderStatus,
        shipping_name: orderInput.customerDetails.name,
        shipping_phone: orderInput.customerDetails.phone,
        shipping_email: orderInput.customerDetails.email,
        shipping_address: orderInput.shippingAddress.street,
        shipping_city: orderInput.shippingAddress.city || 'Not specified',
        shipping_state: orderInput.shippingAddress.state || 'Not specified',
        shipping_zip_code: orderInput.shippingAddress.zipCode || '000000',
        shipping_country: orderInput.shippingAddress.country || 'India',
        notes: orderInput.notes
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderInput.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage || '',
      product_price: item.price,
      product_unit: item.productUnit || 'kg',
      quantity: item.quantity,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { ...transformOrder(order), _id: order.id };
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: status as OrderStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transformOrder(data);
  }
};

function transformOrder(o: any) {
  // Transform order items
  const items = (o.order_items || []).map((item: any) => ({
    productId: item.product_id,
    productName: item.product_name,
    quantity: item.quantity,
    price: item.product_price
  }));

  return {
    _id: o.id,
    id: o.id,
    orderNumber: o.order_number,
    userId: o.user_id,
    items: items,
    totalAmount: o.total_amount,
    status: o.status,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    shippingAddress: {
      street: o.shipping_address,
      city: o.shipping_city,
      state: o.shipping_state,
      zipCode: o.shipping_zip_code,
      country: o.shipping_country
    },
    createdAt: o.created_at,
    updatedAt: o.updated_at
  };
}

// ============================================
// USERS/PROFILES SERVICE
// ============================================

export const profilesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformProfile);
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformProfile(data);
  },

  async update(id: string, updates: ProfileUpdateInput) {
    const updateData: any = {};

    if (updates.name !== undefined) updateData.full_name = updates.name;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.city !== undefined) updateData.city = updates.city;
    if (updates.state !== undefined) updateData.state = updates.state;
    if (updates.zipCode !== undefined) updateData.zip_code = updates.zipCode;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transformProfile(data);
  }
};

interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

function transformProfile(p: any) {
  return {
    _id: p.id,
    id: p.id,
    name: p.full_name,
    email: p.email,
    phone: p.phone,
    address: p.address,
    city: p.city,
    state: p.state,
    zipCode: p.zip_code,
    role: p.role,
    createdAt: p.created_at,
    updatedAt: p.updated_at
  };
}

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'customer'
        }
      }
    });

    if (error) throw error;

    // Wait a bit for profile to be created by trigger
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.user) {
      const profile = await profilesService.getById(data.user.id);
      return { user: profile, session: data.session };
    }

    return { user: null, session: data.session };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      const profile = await profilesService.getById(data.user.id);
      return { user: profile, session: data.session };
    }

    return { user: null, session: data.session };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      try {
        const profile = await profilesService.getById(user.id);
        return profile;
      } catch {
        return null;
      }
    }

    return null;
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const profile = await profilesService.getById(session.user.id);
          callback(profile);
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};

// ============================================
// NOTIFICATIONS SERVICE
// ============================================

export const notificationsService = {
  async getActive() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// ============================================
// BANNERS SERVICE
// ============================================

export const bannersService = {
  async getActive() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// ============================================
// CATEGORIES SERVICE
// ============================================

export const categoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};
