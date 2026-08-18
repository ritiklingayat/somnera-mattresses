import { products as seedProducts } from '../data/productsData';

export const PRODUCTS_STORAGE_KEY = 'somnera_products_v1';
export const CATEGORIES_STORAGE_KEY = 'somnera_categories_v1';

export const initialCategories = [
  {
    id: 'orthopaedic-collection',
    name: 'Orthopaedic Collection',
    subcategories: ['Firm Support', 'Back Care', 'Dual Comfort', 'Spine Alignment'],
  },
  {
    id: 'luxury-memory-foam',
    name: 'Luxury Memory Foam',
    subcategories: ['Cloud Comfort', 'Pressure Relief', 'Cooling Gel', 'Zero Motion Transfer'],
  },
  {
    id: 'natural-latex',
    name: 'Natural Latex',
    subcategories: ['Organic Comfort', 'Hypoallergenic', 'Breathable Core'],
  },
  {
    id: 'everyday-essentials',
    name: 'Everyday Essentials',
    subcategories: ['Balanced Feel', 'Guest Bed Special', 'Budget Friendly'],
  },
];

/**
 * Migrate stored products to add any missing fields introduced in newer versions.
 * - productSection defaults to 'MATTRESS' for legacy products
 * - needs / userTypes / tech / feels arrays default to []
 */
function migrateProducts(products) {
  return products.map((p) => ({
    ...p,
    productSection: p.productSection || 'MATTRESS',
    needs: Array.isArray(p.needs) ? p.needs : [],
    userTypes: Array.isArray(p.userTypes) ? p.userTypes : [],
    tech: Array.isArray(p.tech) ? p.tech : [],
    feels: Array.isArray(p.feels) ? p.feels : [],
  }));
}

export function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return seedProducts;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? migrateProducts(parsed) : seedProducts;
  } catch (e) {
    console.error('Failed to parse stored products', e);
    return seedProducts;
  }
}

export function saveStoredProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('somnera_products_changed'));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
}

export function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) return initialCategories;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialCategories;
  } catch (e) {
    console.error('Failed to parse stored categories', e);
    return initialCategories;
  }
}

export function saveStoredCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('somnera_categories_changed'));
  } catch (e) {
    console.error('Failed to save categories to localStorage', e);
  }
}
