import { NextRequest, NextResponse } from 'next/server';
import { getFulfillment, updateFulfillmentStatus } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'order_id parameter required' },
        { status: 400 }
      );
    }

    const fulfillment = await getFulfillment(orderId);

    if (!fulfillment) {
      return NextResponse.json(
        { error: 'Fulfillment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(fulfillment, { status: 200 });
  } catch (error) {
    console.error('[v0] Error fetching fulfillment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fulfillment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { fulfillment_id, status, tracking_number, carrier } = await request.json();

    await updateFulfillmentStatus(fulfillment_id, status, tracking_number, carrier);

    return NextResponse.json(
      { success: true, message: 'Fulfillment updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error updating fulfillment:', error);
    return NextResponse.json(
      { error: 'Failed to update fulfillment' },
      { status: 500 }
    );
  }
}
