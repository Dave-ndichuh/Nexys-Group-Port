'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Minus, RefreshCw } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { fadeInUp } from '@/components/motionPresets';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .order('name', { ascending: true });

        if (err) throw err;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleStockChange = async (productId: string, newStock: number) => {
    try {
      const { error: err } = await supabase
        .from('products')
        .update({ stock: Math.max(0, newStock), updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (err) throw err;

      // Update local state
      setProducts(products.map(p =>
        p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p
      ));
    } catch (err) {
      console.error('[v0] Failed to update stock:', err);
    }
  };

  const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

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
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Inventory</h1>
            <p className="text-slate-400">
              Manage product stock levels and inventory
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp(10)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              {
                label: 'Total SKUs',
                value: products.length,
                color: 'from-blue-500/10 to-blue-600/5',
              },
              {
                label: 'Total Units',
                value: products.reduce((sum, p) => sum + p.stock, 0),
                color: 'from-emerald-500/10 to-emerald-600/5',
              },
              {
                label: 'Inventory Value',
                value: `$${totalValue.toFixed(2)}`,
                color: 'from-purple-500/10 to-purple-600/5',
              },
              {
                label: 'Out of Stock',
                value: outOfStockProducts.length,
                color: 'from-red-500/10 to-red-600/5',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp(11 + i)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`rounded-lg border border-slate-700/70 bg-gradient-to-br ${stat.color} p-6`}
              >
                <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <motion.div
              variants={fadeInUp(11)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-lg border border-amber-700/50 bg-amber-500/10 p-4 flex items-gap-3"
            >
              <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-300">Low Stock Alert</p>
                <p className="text-sm text-amber-200">
                  {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} {' '}
                  with stock &lt;= {lowStockThreshold}
                </p>
              </div>
            </motion.div>
          )}

          {/* Inventory Table */}
          <motion.div
            variants={fadeInUp(12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-lg border border-slate-700/70 bg-slate-900/70 overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-slate-400">Loading inventory...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-400">{error}</div>
            ) : products.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                No products found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50 border-b border-slate-700/70">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        Product Name
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        SKU
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-300">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right font-semibold text-slate-300">
                        Price
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-300">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-right font-semibold text-slate-300">
                        Value
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className={`hover:bg-slate-800/50 transition-colors ${
                          product.stock === 0 ? 'bg-red-500/5' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-100">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.description?.substring(0, 50)}...
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-300">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                handleStockChange(product.id, product.stock - 1)
                              }
                              className="p-1 hover:bg-slate-800 rounded transition-colors"
                              title="Decrease stock"
                            >
                              <Minus size={16} className="text-slate-400" />
                            </button>
                            <span
                              className={`min-w-[3ch] text-center font-semibold ${
                                product.stock === 0
                                  ? 'text-red-400'
                                  : product.stock <= lowStockThreshold
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {product.stock}
                            </span>
                            <button
                              onClick={() =>
                                handleStockChange(product.id, product.stock + 1)
                              }
                              className="p-1 hover:bg-slate-800 rounded transition-colors"
                              title="Increase stock"
                            >
                              <Plus size={16} className="text-slate-400" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-300">
                          ${(product.price * product.stock).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleStockChange(product.id, 0)}
                            className="p-1 hover:bg-slate-800/50 rounded transition-colors"
                            title="Reset stock"
                          >
                            <RefreshCw
                              size={16}
                              className="text-slate-400"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
