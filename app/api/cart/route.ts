import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCartSession, updateCartItems } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('cart_session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const cart = await getOrCreateCartSession(sessionId);
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('[v0] Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();
    const sessionId = request.cookies.get('cart_session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Cart session not found' },
        { status: 400 }
      );
    }

    await updateCartItems(sessionId, items);
    
    return NextResponse.json(
      { success: true, message: 'Cart updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
