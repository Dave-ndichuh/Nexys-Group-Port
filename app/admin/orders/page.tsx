'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';
import { fadeInUp } from '@/components/motionPresets';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem } from '@/lib/supabase';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch order items
        const ordersWithItems: OrderWithItems[] = await Promise.all(
          (ordersData || []).map(async (order) => {
            const { data: items } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);

            return { ...order, items: items || [] };
          })
        );

        setOrders(ordersWithItems);
        setFilteredOrders(ordersWithItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
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
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Orders</h1>
            <p className="text-slate-400">
              Manage and track all customer orders
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={fadeInUp(10)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-4"
          >
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search by order number or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-600/60 bg-slate-800/60 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-slate-600/60 bg-slate-800/60 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </motion.div>

          {/* Orders Table */}
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
                  <p className="text-slate-400">Loading orders...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">{error}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                {orders.length === 0 ? 'No orders yet' : 'No orders match your search'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50 border-b border-slate-700/70">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        Order Number
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        Customer Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        Items
                      </th>
                      <th className="px-6 py-4 text-right font-semibold text-slate-300">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-100">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {order.email}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-300">
                          ${order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/orders/${order.order_number}`}
                            className="inline-flex items-center justify-center p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                          >
                            <ExternalLink size={16} className="text-blue-400" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Pagination info */}
          {filteredOrders.length > 0 && (
            <motion.p
              variants={fadeInUp(12)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-sm text-slate-400 text-center"
            >
              Showing {filteredOrders.length} of {orders.length} orders
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
