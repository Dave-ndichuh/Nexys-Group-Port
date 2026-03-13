'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { useCart } from '@/hooks/useCart';
import { fadeInUp } from './motionPresets';
import type { Product } from '@/lib/supabase';

const productCategories = ['All', 'Apparel', 'Accessories', 'Tools', 'Digital'];

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { items: cartItems, addItem, updateQuantity, cartTotal, cartCount } = useCart();

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === 'All'
        ? products
        : products.filter((p) => p.category === selectedCategory),
    [products, selectedCategory],
  );

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Product is out of stock');
      return;
    }
    addItem(product);
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

        {/* Error message */}
        {error && (
          <motion.div
            variants={fadeInUp(11)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-6 rounded-lg border border-red-700/50 bg-red-500/10 px-4 py-3 flex items-gap-3 text-sm text-red-300"
          >
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

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
            {cartCount > 0 && (
              <>
                <span className="text-slate-500">·</span>
                <Link
                  href="/checkout"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
                >
                  Checkout <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            variants={fadeInUp(13)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-slate-900/70 border border-slate-700/70 animate-pulse"
              />
            ))}
          </motion.div>
        )}

        {/* Products grid */}
        {!isLoading && (
          <motion.div
            variants={fadeInUp(10)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product) => {
              const inCart = cartItems.find((item) => item.product_id === product.id);
              const isOutOfStock = product.stock <= 0;

              return (
                <motion.div
                  key={product.id}
                  whileHover={{ y: isOutOfStock ? 0 : -4 }}
                  className={`group rounded-xl border p-5 flex flex-col justify-between shadow-[0_18px_45px_rgba(15,23,42,0.7)] ${
                    isOutOfStock
                      ? 'border-slate-700/40 bg-slate-900/50 opacity-70'
                      : 'border-slate-700/70 bg-slate-900/70'
                  }`}
                >
                  <div>
                    {!isOutOfStock && (
                      <div className="inline-flex items-center rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-emerald-200 mb-3">
                        In Stock ({product.stock})
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="inline-flex items-center rounded-full border border-red-500/50 bg-red-500/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-red-200 mb-3">
                        Out of Stock
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
                        USD
                      </p>
                    </div>

                    {inCart ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, inCart.quantity - 1)}
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
                          onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
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
                        disabled={isOutOfStock}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                          isOutOfStock
                            ? 'border-slate-600/30 bg-slate-900/50 text-slate-400 cursor-not-allowed'
                            : 'border-slate-600/60 bg-slate-900/80 text-slate-100 hover:border-blue-500 hover:text-blue-300'
                        }`}
                      >
                        <ShoppingBag size={14} />
                        {isOutOfStock ? 'Out of stock' : 'Add to bag'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && filteredProducts.length === 0 && (
          <motion.div
            variants={fadeInUp(14)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <p className="text-slate-400">No products found in this category.</p>
          </motion.div>
        )}

        {/* Checkout note */}
        <motion.div
          variants={fadeInUp(16)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 rounded-lg border border-slate-700/70 bg-slate-950/80 px-4 py-3 text-xs md:text-sm text-slate-400"
        >
          Ready to checkout? Proceed to complete your order with secure payment processing.
        </motion.div>
      </div>
    </section>
  );
}
