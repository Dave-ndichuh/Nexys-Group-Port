import os
import sys
from supabase import create_client, Client

supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    print('[v0] Missing Supabase environment variables')
    sys.exit(1)

supabase: Client = create_client(supabase_url, supabase_key)

products = [
    {
        'name': 'Nexys Group T-Shirt',
        'price': 24.99,
        'category': 'Apparel',
        'description': 'Premium quality cotton t-shirt with Nexys Group branding',
        'stock': 50,
        'sku': 'NEXYS-TSHIRT-001',
        'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
    },
    {
        'name': 'Nexys Group Hoodie',
        'price': 49.99,
        'category': 'Apparel',
        'description': 'Comfortable fleece-lined hoodie with embroidered logo',
        'stock': 35,
        'sku': 'NEXYS-HOODIE-001',
        'image_url': 'https://images.unsplash.com/photo-1556821552-5d5a1b61ed49?w=500&h=500&fit=crop'
    },
    {
        'name': 'Nexys Group Cap',
        'price': 19.99,
        'category': 'Accessories',
        'description': 'Adjustable baseball cap with curved bill',
        'stock': 75,
        'sku': 'NEXYS-CAP-001',
        'image_url': 'https://images.unsplash.com/photo-1588668214407-6ea32a2fb0d7?w=500&h=500&fit=crop'
    },
    {
        'name': 'Water Bottle',
        'price': 29.99,
        'category': 'Drinkware',
        'description': 'Stainless steel 32oz water bottle with insulation',
        'stock': 60,
        'sku': 'NEXYS-BOTTLE-001',
        'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop'
    },
    {
        'name': 'Laptop Bag',
        'price': 79.99,
        'category': 'Bags',
        'description': 'Professional laptop bag with multiple compartments',
        'stock': 25,
        'sku': 'NEXYS-BAG-001',
        'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
    },
    {
        'name': 'Crew Socks Pack',
        'price': 14.99,
        'category': 'Accessories',
        'description': 'Pack of 3 comfortable crew socks',
        'stock': 100,
        'sku': 'NEXYS-SOCKS-001',
        'image_url': 'https://images.unsplash.com/photo-1554707589-66302db4e981?w=500&h=500&fit=crop'
    },
    {
        'name': 'USB-C Cable',
        'price': 12.99,
        'category': 'Electronics',
        'description': '6ft durable USB-C charging and data cable',
        'stock': 150,
        'sku': 'NEXYS-USB-001',
        'image_url': 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop'
    },
    {
        'name': 'Phone Stand',
        'price': 22.99,
        'category': 'Accessories',
        'description': 'Adjustable aluminum phone stand for desk',
        'stock': 45,
        'sku': 'NEXYS-STAND-001',
        'image_url': 'https://images.unsplash.com/photo-1595687686024-fa735b91c399?w=500&h=500&fit=crop'
    }
]

try:
    print('[v0] Starting to seed products...')
    
    response = supabase.table('products').insert(products).execute()
    
    print('[v0] Successfully seeded', len(response.data), 'products')
    print('[v0] Products created:', response.data)
except Exception as e:
    print('[v0] Error seeding products:', str(e))
    sys.exit(1)
