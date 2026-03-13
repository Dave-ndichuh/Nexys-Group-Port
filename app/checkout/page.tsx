'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { CheckoutForm } from '@/components/CheckoutForm';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { fadeInUp } from '@/components/motionPresets';

export default function CheckoutPage() {
  const { items: cartItems, cartTotal, clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // Restore scroll position after page load
    window.scrollTo(0, 0);
  }, []);

  if (isConfirmed && orderNumber) {
    return (
      <OrderConfirmation
        orderNumber={orderNumber}
        email={cartItems[0]?.product_id || 'customer@example.com'}
        total={cartTotal}
        itemCount={cartItems.length}
        onTrackOrder={() => {
          // This could navigate to an order tracking page
          window.location.href = `/orders/${orderNumber}`;
        }}
      />
    );
  }

  if (cartItems.length === 0 && !orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-slate-950">
        <motion.div
          variants={fadeInUp(10)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-md"
        >
          <ShoppingBag size={48} className="mx-auto mb-4 text-slate-400" />
          <h1 className="text-2xl font-bold text-slate-100 mb-4">Your cart is empty</h1>
          <p className="text-slate-400 mb-8">
            Add some products to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 bg-slate-950 bg-etched relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-slate-900/0 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tl from-amber-600/12 via-amber-500/10 to-slate-900/0 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={fadeInUp(9)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp(10)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">Checkout</h1>
          <p className="text-slate-400">
            Complete your purchase securely. All payments are processed safely.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              items={cartItems}
              total={cartTotal}
              onSuccess={(ordNum) => {
                setOrderNumber(ordNum);
                setIsConfirmed(true);
                clearCart();
              }}
              onError={(error) => {
                console.error('[v0] Checkout error:', error);
              }}
            />
          </div>

          {/* Order Summary */}
          <motion.div
            variants={fadeInUp(11)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 rounded-xl border border-slate-700/70 bg-slate-900/70 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Order Summary</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-start justify-between gap-4 pb-4 border-b border-slate-700/70 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-slate-100">{item.name}</p>
                        <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-100 whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-700/70 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-100">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className="text-slate-100">Calculated</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax</span>
                  <span className="text-slate-100">Calculated</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-slate-700/70 pt-3">
                  <span className="text-slate-100">Total</span>
                  <span className="text-emerald-300">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-400 space-y-2">
                <p>✓ Secure checkout</p>
                <p>✓ Fast shipping</p>
                <p>✓ Money-back guarantee</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
