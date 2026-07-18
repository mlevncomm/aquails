export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          role: UserRole;
          loyalty_points: number;
          loyalty_redeemed: number;
          referral_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          phone?: string | null;
          role?: UserRole;
          loyalty_points?: number;
          loyalty_redeemed?: number;
          referral_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          role?: UserRole;
          loyalty_points?: number;
          loyalty_redeemed?: number;
          referral_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          sku: string;
          description: string;
          short_description: string;
          price: number;
          old_price: number | null;
          stock: number;
          rating: number;
          review_count: number;
          features: string[];
          specifications: Record<string, string>;
          badge: 'discount' | 'premium' | 'new' | null;
          discount_percent: number | null;
          tax_rate: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          sku: string;
          description?: string;
          short_description?: string;
          price: number;
          old_price?: number | null;
          stock?: number;
          rating?: number;
          review_count?: number;
          features?: string[];
          specifications?: Record<string, string>;
          badge?: 'discount' | 'premium' | 'new' | null;
          discount_percent?: number | null;
          tax_rate?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          sku?: string;
          description?: string;
          short_description?: string;
          price?: number;
          old_price?: number | null;
          stock?: number;
          rating?: number;
          review_count?: number;
          features?: string[];
          specifications?: Record<string, string>;
          badge?: 'discount' | 'premium' | 'new' | null;
          discount_percent?: number | null;
          tax_rate?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_slots: {
        Row: {
          id: string;
          slot_date: string;
          slot_time: string;
          capacity: number;
          booked: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slot_date: string;
          slot_time: string;
          capacity?: number;
          booked?: number;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slot_date?: string;
          slot_time?: string;
          capacity?: number;
          booked?: number;
          is_available?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: string;
          subtotal: number;
          shipping_cost: number;
          discount: number;
          total: number;
          payment_method: string | null;
          payment_status: string;
          shipping_address: Record<string, unknown>;
          billing_address: Record<string, unknown>;
          installation_slot: string | null;
          notes: string | null;
          cargo_company: string | null;
          tracking_number: string | null;
          cod_fee: number;
          coupon_code: string | null;
          service_slot_id: string | null;
          stock_reserved: boolean;
          stock_released: boolean;
          coupon_released: boolean;
          service_slot_released: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: string;
          subtotal?: number;
          shipping_cost?: number;
          discount?: number;
          total?: number;
          payment_method?: string | null;
          payment_status?: string;
          shipping_address?: Record<string, unknown>;
          billing_address?: Record<string, unknown>;
          installation_slot?: string | null;
          notes?: string | null;
          cargo_company?: string | null;
          tracking_number?: string | null;
          cod_fee?: number;
          coupon_code?: string | null;
          service_slot_id?: string | null;
          stock_reserved?: boolean;
          stock_released?: boolean;
          coupon_released?: boolean;
          service_slot_released?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: string;
          subtotal?: number;
          shipping_cost?: number;
          discount?: number;
          total?: number;
          payment_method?: string | null;
          payment_status?: string;
          shipping_address?: Record<string, unknown>;
          billing_address?: Record<string, unknown>;
          installation_slot?: string | null;
          notes?: string | null;
          cargo_company?: string | null;
          tracking_number?: string | null;
          cod_fee?: number;
          coupon_code?: string | null;
          service_slot_id?: string | null;
          stock_reserved?: boolean;
          stock_released?: boolean;
          coupon_released?: boolean;
          service_slot_released?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: 'percentage' | 'fixed' | 'shipping';
          value: number;
          min_order_amount: number | null;
          max_discount: number | null;
          usage_limit: number;
          usage_count: number;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: 'percentage' | 'fixed' | 'shipping';
          value?: number;
          min_order_amount?: number | null;
          max_discount?: number | null;
          usage_limit?: number;
          usage_count?: number;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: 'percentage' | 'fixed' | 'shipping';
          value?: number;
          min_order_amount?: number | null;
          max_discount?: number | null;
          usage_limit?: number;
          usage_count?: number;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_questions: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          customer_name: string;
          question: string;
          answer: string | null;
          is_published: boolean;
          answered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          customer_name?: string;
          question: string;
          answer?: string | null;
          is_published?: boolean;
          answered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string | null;
          customer_name?: string;
          question?: string;
          answer?: string | null;
          is_published?: boolean;
          answered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          rating: number;
          title: string;
          content: string;
          is_published: boolean;
          helpful: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          rating: number;
          title?: string;
          content?: string;
          is_published?: boolean;
          helpful?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string | null;
          rating?: number;
          title?: string;
          content?: string;
          is_published?: boolean;
          helpful?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_requests: {
        Row: {
          id: string;
          user_id: string;
          type: 'installation' | 'filter_change' | 'maintenance' | 'repair';
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          address: string;
          preferred_date: string | null;
          description: string;
          assigned_to: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'installation' | 'filter_change' | 'maintenance' | 'repair';
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          address: string;
          preferred_date?: string | null;
          description?: string;
          assigned_to?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'installation' | 'filter_change' | 'maintenance' | 'repair';
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          address?: string;
          preferred_date?: string | null;
          description?: string;
          assigned_to?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      abandoned_carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          customer_name: string;
          customer_email: string | null;
          items: unknown[];
          total: number;
          status: 'new' | 'reminder-sent' | 'converted';
          last_activity: string;
          reminder_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          customer_name?: string;
          customer_email?: string | null;
          items?: unknown[];
          total?: number;
          status?: 'new' | 'reminder-sent' | 'converted';
          last_activity?: string;
          reminder_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          customer_name?: string;
          customer_email?: string | null;
          items?: unknown[];
          total?: number;
          status?: 'new' | 'reminder-sent' | 'converted';
          last_activity?: string;
          reminder_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: 'shipping' | 'billing';
          city: string;
          district: string;
          full_address: string;
          postal_code: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          type: 'shipping' | 'billing';
          city: string;
          district: string;
          full_address: string;
          postal_code?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: 'shipping' | 'billing';
          city?: string;
          district?: string;
          full_address?: string;
          postal_code?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string;
          content: string;
          status: 'draft' | 'published';
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category?: string;
          content?: string;
          status?: 'draft' | 'published';
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string;
          content?: string;
          status?: 'draft' | 'published';
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          device_name: string;
          next_delivery: string | null;
          price: number;
          status: 'active' | 'paused' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: string;
          device_name?: string;
          next_delivery?: string | null;
          price?: number;
          status?: 'active' | 'paused' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          device_name?: string;
          next_delivery?: string | null;
          price?: number;
          status?: 'active' | 'paused' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stock_notifications: {
        Row: {
          id: string;
          product_id: string | null;
          product_name: string;
          email: string;
          notified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          product_name: string;
          email: string;
          notified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          product_name?: string;
          email?: string;
          notified?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Record<string, unknown>;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Record<string, unknown>;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Record<string, unknown>;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          subject: string;
          message: string;
          status: 'new' | 'read' | 'replied' | 'archived';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          subject?: string;
          message: string;
          status?: 'new' | 'read' | 'replied' | 'archived';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          subject?: string;
          message?: string;
          status?: 'new' | 'read' | 'replied' | 'archived';
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message?: string;
          type?: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      user_favorites: {
        Row: { id: string; user_id: string; product_id: string; created_at: string };
        Insert: { id?: string; user_id: string; product_id: string; created_at?: string };
        Update: { id?: string; user_id?: string; product_id?: string; created_at?: string };
        Relationships: [];
      };
      return_requests: {
        Row: {
          id: string;
          user_id: string;
          order_id: string | null;
          order_number: string;
          product_name: string;
          type: string;
          reason: string;
          status: string;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_id?: string | null;
          order_number?: string;
          product_name?: string;
          type?: string;
          reason?: string;
          status?: string;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_id?: string | null;
          order_number?: string;
          product_name?: string;
          type?: string;
          reason?: string;
          status?: string;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      filter_tracking: {
        Row: {
          id: string;
          user_id: string;
          device_name: string;
          filter_name: string;
          installed_at: string;
          change_interval_days: number;
          reminder_enabled: boolean;
          last_changed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_name?: string;
          filter_name?: string;
          installed_at?: string;
          change_interval_days?: number;
          reminder_enabled?: boolean;
          last_changed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_name?: string;
          filter_name?: string;
          installed_at?: string;
          change_interval_days?: number;
          reminder_enabled?: boolean;
          last_changed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      loyalty_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_email: string;
          referred_user_id: string | null;
          status: string;
          reward_points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referred_email?: string;
          referred_user_id?: string | null;
          status?: string;
          reward_points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referred_email?: string;
          referred_user_id?: string | null;
          status?: string;
          reward_points?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_checkout_order: {
        Args: {
          p_items: Record<string, unknown>[];
          p_shipping_address: Record<string, unknown>;
          p_billing_address: Record<string, unknown>;
          p_payment_method: string;
          p_shipping_method: string;
          p_coupon_code?: string | null;
          p_notes?: string | null;
          p_service_slot_id?: string | null;
        };
        Returns: Record<string, unknown>;
      };
      cancel_my_order: {
        Args: { p_order_id: string };
        Returns: Record<string, unknown>;
      };
      create_my_subscription: {
        Args: { p_plan: string; p_device_name: string };
        Returns: Record<string, unknown>;
      };
      set_my_subscription_status: {
        Args: { p_subscription_id: string; p_status: string };
        Returns: Record<string, unknown>;
      };
      sync_abandoned_cart: {
        Args: {
          p_session_id: string;
          p_customer_name: string;
          p_customer_email: string | null;
          p_items: Record<string, unknown>[];
        };
        Returns: undefined;
      };
      subscribe_stock_notification: {
        Args: { p_product_id: string; p_email: string };
        Returns: Record<string, unknown>;
      };
      queue_abandoned_cart_reminder: {
        Args: { p_cart_id: string };
        Returns: Record<string, unknown>;
      };
      queue_stock_notification: {
        Args: { p_notification_id: string };
        Returns: Record<string, unknown>;
      };
      submit_contact_message: {
        Args: { p_name: string; p_email: string; p_phone: string; p_subject: string; p_message: string };
        Returns: Record<string, unknown>;
      };
      mark_abandoned_cart_converted: {
        Args: { p_session_id: string };
        Returns: undefined;
      };
      confirm_order_fulfillment: {
        Args: { p_order_id: string };
        Returns: undefined;
      };
      increment_coupon_usage: {
        Args: { p_code: string };
        Returns: undefined;
      };
      paytr_prepare_payment: {
        Args: {
          p_order_id: string;
          p_order_number: string;
          p_email: string;
          p_user_ip: string;
          p_payment_amount: number;
          p_user_basket_b64: string;
        };
        Returns: Record<string, unknown>;
      };
      paytr_handle_webhook: {
        Args: {
          p_merchant_oid: string;
          p_status: string;
          p_total_amount: string;
          p_hash: string;
        };
        Returns: string;
      };
      finalize_paytr_payment: {
        Args: { p_merchant_oid: string; p_status: string; p_total_amount: string };
        Returns: string;
      };
      redeem_loyalty_points: {
        Args: { p_points: number };
        Returns: Record<string, unknown>;
      };
      bulk_update_product_prices: {
        Args: { p_category_slug: string; p_mode: string; p_value: number };
        Returns: number;
      };
      track_order_by_number_and_contact: {
        Args: { p_order_number: string; p_email_or_phone: string };
        Returns: Record<string, unknown> | null;
      };
      ensure_referral_code: {
        Args: Record<string, never>;
        Returns: string;
      };
      track_referral_signup: {
        Args: { p_referral_code: string };
        Returns: Record<string, unknown>;
      };
      admin_confirm_offline_payment: {
        Args: { p_order_id: string };
        Returns: Record<string, unknown>;
      };
      book_service_slot: {
        Args: { p_slot_id: string };
        Returns: Record<string, unknown>;
      };
      ensure_service_slots: {
        Args: { p_days_ahead?: number };
        Returns: undefined;
      };
      sync_user_cart: {
        Args: { p_items: unknown };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type DbProduct = Database['public']['Tables']['products']['Row'];
export type DbCategory = Database['public']['Tables']['categories']['Row'];
export type DbProductImage = Database['public']['Tables']['product_images']['Row'];
export type DbOrder = Database['public']['Tables']['orders']['Row'];
export type DbOrderItem = Database['public']['Tables']['order_items']['Row'];
export type DbCoupon = Database['public']['Tables']['coupons']['Row'];
export type DbReview = Database['public']['Tables']['reviews']['Row'];
export type DbServiceRequest = Database['public']['Tables']['service_requests']['Row'];
export type DbAbandonedCart = Database['public']['Tables']['abandoned_carts']['Row'];
export type DbAddress = Database['public']['Tables']['addresses']['Row'];
export type DbBlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type DbSubscription = Database['public']['Tables']['subscriptions']['Row'];
export type DbStockNotification = Database['public']['Tables']['stock_notifications']['Row'];
export type DbContactMessage = Database['public']['Tables']['contact_messages']['Row'];
