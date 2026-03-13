'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Package, Clock } from 'lucide-react';
import { fadeInUp } from './motionPresets';
import Link from 'next/link';

interface OrderConfirmationProps {
  orderNumber: string;
  email: string;
  total: number;
  itemCount: number;
  onTrackOrder: () => void;
}

export function OrderConfirmation({
  orderNumber,
  email,
  total,
  itemCount,
  onTrackOrder,
}: OrderConfirmationProps) {
  return (
    <motion.div
      variants={fadeInUp(10)}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
      className="min-h-screen flex items-center justify-center py-20 px-6 bg-slate-950 bg-etched relative overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 left-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-slate-900/0 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tl from-amber-600/12 via-amber-500/10 to-slate-900/0 blur-3xl" />

      <div className="max-w-2xl w-full relative z-10">
        <motion.div
          variants={fadeInUp(11)}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <div className="inline-block mb-6">
            <CheckCircle size={64} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Order Confirmed
          </h1>
          <p className="text-slate-400">
            Thank you for your purchase! Your order has been received and is being processed.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp(12)}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-700/70">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Order Number</p>
              <p className="text-xl font-semibold text-emerald-300">{orderNumber}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Items</p>
              <p className="text-xl font-semibold text-slate-100">{itemCount}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Total</p>
              <p className="text-xl font-semibold text-slate-100">${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-slate-700/70">
              <Clock size={20} className="text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">Order Confirmation</h3>
                <p className="text-sm text-slate-400">
                  A confirmation email has been sent to <span className="text-slate-200 font-medium">{email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-slate-700/70">
              <Package size={20} className="text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">Fulfillment</h3>
                <p className="text-sm text-slate-400">
                  Your order is being prepared for shipment. You'll receive a tracking number via email.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">What's Next?</h3>
                <p className="text-sm text-slate-400">
                  Monitor your order status and track your shipment from your account dashboard.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp(13)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onTrackOrder}
            className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            Track Order
          </button>
          <Link
            href="/"
            className="flex-1 rounded-lg border border-slate-600/60 bg-slate-900/80 px-6 py-3 font-semibold text-slate-100 hover:border-blue-500 hover:text-blue-300 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </motion.div>

        <motion.p
          variants={fadeInUp(14)}
          initial="hidden"
          animate="visible"
          className="text-center text-xs text-slate-500 mt-8"
        >
          Questions? Contact our support team at support@nexysgroup.com
        </motion.p>
      </div>
    </motion.div>
  );
}
