import { NextRequest, NextResponse } from 'next/server';
import { verifyShopifyWebhook, parseShopifyOrder } from '@/lib/shopify';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Shopify Webhook Handler
 * Receives order and fulfillment updates from Shopify
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature
    if (!verifyShopifyWebhook(request, body)) {
      console.error('[v0] Invalid Shopify webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const topic = request.headers.get('x-shopify-topic');

    console.log('[v0] Shopify webhook received:', topic);

    // Handle different webhook topics
    if (topic === 'orders/create' || topic === 'orders/updated') {
      await handleOrderEvent(event);
    } else if (topic === 'fulfillments/create' || topic === 'fulfillments/update') {
      await handleFulfillmentEvent(event);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[v0] Shopify webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

/**
 * Handle Shopify order webhooks
 */
async function handleOrderEvent(order: any) {
  try {
    const parsedOrder = parseShopifyOrder(order);

    // Check if order already exists in database
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('order_number', parsedOrder.orderNumber)
      .single();

    if (existingOrder) {
      // Update existing order
      await supabaseAdmin
        .from('orders')
        .update({
          status: parsedOrder.status,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', parsedOrder.orderNumber);

      console.log('[v0] Updated order:', parsedOrder.orderNumber);
    } else {
      // Create new order from Shopify
      const { data: newOrder, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: parsedOrder.orderNumber,
          email: parsedOrder.email,
          total_amount: parsedOrder.totalAmount,
          status: parsedOrder.status,
          shipping_address: parsedOrder.shippingAddress,
          created_at: parsedOrder.createdAt,
        })
        .select()
        .single();

      if (orderError) {
        console.error('[v0] Failed to create order:', orderError);
        return;
      }

      // Create order items
      if (parsedOrder.lineItems.length > 0) {
        const items = parsedOrder.lineItems.map((item: any) => ({
          order_id: newOrder.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.quantity * item.price,
        }));

        await supabaseAdmin.from('order_items').insert(items);
      }

      // Create fulfillment record
      await supabaseAdmin.from('fulfillments').insert({
        order_id: newOrder.id,
        status: 'pending',
      });

      console.log('[v0] Created order from Shopify:', parsedOrder.orderNumber);
    }
  } catch (error) {
    console.error('[v0] Failed to handle order event:', error);
  }
}

/**
 * Handle Shopify fulfillment webhooks
 */
async function handleFulfillmentEvent(fulfillment: any) {
  try {
    // Find order by Shopify order ID
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('order_number', fulfillment.order_id)
      .limit(1);

    if (!orders || orders.length === 0) {
      console.log('[v0] Order not found for fulfillment:', fulfillment.order_id);
      return;
    }

    const orderId = orders[0].id;

    // Update fulfillment status
    const { data: fulfillments } = await supabaseAdmin
      .from('fulfillments')
      .select('id')
      .eq('order_id', orderId)
      .single();

    if (fulfillments) {
      const trackingInfo = fulfillment.tracking_info || {};
      
      await supabaseAdmin
        .from('fulfillments')
        .update({
          status: fulfillment.status || 'shipped',
          carrier: trackingInfo.company,
          tracking_number: trackingInfo.number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', fulfillments.id);

      console.log('[v0] Updated fulfillment for order:', fulfillment.order_id);
    }
  } catch (error) {
    console.error('[v0] Failed to handle fulfillment event:', error);
  }
}
