// Shopify Storefront API Integration
// This module handles payment processing through Shopify's Storefront API

const SHOPIFY_STORE_NAME = process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME || '';
const SHOPIFY_API_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '';
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

const API_ENDPOINT = `https://${SHOPIFY_STORE_NAME}.myshopify.com/api/2024-01/graphql.json`;

export interface ShopifyCheckoutInput {
  lineItems: Array<{
    variantId: string;
    quantity: number;
  }>;
  email: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
}

export interface ShopifyCheckoutData {
  id: string;
  webUrl: string;
  completedAt: string | null;
  orderStatusUrl: string | null;
}

/**
 * Create a checkout on Shopify
 */
export async function createShopifyCheckout(
  input: ShopifyCheckoutInput
): Promise<ShopifyCheckoutData> {
  const mutation = `
    mutation CreateCheckout($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          completedAt
          orderStatusUrl
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: input.lineItems,
      email: input.email,
      shippingAddress: input.shippingAddress,
    },
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_API_KEY,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(`Shopify GraphQL error: ${errors[0].message}`);
    }

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(
        `Checkout error: ${data.checkoutCreate.checkoutUserErrors[0].message}`
      );
    }

    return data.checkoutCreate.checkout;
  } catch (error) {
    console.error('[v0] Shopify checkout error:', error);
    throw error;
  }
}

/**
 * Get checkout details from Shopify
 */
export async function getShopifyCheckout(checkoutId: string): Promise<any> {
  const query = `
    query GetCheckout($id: ID!) {
      checkout(id: $id) {
        id
        webUrl
        completedAt
        orderStatusUrl
        email
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_API_KEY,
      },
      body: JSON.stringify({ query, variables: { id: checkoutId } }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(`Shopify GraphQL error: ${errors[0].message}`);
    }

    return data.checkout;
  } catch (error) {
    console.error('[v0] Failed to get checkout:', error);
    throw error;
  }
}

/**
 * Verify Shopify webhook signature
 */
export function verifyShopifyWebhook(
  request: Request,
  body: string
): boolean {
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
  if (!hmacHeader || !SHOPIFY_WEBHOOK_SECRET) {
    return false;
  }

  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmacHeader;
}

/**
 * Parse Shopify order webhook
 */
export function parseShopifyOrder(data: any) {
  return {
    orderId: data.id,
    orderNumber: data.order_number,
    email: data.email,
    totalAmount: parseFloat(data.total_price),
    status: data.fulfillment_status || 'pending',
    lineItems: data.line_items?.map((item: any) => ({
      productId: item.product_id,
      variantId: item.variant_id,
      title: item.title,
      quantity: item.quantity,
      price: parseFloat(item.price),
    })) || [],
    shippingAddress: data.shipping_address
      ? {
          firstName: data.shipping_address.first_name,
          lastName: data.shipping_address.last_name,
          address: data.shipping_address.address1,
          city: data.shipping_address.city,
          state: data.shipping_address.province,
          postalCode: data.shipping_address.zip,
          country: data.shipping_address.country,
        }
      : null,
    createdAt: data.created_at,
  };
}
