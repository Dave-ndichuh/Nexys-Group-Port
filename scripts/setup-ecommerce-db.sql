-- E-Commerce Platform Database Schema
-- This script creates all tables needed for the Nexys Group Store

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  sku VARCHAR(100) UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_sessions table
CREATE TABLE IF NOT EXISTS cart_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- Create inventory_logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  reason VARCHAR(100) NOT NULL,
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fulfillments table
CREATE TABLE IF NOT EXISTS fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  carrier VARCHAR(50),
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE DEFAULT CURRENT_DATE,
  total_sales DECIMAL(10, 2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  avg_order_value DECIMAL(10, 2) DEFAULT 0,
  top_products JSONB DEFAULT '[]'::jsonb,
  customer_locations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_order_id ON fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_status ON fulfillments(status);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_expires_at ON cart_sessions(expires_at);

-- Insert sample products
INSERT INTO products (name, price, category, description, stock, sku, image_url)
VALUES
  ('Nexys Pro T-Shirt', 29.99, 'Apparel', 'Premium cotton t-shirt with Nexys Group branding', 50, 'NXYS-TSH-001', '/images/tshirt.jpg'),
  ('Nexys Hoodie', 59.99, 'Apparel', 'Comfortable hoodie perfect for any occasion', 30, 'NXYS-HDY-001', '/images/hoodie.jpg'),
  ('Nexys Cap', 19.99, 'Accessories', 'Adjustable cap with embroidered logo', 100, 'NXYS-CAP-001', '/images/cap.jpg'),
  ('Nexys Water Bottle', 24.99, 'Accessories', 'Stainless steel insulated water bottle', 75, 'NXYS-WTR-001', '/images/bottle.jpg'),
  ('Nexys Notebook', 12.99, 'Stationery', 'Premium quality notebook for notes and ideas', 200, 'NXYS-NTB-001', '/images/notebook.jpg')
ON CONFLICT (sku) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Products: Public read-only access
CREATE POLICY "products_read_access" ON products FOR SELECT USING (true);

-- Orders: Can view/update own order by order_number
CREATE POLICY "orders_read_own" ON orders FOR SELECT USING (true);

-- Order Items: Public read access
CREATE POLICY "order_items_read" ON order_items FOR SELECT USING (true);

-- Cart Sessions: Accessible by session_id
CREATE POLICY "cart_sessions_access" ON cart_sessions FOR ALL USING (true);

-- Inventory Logs: Public read
CREATE POLICY "inventory_logs_read" ON inventory_logs FOR SELECT USING (true);

-- Fulfillments: Public read
CREATE POLICY "fulfillments_read" ON fulfillments FOR SELECT USING (true);

-- Analytics: Public read
CREATE POLICY "analytics_read" ON analytics FOR SELECT USING (true);
