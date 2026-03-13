'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { products, productCategories, type Product } from './constants/shop';
import { fadeInUp } from './motionPresets';

interface CartItem {
  product: Product;
  quantity: number;
}

export function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof productCategories)[number]>('All');
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === 'All'
        ? products
        : products.filter((p) => p.category === selectedCategory),
    [selectedCategory],
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (!existing) {
        return [...prev, { product, quantity: 1 }];
      }
      return prev.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <section
      id="shop"
      className="min-h-screen py-20 px-6 bg-slate-950 bg-etched relative overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 left-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-slate-900/0 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tl from-amber-600/12 via-amber-500/10 to-slate-900/0 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Merch & Tools"
          title="Nexus Group Store"
          description="Field-tested apparel, tools, and digital artifacts for builders who resonate with the Nexus ethos."
        />

        {/* Cart summary */}
        <motion.div
          variants={fadeInUp(12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-wrap gap-3">
            {productCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                  selectedCategory === category
                    ? 'gradient-tech text-white border-transparent shadow-blue-600/40'
                    : 'glass-subtle text-slate-300 border-slate-700/70 hover:text-blue-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingBag size={18} className="text-blue-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-emerald-500 text-[0.6rem] font-semibold text-slate-950 flex items-center justify-center px-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Cart</span>
            </div>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">
              {cartCount === 0 ? 'No items yet' : `${cartCount} item${cartCount > 1 ? 's' : ''}`}
            </span>
            {cartCount > 0 && (
              <>
                <span className="text-slate-500">·</span>
                <span className="font-semibold text-emerald-300">
                  ${cartTotal.toFixed(2)} <span className="text-slate-500 text-xs">USD</span>
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Products grid */}
        <motion.div
          variants={fadeInUp(10)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => {
            const inCart = cart.find((item) => item.product.id === product.id);
            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                className="group rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 flex flex-col justify-between shadow-[0_18px_45px_rgba(15,23,42,0.7)]"
              >
                <div>
                  {product.badge && (
                    <div className="inline-flex items-center rounded-full border border-amber-500/50 bg-amber-500/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-amber-200 mb-3">
                      {product.badge}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">{product.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{product.category}</p>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-100">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
                      {product.currency}
                    </p>
                  </div>

                  {inCart ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(product.id, -1)}
                        className="p-1 rounded-full hover:bg-slate-800 text-slate-300"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2ch] text-center text-sm text-slate-100">
                        {inCart.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(product.id, 1)}
                        className="p-1 rounded-full hover:bg-slate-800 text-slate-300"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-600/60 bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 hover:border-blue-500 hover:text-blue-300 transition-colors"
                    >
                      <ShoppingBag size={14} />
                      Add to bag
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Checkout note */}
        <motion.div
          variants={fadeInUp(16)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 rounded-lg border border-slate-700/70 bg-slate-950/80 px-4 py-3 text-xs md:text-sm text-slate-400"
        >
          Checkout and fulfillment can be wired to your preferred provider (Stripe, Shopify,
          LemonSqueezy, etc.). This interface gives visitors a clear, Nexus-branded way to explore
          and stage their order.
        </motion.div>
      </div>
    </section>
  );
}

