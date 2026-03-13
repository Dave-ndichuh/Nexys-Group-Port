'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PackageOpen,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/inventory', label: 'Inventory', icon: PackageOpen },
  { href: '/admin/fulfillments', label: 'Fulfillments', icon: Truck },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-700/70 flex-col z-40">
        <div className="p-6 border-b border-slate-700/70">
          <h1 className="text-xl font-bold text-slate-100">Nexus Admin</h1>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-700/70">
          <div className="bg-slate-900/50 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Admin Panel</p>
            <p>Manage your e-commerce operations</p>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-4 p-4 border-b border-slate-700/70 bg-slate-950">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-900 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-lg font-bold text-slate-100">Nexus Admin</h1>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden fixed inset-0 top-16 z-30 bg-slate-950 border-t border-slate-700/70 p-4 space-y-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </motion.div>
      )}
    </>
  );
}
