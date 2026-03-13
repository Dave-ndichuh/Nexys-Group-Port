import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase instance (for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase instance (for API routes with service role)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  sku: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  email: string;
  total_amount: number;
  currency: string;
  status: string;
  shipping_address: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface CartSession {
  id: string;
  session_id: string;
  items_json: Array<{
    product_id: string;
    quantity: number;
  }>;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface Fulfillment {
  id: string;
  order_id: string;
  status: string;
  carrier: string;
  tracking_number: string;
  estimated_delivery: string;
  delivered_at: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsRecord {
  id: string;
  date: string;
  total_sales: number;
  order_count: number;
  avg_order_value: number;
  top_products: Array<{ product_id: string; quantity: number }>;
  customer_locations: Record<string, number>;
  created_at: string;
  updated_at: string;
}
