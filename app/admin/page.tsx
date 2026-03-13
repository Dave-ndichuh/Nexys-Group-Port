'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
} from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { fadeInUp } from '@/components/motionPresets';
import type { AnalyticsRecord } from '@/lib/supabase';

const COLORS = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>([]);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        
        // Get last 30 days of data
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const response = await fetch(
          `/api/analytics?start_date=${startDate}&end_date=${endDate}`
        );

        if (!response.ok) throw new Error('Failed to fetch analytics');

        const data = await response.json();
        setAnalytics(data);

        // Calculate stats
        const totalSales = data.reduce((sum: number, record: AnalyticsRecord) => sum + record.total_sales, 0);
        const totalOrders = data.reduce((sum: number, record: AnalyticsRecord) => sum + record.order_count, 0);
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        setStats([
          {
            title: 'Total Revenue',
            value: `$${totalSales.toFixed(2)}`,
            change: '+12.5%',
            icon: <DollarSign className="text-emerald-400" />,
            color: 'from-emerald-500/10 to-emerald-600/5',
          },
          {
            title: 'Total Orders',
            value: totalOrders,
            change: '+8.2%',
            icon: <ShoppingCart className="text-blue-400" />,
            color: 'from-blue-500/10 to-blue-600/5',
          },
          {
            title: 'Avg Order Value',
            value: `$${avgOrderValue.toFixed(2)}`,
            change: '+3.1%',
            icon: <TrendingUp className="text-purple-400" />,
            color: 'from-purple-500/10 to-purple-600/5',
          },
          {
            title: 'Customers',
            value: data.length > 0 ? Object.keys(data[0].customer_locations || {}).length : 0,
            change: '+5.4%',
            icon: <Users className="text-pink-400" />,
            color: 'from-pink-500/10 to-pink-600/5',
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Prepare chart data
  const chartData = analytics.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: record.total_sales,
    orders: record.order_count,
    revenue: record.total_sales,
  }));

  // Customer location data
  const locationData = analytics.length > 0 
    ? Object.entries(analytics[0].customer_locations || {}).map(([location, count]) => ({
        name: location,
        value: count as number,
      }))
    : [];

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
            <h1 className="text-4xl font-bold text-slate-100 mb-2">Dashboard</h1>
            <p className="text-slate-400">
              Monitor your e-commerce store performance and insights
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={fadeInUp(10)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={fadeInUp(11 + index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`rounded-lg border border-slate-700/70 bg-gradient-to-br ${stat.color} p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-slate-900/50">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <motion.div
              variants={fadeInUp(15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 rounded-lg border border-slate-700/70 bg-slate-900/70 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-100 mb-6">
                Sales Trend
              </h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      dot={{ fill: '#06B6D4', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-500">
                  No data available
                </div>
              )}
            </motion.div>

            {/* Customer Locations */}
            <motion.div
              variants={fadeInUp(16)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-100 mb-6">
                Top Locations
              </h2>
              {locationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#e2e8f0',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-500">
                  No location data
                </div>
              )}
            </motion.div>
          </div>

          {/* Orders Chart */}
          <motion.div
            variants={fadeInUp(17)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-100 mb-6">
              Orders & Revenue
            </h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="revenue"
                    fill="#06B6D4"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
