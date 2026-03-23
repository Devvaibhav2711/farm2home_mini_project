-- =====================================================
-- FARM2HOME - FRESH DATABASE SCHEMA
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- STEP 1: CLEANUP EVERYTHING FIRST
-- =====================================================

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS set_order_number_trigger ON public.orders;

-- Drop views
DROP VIEW IF EXISTS public.order_details CASCADE;
DROP VIEW IF EXISTS public.product_listing CASCADE;

-- Drop tables
DROP TABLE IF EXISTS public.order_status_history CASCADE;
DROP TABLE IF EXISTS public.coupon_usage CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.wishlist CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.farmers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_farmer(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS public.set_order_number() CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.notification_type CASCADE;
DROP TYPE IF EXISTS public.product_category CASCADE;
DROP TYPE IF EXISTS public.payment_method CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Drop storage policies
DO $$
DECLARE pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- =====================================================
-- STEP 2: CREATE ENUMS
-- =====================================================

CREATE TYPE public.user_role AS ENUM ('customer', 'admin', 'farmer');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.payment_method AS ENUM ('cod', 'phonepe', 'googlepay', 'card', 'upi');
CREATE TYPE public.product_category AS ENUM ('Vegetables', 'Fruits', 'Dairy', 'Grains', 'Organic');
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error', 'promo');

-- =====================================================
-- STEP 3: CREATE TABLES
-- =====================================================

-- Profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'India',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Farmers
CREATE TABLE public.farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    farm_description TEXT,
    farm_location TEXT,
    is_verified BOOLEAN DEFAULT false,
    rating DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category product_category NOT NULL,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    unit TEXT NOT NULL DEFAULT 'kg',
    image TEXT,
    farmer_id UUID REFERENCES public.farmers(id),
    season TEXT,
    freshness TEXT DEFAULT 'Fresh',
    is_organic BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    nutrition JSONB DEFAULT '{"calories":0,"protein":0,"carbohydrates":0,"fiber":0,"fat":0,"vitamins":[],"minerals":[]}'::jsonb,
    health_benefits TEXT[],
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cart Items
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status order_status DEFAULT 'pending' NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending' NOT NULL,
    payment_id TEXT,
    shipping_name TEXT NOT NULL,
    shipping_phone TEXT NOT NULL,
    shipping_email TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_zip_code TEXT NOT NULL,
    shipping_country TEXT DEFAULT 'India',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    product_price DECIMAL(10,2) NOT NULL,
    product_unit TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reviews
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(product_id, user_id)
);

-- Wishlist
CREATE TABLE public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Coupons
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    min_order_value DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Addresses
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'Home',
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Contact Messages
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Banners
CREATE TABLE public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================================================
-- STEP 4: CREATE FUNCTIONS
-- =====================================================

-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'customer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'F2H-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((random()*9999)::int::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Set order number trigger function
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 5: CREATE TRIGGERS
-- =====================================================

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- =====================================================
-- STEP 6: ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));

-- Categories
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));

-- Products
CREATE POLICY "products_select" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin" ON public.products FOR ALL USING (public.is_admin(auth.uid()));

-- Cart
CREATE POLICY "cart_own" ON public.cart_items FOR ALL USING (user_id = auth.uid());

-- Orders
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders_admin" ON public.orders FOR ALL USING (public.is_admin(auth.uid()));

-- Order Items
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "order_items_admin" ON public.order_items FOR ALL USING (public.is_admin(auth.uid()));

-- Reviews
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_admin" ON public.reviews FOR ALL USING (public.is_admin(auth.uid()));

-- Wishlist
CREATE POLICY "wishlist_own" ON public.wishlist FOR ALL USING (user_id = auth.uid());

-- Coupons
CREATE POLICY "coupons_select" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "coupons_admin" ON public.coupons FOR ALL USING (public.is_admin(auth.uid()));

-- Addresses
CREATE POLICY "addresses_own" ON public.addresses FOR ALL USING (user_id = auth.uid());

-- Notifications
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "notifications_admin" ON public.notifications FOR ALL USING (public.is_admin(auth.uid()));

-- Contact
CREATE POLICY "contact_insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_admin" ON public.contact_messages FOR ALL USING (public.is_admin(auth.uid()));

-- Banners
CREATE POLICY "banners_select" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "banners_admin" ON public.banners FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================
-- STEP 7: STORAGE BUCKETS
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- =====================================================
-- STEP 8: SEED DATA
-- =====================================================

-- Categories
INSERT INTO public.categories (name, slug, description, display_order) VALUES
('Vegetables', 'vegetables', 'Fresh farm vegetables', 1),
('Fruits', 'fruits', 'Seasonal fresh fruits', 2),
('Dairy', 'dairy', 'Fresh dairy products', 3),
('Grains', 'grains', 'Whole grains and pulses', 4),
('Organic', 'organic', 'Certified organic products', 5);

-- Products
INSERT INTO public.products (name, slug, description, price, category, stock, unit, image, is_organic, is_seasonal, is_trending, is_featured, freshness, nutrition, health_benefits, tags) VALUES
('Fresh Tomatoes', 'fresh-tomatoes', 'Farm-fresh red tomatoes, perfect for salads', 40.00, 'Vegetables', 100, 'kg',
 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400', false, true, true, true, 'Fresh',
 '{"calories":18,"protein":0.9,"carbohydrates":3.9,"fiber":1.2,"fat":0.2,"vitamins":["Vitamin C","Vitamin K"],"minerals":["Potassium"]}'::jsonb,
 ARRAY['Heart health','Rich in antioxidants'], ARRAY['high-vitamin-c','low-calorie','heart-healthy']),

