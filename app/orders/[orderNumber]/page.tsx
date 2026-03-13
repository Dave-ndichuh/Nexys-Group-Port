'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Home, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { fadeInUp } from '@/components/motionPresets';
import type { Order } from '@/lib/supabase';

interface Fulfillment {
  id: string;
  order_id: string;
  status: string;
  carrier: string;
  tracking_number: string;
  estimated_delivery: string;
  delivered_at: string;
}

const statusSteps = [
  { status: 'pending', label: 'Order Placed', icon: Package },
  { status: 'processing', label: 'Processing', icon: Clock },
  { status: 'shipped', label: 'In Transit', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

function getStatusIndex(status: string): number {
  const index = statusSteps.findIndex(step => step.status === status);
  return index >= 0 ? index : 0;
}

export default function OrderTrackingPage({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [fulfillment, setFulfillment] = useState<Fulfillment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch order
        const orderResponse = await fetch(`/api/orders?order_number=${params.orderNumber}`);
        if (!orderResponse.ok) {
          throw new Error('Order not found');
        }
        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Fetch fulfillment
        const fulfillmentResponse = await fetch(`/api/fulfillments?order_id=${orderData.id}`);
        if (fulfillmentResponse.ok) {
          const fulfillmentData = await fulfillmentResponse.json();
          setFulfillment(fulfillmentData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [params.orderNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-6 bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-20 px-6 bg-slate-950 flex items-center justify-center">
        <motion.div
          variants={fadeInUp(10)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-md"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold text-slate-100 mb-4">Order Not Found</h1>
          <p className="text-slate-400 mb-8">{error || 'Unable to find your order.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const statusIndex = getStatusIndex(fulfillment?.status || 'pending');
  const currentStatus = fulfillment?.status || 'pending';

  return (
    <div className="min-h-screen py-20 px-6 bg-slate-950 bg-etched relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-slate-900/0 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tl from-amber-600/12 via-amber-500/10 to-slate-900/0 blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={fadeInUp(9)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp(10)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            Order #{order.order_number}
          </h1>
          <p className="text-slate-400">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </motion.div>

        {/* Order Status Timeline */}
        <motion.div
          variants={fadeInUp(11)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 rounded-xl border border-slate-700/70 bg-slate-900/70 p-8"
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-8">Tracking</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-10 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-emerald-500 to-slate-700" />

            {/* Timeline steps */}
            <div className="space-y-8">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= statusIndex;
                const isCurrent = index === statusIndex;

                return (
                  <div key={step.status} className="relative pl-20">
                    {/* Status circle */}
                    <div
                      className={`absolute -left-2.5 top-0 h-12 w-12 rounded-full border-4 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      <StepIcon
                        size={20}
                        className={
                          isCompleted ? 'text-emerald-400' : 'text-slate-500'
                        }
                      />
                    </div>

                    {/* Status content */}
                    <div
                      className={`p-4 rounded-lg border transition-all ${
                        isCurrent
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : isCompleted
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-slate-700/50 bg-slate-800/50'
                      }`}
                    >
                      <p className="font-semibold text-slate-100 mb-1">
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-blue-300">
                          Current status
                        </p>
                      )}
                      {isCompleted && !isCurrent && (
                        <p className="text-sm text-emerald-300">
                          Completed
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Shipping Details */}
        {fulfillment && (
          <motion.div
            variants={fadeInUp(12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {fulfillment.tracking_number && (
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Tracking Number
                </h3>
                <p className="text-2xl font-bold text-slate-100 break-all">
                  {fulfillment.tracking_number}
                </p>
                {fulfillment.carrier && (
                  <p className="text-sm text-slate-400 mt-2">
                    Carrier: {fulfillment.carrier}
                  </p>
                )}
              </div>
            )}

            {fulfillment.estimated_delivery && (
              <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Estimated Delivery
                </h3>
                <p className="text-2xl font-bold text-slate-100">
                  {new Date(fulfillment.estimated_delivery).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  {currentStatus === 'delivered' ? 'Delivered' : 'Expected'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Order Summary */}
        <motion.div
          variants={fadeInUp(13)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-8"
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-700/70">
            <div>
              <p className="text-sm text-slate-400 mb-1">Order Total</p>
              <p className="text-2xl font-bold text-emerald-300">
                ${order.total_amount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Email</p>
              <p className="text-slate-100">{order.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-4">Shipping Address</p>
            <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300">
              {order.shipping_address && (
                <>
                  <p>
                    {order.shipping_address.firstName} {order.shipping_address.lastName}
                  </p>
                  <p>{order.shipping_address.address}</p>
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state}{' '}
                    {order.shipping_address.postalCode}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <motion.p
          variants={fadeInUp(14)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-sm text-slate-500 mt-12"
        >
          Have questions? Contact our support team at support@nexysgroup.com
        </motion.p>
      </div>
    </div>
  );
}
