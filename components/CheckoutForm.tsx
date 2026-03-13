'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { fadeInUp } from './motionPresets';
import type { CartItem } from '@/hooks/useCart';

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onSuccess: (orderNumber: string) => void;
  onError: (error: string) => void;
}

export function CheckoutForm({ items, total, onSuccess, onError }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
        throw new Error('Please fill in all required fields');
      }

      if (items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          totalAmount: total,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();
      onSuccess(data.order_number);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={fadeInUp(11)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-6 rounded-xl border border-slate-700/70 bg-slate-900/70 p-8"
    >
      <h3 className="text-xl font-semibold text-slate-100">Shipping Information</h3>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-700/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Doe"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="123 Main St"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            State/Province
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="NY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="10001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-600/60 bg-slate-800/60 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-700/70 pt-6">
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-slate-100">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Shipping</span>
            <span className="text-slate-100">Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-slate-700/70 pt-2">
            <span className="text-slate-100">Total</span>
            <span className="text-emerald-300">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Processing...' : 'Complete Order'}
        </button>
      </div>

      <p className="text-xs text-slate-500 text-center">
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </motion.form>
  );
}
