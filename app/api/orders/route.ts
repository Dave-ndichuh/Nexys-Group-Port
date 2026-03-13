import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrder, updateProductStock, getProduct, createFulfillment } from '@/lib/db';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      totalAmount,
      shippingAddress,
      items,
    } = await request.json();

    // Validate stock for all items
    for (const item of items) {
      const product = await getProduct(item.product_id);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Product ${item.product_id} is out of stock` },
          { status: 400 }
        );
      }
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const order = await createOrder(
      orderNumber,
      email,
      totalAmount,
      shippingAddress,
      items
    );

    // Update product stock
    for (const item of items) {
      const product = await getProduct(item.product_id);
      if (product) {
        await updateProductStock(item.product_id, product.stock - item.quantity);
      }
    }

    // Create fulfillment record
    await createFulfillment(order.id);

    return NextResponse.json(
      {
        success: true,
        order_number: order.order_number,
        order_id: order.id,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const orderNumber = request.nextUrl.searchParams.get('order_number');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'order_number parameter required' },
        { status: 400 }
      );
    }

    const order = await getOrder(orderNumber);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('[v0] Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
