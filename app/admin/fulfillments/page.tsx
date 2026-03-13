'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';
import { fadeInUp } from '@/components/motionPresets';
import { supabase } from '@/lib/supabase';

interface FulfillmentData {
  id: string;
  order_id: string;
  status: string;
  carrier: string;
  tracking_number: string;
  estimated_delivery: string;
  delivered_at: string;
  created_at: string;
  order?: {
    order_number: string;
    email: string;
    total_amount: number;
  };
}

export default function AdminFulfillmentsPage() {
  const [fulfillments, setFulfillments] = useState<FulfillmentData[]>([]);
  const [filteredFulfillments, setFilteredFulfillments] = useState<FulfillmentData[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    carrier: '',
    tracking_number: '',
    estimated_delivery: '',
  });

  useEffect(() => {
    const fetchFulfillments = async () => {
      try {
        setIsLoading(true);

        // Fetch fulfillments with order details
        const { data: fulfillmentsData, error: err } = await supabase
          .from('fulfillments')
          .select(`
            *,
            orders (
              order_number,
              email,
              total_amount
            )
          `)
          .order('created_at', { ascending: false });

        if (err) throw err;

        const mapped = fulfillmentsData?.map(f => ({
          ...f,
          order: f.orders,
        })) || [];

        setFulfillments(mapped);
        setFilteredFulfillments(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load fulfillments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFulfillments();
  }, []);

  // Filter fulfillments
  useEffect(() => {
    let filtered = fulfillments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(f => f.status === statusFilter);
    }

    setFilteredFulfillments(filtered);
  }, [fulfillments, statusFilter]);

  const handleEditStart = (fulfillment: FulfillmentData) => {
    setEditingId(fulfillment.id);
    setEditForm({
      status: fulfillment.status || '',
      carrier: fulfillment.carrier || '',
      tracking_number: fulfillment.tracking_number || '',
      estimated_delivery: fulfillment.estimated_delivery || '',
    });
  };

  const handleEditSave = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('fulfillments')
        .update({
          ...editForm,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (err) throw err;

      // Update local state
      setFulfillments(fulfillments.map(f =>
        f.id === id ? { ...f, ...editForm } : f
      ));
      setEditingId(null);
    } catch (err) {
      console.error('[v0] Failed to update fulfillment:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'processing':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'pending':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={18} />;
      case 'shipped':
        return <Truck size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminNav />

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
            variants={fadeInUp(9)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Fulfillments</h1>
            <p className="text-slate-400">
              Track and manage order shipments and delivery status
            </p>
          </motion.div>

          {/* Status Filter */}
          <motion.div
            variants={fadeInUp(10)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-4 flex-wrap"
          >
            {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                    : 'bg-slate-800/50 border border-slate-600/50 text-slate-400 hover:text-slate-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Fulfillments Table */}
          <motion.div
            variants={fadeInUp(11)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-lg border border-slate-700/70 bg-slate-900/70 overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-slate-400">Loading fulfillments...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">{error}</div>
            ) : filteredFulfillments.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                No fulfillments found
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {filteredFulfillments.map((fulfillment) => (
                  <div
                    key={fulfillment.id}
                    className="p-6 hover:bg-slate-800/50 transition-colors"
                  >
                    {editingId === fulfillment.id ? (
                      // Edit mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Status
                            </label>
                            <select
                              value={editForm.status}
                              onChange={(e) =>
                                setEditForm({ ...editForm, status: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-600/60 bg-slate-800/60 text-slate-100 focus:border-blue-500 focus:outline-none"
                            >
                              <option>pending</option>
                              <option>processing</option>
                              <option>shipped</option>
                              <option>delivered</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Carrier
                            </label>
                            <input
                              type="text"
                              value={editForm.carrier}
                              onChange={(e) =>
                                setEditForm({ ...editForm, carrier: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-600/60 bg-slate-800/60 text-slate-100 focus:border-blue-500 focus:outline-none"
                              placeholder="e.g., FedEx, UPS"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Tracking Number
                            </label>
                            <input
                              type="text"
                              value={editForm.tracking_number}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  tracking_number: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-600/60 bg-slate-800/60 text-slate-100 focus:border-blue-500 focus:outline-none"
                              placeholder="Tracking #"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                              Est. Delivery
                            </label>
                            <input
                              type="date"
                              value={editForm.estimated_delivery}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  estimated_delivery: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-slate-600/60 bg-slate-800/60 text-slate-100 focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditSave(fulfillment.id)}
                            className="px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 font-medium hover:bg-emerald-600/30 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-600/50 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(fulfillment.status)}`}>
                              {getStatusIcon(fulfillment.status)}
                              {fulfillment.status.charAt(0).toUpperCase() +
                                fulfillment.status.slice(1)}
                            </span>
                            <span className="text-slate-400">
                              Order:{' '}
                              <Link
                                href={`/orders/${fulfillment.order?.order_number}`}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {fulfillment.order?.order_number}
                              </Link>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {fulfillment.carrier && (
                              <div>
                                <p className="text-xs text-slate-500 uppercase">
                                  Carrier
                                </p>
                                <p className="text-slate-100 font-medium">
                                  {fulfillment.carrier}
                                </p>
                              </div>
                            )}
                            {fulfillment.tracking_number && (
                              <div>
                                <p className="text-xs text-slate-500 uppercase">
                                  Tracking
                                </p>
                                <p className="text-slate-100 font-mono text-sm break-all">
                                  {fulfillment.tracking_number}
                                </p>
                              </div>
                            )}
                            {fulfillment.estimated_delivery && (
                              <div>
                                <p className="text-xs text-slate-500 uppercase">
                                  Est. Delivery
                                </p>
                                <p className="text-slate-100">
                                  {new Date(
                                    fulfillment.estimated_delivery
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-slate-500 uppercase">
                                Created
                              </p>
                              <p className="text-slate-100">
                                {new Date(
                                  fulfillment.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleEditStart(fulfillment)}
                          className="px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/50 text-blue-300 font-medium hover:bg-blue-600/30 transition-colors ml-4"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
