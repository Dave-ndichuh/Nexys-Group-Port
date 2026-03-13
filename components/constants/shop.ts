'use client';

export type ProductCategory = 'Apparel' | 'Accessories' | 'Tools' | 'Digital';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  currency: 'USD';
  badge?: string;
  image?: string;
}

export const productCategories: (ProductCategory | 'All')[] = [
  'All',
  'Apparel',
  'Accessories',
  'Tools',
  'Digital',
];

export const products: Product[] = [
  {
    id: 'nexus-cap',
    name: 'Nexus Field Cap',
    category: 'Apparel',
    description:
      'Low-profile cap with the Nexus emblem debossed, built for site visits and late-night builds.',
    price: 38,
    currency: 'USD',
    badge: 'Founders Edition',
  },
  {
    id: 'nexus-hoodie',
    name: 'Ventures Unified Hoodie',
    category: 'Apparel',
    description:
      'Heavyweight hoodie with subtle back print of the Nexus Group ring and a minimal chest mark.',
    price: 78,
    currency: 'USD',
    badge: 'Core Collection',
  },
  {
    id: 'nexus-notebook',
    name: 'Engineering Notebook',
    category: 'Tools',
    description:
      'Dot-grid notebook with numbered pages and a debossed emblem—built for sketches, flows, and field notes.',
    price: 24,
    currency: 'USD',
  },
  {
    id: 'nexus-mug',
    name: 'Workshop Mug',
    category: 'Accessories',
    description:
      'Double-walled steel mug with the Nexus seal, for early standups and long workshop sessions.',
    price: 32,
    currency: 'USD',
  },
  {
    id: 'nexus-blueprint-pack',
    name: 'Blueprint Poster Pack',
    category: 'Digital',
    description:
      'High-resolution posters inspired by the Nexus emblem, suitable for studio and lab walls.',
    price: 18,
    currency: 'USD',
  },
];

