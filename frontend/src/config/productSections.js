/**
 * Product Section / Website Section constants.
 * These values are stored in the product data and used to route
 * products to the correct storefront page.
 */

export const PRODUCT_SECTIONS = {
  MATTRESS: 'MATTRESS',
  PILLOWS_ACCESSORIES: 'PILLOWS_ACCESSORIES',
  SOFA_CUM_BED: 'SOFA_CUM_BED',
};

export const PRODUCT_SECTION_LABELS = {
  MATTRESS: 'Mattresses',
  PILLOWS_ACCESSORIES: 'Pillows & Accessories',
  SOFA_CUM_BED: 'Sofa Cum Bed',
};

export const PRODUCT_SECTION_OPTIONS = [
  { value: 'MATTRESS', label: 'Mattresses' },
  { value: 'PILLOWS_ACCESSORIES', label: 'Pillows & Accessories' },
  { value: 'SOFA_CUM_BED', label: 'Sofa Cum Bed' },
];

// Mattress-specific filter attribute options (used in both admin form and filter sidebar)
export const MATTRESS_NEED_OPTIONS = [
  'Cozy & Snug',
  'Latex',
  'Non Omni',
  'No Partner Disturbance',
  'Multi Activity',
  'Back Support',
  'Reversible',
];

export const MATTRESS_USER_OPTIONS = [
  'For Individual',
  'Couple With Kids',
  'Couples',
  'Guests',
  'Elders',
];

export const MATTRESS_TECH_OPTIONS = [
  'Pro Comfort',
  'Nexa Series',
  'Ortho Comfort',
  'Pro Spinetech',
  'Memory',
  'Progrid',
  'Spring',
  'Fitrest Series',
];

export const MATTRESS_MATERIAL_OPTIONS = [
  'Coir',
  'Natural Latex',
  'Impressions Foam',
  'Pocket Spring',
  'Reversible',
  'Pillow Top',
  'Euro Top',
  'Hero-Tech',
  'Resitec®',
  'Orthopaedic',
  'Latex Plus Foam',
];

export const MATTRESS_FEEL_OPTIONS = [
  'Gentle',
  'Medium Firm',
  'Firm',
  'Medium Soft Feel',
];
