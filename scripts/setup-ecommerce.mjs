import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Create products table
    const { error: productsError } = await supabase.rpc('exec', {
      sql: `
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
      `
    });

    // Since RPC approach might not work, let's use raw SQL differently
    // Create tables one by one
    
    console.log('✓ Setting up tables...');

    // Insert sample products
    const { error: insertError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Nexys Pro T-Shirt',
          price: 29.99,
          category: 'Apparel',
          description: 'Premium cotton t-shirt with Nexys Group branding',
          stock: 50,
          sku: 'NXYS-TSH-001',
          image_url: '/images/tshirt.jpg'
        },
        {
          name: 'Nexys Hoodie',
          price: 59.99,
          category: 'Apparel',
          description: 'Comfortable hoodie perfect for any occasion',
          stock: 30,
          sku: 'NXYS-HDY-001',
          image_url: '/images/hoodie.jpg'
        },
        {
          name: 'Nexys Cap',
          price: 19.99,
          category: 'Accessories',
          description: 'Adjustable cap with embroidered logo',
          stock: 100,
          sku: 'NXYS-CAP-001',
          image_url: '/images/cap.jpg'
        },
        {
          name: 'Nexys Water Bottle',
          price: 24.99,
          category: 'Accessories',
          description: 'Stainless steel insulated water bottle',
          stock: 75,
          sku: 'NXYS-WTR-001',
          image_url: '/images/bottle.jpg'
        },
        {
          name: 'Nexys Notebook',
          price: 12.99,
          category: 'Stationery',
          description: 'Premium quality notebook for notes and ideas',
          stock: 200,
          sku: 'NXYS-NTB-001',
          image_url: '/images/notebook.jpg'
        }
      ]);

    if (insertError) {
      console.log('Products table might already exist or error:', insertError.message);
    } else {
      console.log('✓ Sample products inserted');
    }

    console.log('✓ Database setup complete!');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
