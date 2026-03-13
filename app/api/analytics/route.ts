import { NextRequest, NextResponse } from 'next/server';
import { getDailySalesAnalytics, updateDailyAnalytics } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const startDate = request.nextUrl.searchParams.get('start_date');
    const endDate = request.nextUrl.searchParams.get('end_date');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'start_date and end_date parameters required' },
        { status: 400 }
      );
    }

    const analytics = await getDailySalesAnalytics(startDate, endDate);

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('[v0] Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      date,
      totalSales,
      orderCount,
      avgOrderValue,
      topProducts,
      customerLocations,
    } = await request.json();

    await updateDailyAnalytics(
      date,
      totalSales,
      orderCount,
      avgOrderValue,
      topProducts,
      customerLocations
    );

    return NextResponse.json(
      { success: true, message: 'Analytics updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics' },
      { status: 500 }
    );
  }
}

// Helper endpoint to generate analytics from orders
export async function PATCH(request: NextRequest) {
  try {
    const { date } = await request.json();
    const dateStr = date || new Date().toISOString().split('T')[0];

    // Get all orders for the day
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, created_at')
      .gte('created_at', `${dateStr}T00:00:00`)
      .lt('created_at', `${dateStr}T23:59:59`);

    if (ordersError) throw ordersError;

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: true, message: 'No orders for this date' },
        { status: 200 }
      );
    }

    // Calculate analytics
    const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const orderCount = orders.length;
    const avgOrderValue = totalSales / orderCount;

    // Get top products
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('product_id, quantity')
      .in('order_id', orders.map(o => o.id));

    if (itemsError) throw itemsError;

    const topProducts = orderItems
      ? Object.entries(
          orderItems.reduce((acc: Record<string, number>, item: any) => {
            acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity;
            return acc;
          }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([productId, quantity]) => ({ product_id: productId, quantity }))
      : [];

    // Update analytics
    await updateDailyAnalytics(
      dateStr,
      totalSales,
      orderCount,
      avgOrderValue,
      topProducts,
      {}
    );

    return NextResponse.json(
      { success: true, message: 'Analytics generated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error generating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
