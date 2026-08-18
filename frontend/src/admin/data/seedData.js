export const initialOrders = [
  { id: 'SMN-1048', name: 'Aarav Mehta', product: 'OG-Ortho · 72×60 · 6 in', amount: 28500, status: 'Pending', date: '28 Jul 2026' },
  { id: 'SMN-1047', name: 'Riya Sharma', product: 'BodySense · 78×60 · 6 in', amount: 22100, status: 'Confirmed', date: '27 Jul 2026' },
  { id: 'SMN-1046', name: 'Dev Kapoor', product: 'Somnus · 72×72 · 8 in', amount: 34200, status: 'Processing', date: '26 Jul 2026' },
  { id: 'SMN-1045', name: 'Isha Rao', product: 'Aarogyam · 75×48 · 5 in', amount: 14200, status: 'Shipped', date: '25 Jul 2026' },
  { id: 'SMN-1044', name: 'Kabir Singh', product: 'OrthoSense · 72×60 · 6 in', amount: 18600, status: 'Delivered', date: '24 Jul 2026' },
];

export const moduleConfig = {
  customers: { title: 'Customers', subtitle: 'Customer directory', empty: 'No customers found. Add a customer to start building your community.', action: 'Add customer', fields: ['Full name', 'Email address', 'Mobile number'] },
  coupons: { title: 'Coupons', subtitle: 'Promotions', empty: 'No active offers yet. Create a coupon to increase conversions.', action: 'Create coupon', fields: ['Coupon code', 'Discount value', 'Expiry date'] },
  reviews: { title: 'Reviews', subtitle: 'Moderation queue', empty: 'No reviews are waiting for approval.', action: 'Add review', fields: ['Customer name', 'Rating (1-5)', 'Review'] },
  leads: { title: 'Leads', subtitle: 'Enquiries', empty: 'No new leads right now. Incoming contact, callback, dealer and distributor forms will appear here.', action: 'Add lead', fields: ['Name', 'Mobile number', 'Lead source'] },
  settings: { title: 'Settings', subtitle: 'Store configuration', empty: 'Configure your commerce integrations and store preferences.', action: 'Save settings', fields: ['Store name', 'Support email', 'WhatsApp number'] },
};
