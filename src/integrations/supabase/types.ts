export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type UserRole = 'customer' | 'admin' | 'farmer'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'cod' | 'phonepe' | 'googlepay' | 'card' | 'upi'
export type ProductCategory = 'Vegetables' | 'Fruits' | 'Dairy' | 'Grains' | 'Organic'
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'promo'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: UserRole
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          email_notifications: boolean
          sms_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          email_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          email_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      farmers: {
        Row: {
          id: string
          profile_id: string
          farm_name: string
          farm_description: string | null
          farm_location: string | null
          farm_size: string | null
          certifications: string[] | null
          specialties: string[] | null
          rating: number
          total_reviews: number
          is_verified: boolean
          bank_account_number: string | null
          bank_ifsc: string | null
          gst_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          farm_name: string
          farm_description?: string | null
          farm_location?: string | null
          farm_size?: string | null
          certifications?: string[] | null
          specialties?: string[] | null
          rating?: number
          total_reviews?: number
          is_verified?: boolean
          bank_account_number?: string | null
          bank_ifsc?: string | null
          gst_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          farm_name?: string
          farm_description?: string | null
          farm_location?: string | null
          farm_size?: string | null
          certifications?: string[] | null
          specialties?: string[] | null
          rating?: number
          total_reviews?: number
          is_verified?: boolean
          bank_account_number?: string | null
          bank_ifsc?: string | null
          gst_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_at_price: number | null
          category: ProductCategory
          category_id: string | null
          stock: number
          unit: string
          min_order_qty: number
          max_order_qty: number
          image: string | null
          images: string[] | null
          farmer_id: string | null
          season: string | null
          freshness: string
          shelf_life: string | null
          storage_instructions: string | null
          is_organic: boolean
          is_seasonal: boolean
          is_trending: boolean
          is_featured: boolean
          is_active: boolean
          rating: number
          reviews_count: number
          nutrition: Json
          health_benefits: string[] | null
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          category: ProductCategory
          category_id?: string | null
          stock?: number
          unit?: string
          min_order_qty?: number
          max_order_qty?: number
          image?: string | null
          images?: string[] | null
          farmer_id?: string | null
          season?: string | null
          freshness?: string
          shelf_life?: string | null
          storage_instructions?: string | null
          is_organic?: boolean
          is_seasonal?: boolean
          is_trending?: boolean
          is_featured?: boolean
          is_active?: boolean
          rating?: number
          reviews_count?: number
          nutrition?: Json
          health_benefits?: string[] | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          category?: ProductCategory
          category_id?: string | null
          stock?: number
          unit?: string
          min_order_qty?: number
          max_order_qty?: number
          image?: string | null
          images?: string[] | null
          farmer_id?: string | null
          season?: string | null
          freshness?: string
          shelf_life?: string | null
          storage_instructions?: string | null
          is_organic?: boolean
          is_seasonal?: boolean
          is_trending?: boolean
          is_featured?: boolean
          is_active?: boolean
          rating?: number
          reviews_count?: number
          nutrition?: Json
          health_benefits?: string[] | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          subtotal: number
          discount_amount: number
          delivery_fee: number
          tax_amount: number
          total_amount: number
          status: OrderStatus
          payment_method: PaymentMethod
          payment_status: PaymentStatus
          payment_id: string | null
          shipping_name: string
          shipping_phone: string
          shipping_email: string | null
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_zip_code: string
          shipping_country: string | null
          estimated_delivery: string | null
          delivered_at: string | null
          notes: string | null
          coupon_code: string | null
          tracking_number: string | null
          tracking_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id: string
          subtotal: number
          discount_amount?: number
          delivery_fee?: number
          tax_amount?: number
          total_amount: number
          status?: OrderStatus
          payment_method: PaymentMethod
          payment_status?: PaymentStatus
          payment_id?: string | null
          shipping_name: string
          shipping_phone: string
          shipping_email?: string | null
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_zip_code: string
          shipping_country?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          notes?: string | null
          coupon_code?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          subtotal?: number
          discount_amount?: number
          delivery_fee?: number
          tax_amount?: number
          total_amount?: number
          status?: OrderStatus
          payment_method?: PaymentMethod
          payment_status?: PaymentStatus
          payment_id?: string | null
          shipping_name?: string
          shipping_phone?: string
          shipping_email?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_state?: string
          shipping_zip_code?: string
          shipping_country?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          notes?: string | null
          coupon_code?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_image: string | null
          product_price: number
          product_unit: string
          quantity: number
          total_price: number
          farmer_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_image?: string | null
          product_price: number
          product_unit: string
          quantity: number
          total_price: number
          farmer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_image?: string | null
          product_price?: number
          product_unit?: string
          quantity?: number
          total_price?: number
          farmer_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_id: string | null
          rating: number
          title: string | null
          comment: string | null
          images: string[] | null
          is_verified_purchase: boolean
          is_approved: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          order_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          images?: string[] | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          images?: string[] | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          max_discount: number | null
          min_order_value: number
          usage_limit: number | null
          usage_count: number
          per_user_limit: number
          is_active: boolean
          valid_from: string
          valid_until: string | null
          applicable_categories: ProductCategory[] | null
          excluded_products: string[] | null
          first_order_only: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          max_discount?: number | null
          min_order_value?: number
          usage_limit?: number | null
          usage_count?: number
          per_user_limit?: number
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          applicable_categories?: ProductCategory[] | null
          excluded_products?: string[] | null
          first_order_only?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          max_discount?: number | null
          min_order_value?: number
          usage_limit?: number | null
          usage_count?: number
          per_user_limit?: number
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          applicable_categories?: ProductCategory[] | null
          excluded_products?: string[] | null
          first_order_only?: boolean
          created_at?: string
        }
        Relationships: []
      }
      coupon_usage: {
        Row: {
          id: string
          coupon_id: string
          user_id: string
          order_id: string
          discount_applied: number
          used_at: string
        }
        Insert: {
          id?: string
          coupon_id: string
          user_id: string
          order_id: string
          discount_applied: number
          used_at?: string
        }
        Update: {
          id?: string
          coupon_id?: string
          user_id?: string
          order_id?: string
          discount_applied?: number
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          recipient_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          zip_code: string
          country: string | null
          landmark: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string
          recipient_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          zip_code: string
          country?: string | null
          landmark?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          recipient_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          zip_code?: string
          country?: string | null
          landmark?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: NotificationType
          action_url: string | null
          action_text: string | null
          image_url: string | null
          is_read: boolean
          is_active: boolean
          scheduled_for: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type?: NotificationType
          action_url?: string | null
          action_text?: string | null
          image_url?: string | null
          is_read?: boolean
          is_active?: boolean
          scheduled_for?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: NotificationType
          action_url?: string | null
          action_text?: string | null
          image_url?: string | null
          is_read?: boolean
          is_active?: boolean
          scheduled_for?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          is_read: boolean
          is_resolved: boolean
          resolved_by: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          is_read?: boolean
          is_resolved?: boolean
          resolved_by?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          is_read?: boolean
          is_resolved?: boolean
          resolved_by?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: OrderStatus
          notes: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: OrderStatus
          notes?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: OrderStatus
          notes?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      banners: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image_url: string
          mobile_image_url: string | null
          link_url: string | null
          link_text: string | null
          display_order: number
          is_active: boolean
          valid_from: string
          valid_until: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          image_url: string
          mobile_image_url?: string | null
          link_url?: string | null
          link_text?: string | null
          display_order?: number
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          image_url?: string
          mobile_image_url?: string | null
          link_url?: string | null
          link_text?: string | null
          display_order?: number
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      order_details: {
        Row: {
          id: string
          order_number: string
          user_id: string
          subtotal: number
          discount_amount: number
          delivery_fee: number
          tax_amount: number
          total_amount: number
          status: OrderStatus
          payment_method: PaymentMethod
          payment_status: PaymentStatus
          shipping_name: string
          shipping_phone: string
          shipping_email: string | null
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_zip_code: string
          created_at: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          items: Json
        }
      }
      product_listing: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          category: ProductCategory
          stock: number
          unit: string
          image: string | null
          is_organic: boolean
          is_seasonal: boolean
          is_trending: boolean
          is_featured: boolean
          rating: number
          reviews_count: number
          nutrition: Json
          health_benefits: string[] | null
          tags: string[] | null
          farm_name: string | null
          farmer_verified: boolean | null
          farmer_rating: number | null
        }
      }
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_farmer: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      payment_status: PaymentStatus
      payment_method: PaymentMethod
      product_category: ProductCategory
      notification_type: NotificationType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier access
type DefaultSchema = Database["public"]

export type Tables<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Row"]

export type TablesInsert<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Insert"]

export type TablesUpdate<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Update"]

export type Enums<
  EnumName extends keyof DefaultSchema["Enums"]
> = DefaultSchema["Enums"][EnumName]

// Commonly used type exports
export type Profile = Tables<'profiles'>
export type Product = Tables<'products'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type CartItem = Tables<'cart_items'>
export type Review = Tables<'reviews'>
export type Category = Tables<'categories'>
export type Farmer = Tables<'farmers'>
export type Address = Tables<'addresses'>
export type Notification = Tables<'notifications'>
export type Coupon = Tables<'coupons'>
export type Banner = Tables<'banners'>
export type ContactMessage = Tables<'contact_messages'>
export type WishlistItem = Tables<'wishlist'>

// Nutrition type from JSON
export interface Nutrition {
  calories: number
  protein: number
  carbohydrates: number
  fiber: number
  fat: number
  vitamins: string[]
  minerals: string[]
}