('Organic Spinach', 'organic-spinach', 'Nutrient-rich organic spinach leaves', 60.00, 'Vegetables', 50, 'bundle',
 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', true, false, true, true, 'Fresh',
 '{"calories":23,"protein":2.9,"carbohydrates":3.6,"fiber":2.2,"fat":0.4,"vitamins":["Vitamin A","Vitamin C","Vitamin K"],"minerals":["Iron","Calcium"]}'::jsonb,
 ARRAY['Boosts immunity','Good for bones','Rich in iron'], ARRAY['rich-in-iron','high-fiber','immunity-boost','organic']),

('Fresh Apples', 'fresh-apples', 'Crispy apples from Himalayan orchards', 120.00, 'Fruits', 80, 'kg',
 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', false, true, false, false, 'Fresh',
 '{"calories":52,"protein":0.3,"carbohydrates":14,"fiber":2.4,"fat":0.2,"vitamins":["Vitamin C"],"minerals":["Potassium"]}'::jsonb,
 ARRAY['Heart health','Good for digestion'], ARRAY['high-fiber','low-calorie','heart-healthy']),

('Farm Fresh Milk', 'farm-fresh-milk', 'Pure cow milk from grass-fed cows', 60.00, 'Dairy', 200, 'liter',
 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', false, false, true, true, 'Fresh',
 '{"calories":42,"protein":3.4,"carbohydrates":5,"fiber":0,"fat":1,"vitamins":["Vitamin D","Vitamin B12"],"minerals":["Calcium"]}'::jsonb,
 ARRAY['Strong bones','Good source of protein'], ARRAY['high-protein','immunity-boost']),

('Fresh Mangoes', 'fresh-mangoes', 'Sweet Alphonso mangoes, king of fruits', 200.00, 'Fruits', 60, 'kg',
 'https://images.unsplash.com/photo-1553279768-865329ba8f96?w=400', false, true, true, true, 'Fresh',
 '{"calories":60,"protein":0.8,"carbohydrates":15,"fiber":1.6,"fat":0.4,"vitamins":["Vitamin C","Vitamin A"],"minerals":["Potassium"]}'::jsonb,
 ARRAY['Boosts immunity','Good for skin'], ARRAY['high-vitamin-c','immunity-boost']),

('Fresh Paneer', 'fresh-paneer', 'Soft cottage cheese from pure milk', 320.00, 'Dairy', 40, 'kg',
 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', false, false, false, false, 'Fresh',
 '{"calories":265,"protein":18.3,"carbohydrates":1.2,"fiber":0,"fat":20.8,"vitamins":["Vitamin A","Vitamin B12"],"minerals":["Calcium"]}'::jsonb,
 ARRAY['High protein','Good for bones'], ARRAY['high-protein']),

('Organic Carrots', 'organic-carrots', 'Crunchy organic carrots for salads', 45.00, 'Vegetables', 90, 'kg',
 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', true, false, false, false, 'Fresh',
 '{"calories":41,"protein":0.9,"carbohydrates":10,"fiber":2.8,"fat":0.2,"vitamins":["Vitamin A","Vitamin C"],"minerals":["Potassium"]}'::jsonb,
 ARRAY['Good for eyes','Boosts immunity'], ARRAY['high-vitamin-c','high-fiber','organic']),

('Fresh Bananas', 'fresh-bananas', 'Naturally ripened bananas', 50.00, 'Fruits', 120, 'dozen',
 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', false, false, false, false, 'Fresh',
 '{"calories":89,"protein":1.1,"carbohydrates":23,"fiber":2.6,"fat":0.3,"vitamins":["Vitamin B6","Vitamin C"],"minerals":["Potassium"]}'::jsonb,
 ARRAY['Instant energy','Good for heart'], ARRAY['high-fiber','heart-healthy']),

('Organic Brown Rice', 'organic-brown-rice', 'Whole grain organic brown rice', 150.00, 'Grains', 150, 'kg',
 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', true, false, false, false, 'Fresh',
 '{"calories":111,"protein":2.6,"carbohydrates":23,"fiber":1.8,"fat":0.9,"vitamins":["Vitamin B6"],"minerals":["Magnesium"]}'::jsonb,
 ARRAY['Good for digestion','Sustained energy'], ARRAY['high-fiber','heart-healthy','organic']),

('Organic Moong Dal', 'organic-moong-dal', 'Premium organic split green gram', 180.00, 'Grains', 100, 'kg',
 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', true, false, false, false, 'Fresh',
 '{"calories":347,"protein":24,"carbohydrates":63,"fiber":16.3,"fat":1.2,"vitamins":["Folate"],"minerals":["Iron","Potassium"]}'::jsonb,
 ARRAY['High protein','Easy to digest'], ARRAY['high-protein','high-fiber','organic']);

-- Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_value, is_active, valid_until) VALUES
('WELCOME10', '10% off on first order', 'percentage', 10, 200, true, NOW() + INTERVAL '1 year'),
('FRESH50', 'Rs.50 off on orders above Rs.500', 'fixed', 50, 500, true, NOW() + INTERVAL '6 months'),
('ORGANIC15', '15% off on organic products', 'percentage', 15, 300, true, NOW() + INTERVAL '3 months');

-- Banners
INSERT INTO public.banners (title, subtitle, image_url, link_url, display_order, is_active) VALUES
('Fresh From Farm', 'Get 20% off on your first order', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200', '/products', 1, true),
('Organic Products', 'Pure and chemical-free produce', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200', '/products', 2, true),
('Seasonal Fruits', 'Fresh mangoes now available!', 'https://images.unsplash.com/photo-1553279768-865329ba8f96?w=1200', '/products', 3, true);

-- =====================================================
-- DONE! Database ready.
-- To make yourself admin: UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
-- =====================================================
