import { supabaseAdmin, supabase } from './supabase';
import type { Product, Order, OrderItem, CartSession, Fulfillment, AnalyticsRecord } from './supabase';

// Product operations
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateProductStock(productId: string, newStock: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ stock: newStock, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) throw error;
}

// Order operations
export async function createOrder(
  orderNumber: string,
  email: string,
  totalAmount: number,
  shippingAddress: Record<string, any>,
  items: Array<{ product_id: string; quantity: number; unit_price: number; subtotal: number }>
): Promise<Order> {
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      email,
      total_amount: totalAmount,
      currency: 'USD',
      status: 'pending',
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: orderData.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // Log inventory changes
  for (const item of items) {
    await supabaseAdmin.from('inventory_logs').insert({
      product_id: item.product_id,
      quantity_change: -item.quantity,
      reason: 'order',
      order_id: orderData.id,
    });
  }

  return orderData;
}

export async function getOrder(orderNumber: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) throw error;
}

// Cart operations
export async function getOrCreateCartSession(sessionId: string): Promise<CartSession> {
  const { data: existing } = await supabase
    .from('cart_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (existing) return existing;

  const { data: newCart, error } = await supabaseAdmin
    .from('cart_sessions')
    .insert({
      session_id: sessionId,
      items_json: [],
    })
    .select()
    .single();

  if (error) throw error;
  return newCart;
}

export async function updateCartItems(sessionId: string, items: any[]): Promise<void> {
  const { error } = await supabaseAdmin
    .from('cart_sessions')
    .update({ items_json: items, updated_at: new Date().toISOString() })
    .eq('session_id', sessionId);

  if (error) throw error;
}

// Fulfillment operations
export async function createFulfillment(orderId: string): Promise<Fulfillment> {
  const { data, error } = await supabaseAdmin
    .from('fulfillments')
    .insert({
      order_id: orderId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFulfillment(orderId: string): Promise<Fulfillment | null> {
  const { data, error } = await supabase
    .from('fulfillments')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateFulfillmentStatus(
  fulfillmentId: string,
  status: string,
  trackingNumber?: string,
  carrier?: string
): Promise<void> {
  const updates: any = { status, updated_at: new Date().toISOString() };
  if (trackingNumber) updates.tracking_number = trackingNumber;
  if (carrier) updates.carrier = carrier;

  const { error } = await supabaseAdmin
    .from('fulfillments')
    .update(updates)
    .eq('id', fulfillmentId);

  if (error) throw error;
}

// Analytics operations
export async function getDailySalesAnalytics(startDate: string, endDate: string): Promise<AnalyticsRecord[]> {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateDailyAnalytics(
  date: string,
  totalSales: number,
  orderCount: number,
  avgOrderValue: number,
  topProducts: any[],
  customerLocations: Record<string, number>
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('analytics')
    .upsert(
      {
        date,
        total_sales: totalSales,
        order_count: orderCount,
        avg_order_value: avgOrderValue,
        top_products: topProducts,
        customer_locations: customerLocations,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'date' }
    );

  if (error) throw error;
}
