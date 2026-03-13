import { useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export function useCart() {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart_items', []);
  const [sessionId, setSessionId] = useLocalStorage<string>('cart_session_id', '');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      setSessionId(newSessionId);
    }
  }, []);

  const addItem = useCallback(async (product: any) => {
    const existingItem = items.find(item => item.product_id === product.id);
    let newItems: CartItem[];

    if (existingItem) {
      newItems = items.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...items, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
      }];
    }

    setItems(newItems);
    await syncCart(newItems);
  }, [items]);

  const removeItem = useCallback(async (productId: string) => {
    const newItems = items.filter(item => item.product_id !== productId);
    setItems(newItems);
    await syncCart(newItems);
  }, [items]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    const newItems = items.map(item =>
      item.product_id === productId
        ? { ...item, quantity }
        : item
    );
    setItems(newItems);
    await syncCart(newItems);
  }, [items, removeItem]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (sessionId) {
      await syncCart([]);
    }
  }, [sessionId]);

  const syncCart = async (cartItems: CartItem[]) => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      });
    } catch (error) {
      console.error('[v0] Failed to sync cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    sessionId,
    isLoading,
  };
}
