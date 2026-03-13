import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const products = await getProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('[v0] Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
