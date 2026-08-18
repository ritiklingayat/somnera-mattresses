/**
 * Somnera - User-Specific Wishlist Storage Utility
 * Isolates wishlist per logged-in user identity (email or ID) to prevent cross-account leakage.
 */

function getUserKey(user) {
  if (!user) return null;
  const identifier = user.id || user.email || 'anonymous';
  return `somnera_wishlist_${identifier.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

export function getStoredWishlist(user) {
  const key = getUserKey(user);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse user wishlist:', e);
    return [];
  }
}

export function saveStoredWishlist(user, items) {
  const key = getUserKey(user);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('somnera_wishlist_changed', { detail: { userKey: key } }));
  } catch (e) {
    console.error('Failed to save user wishlist:', e);
  }
}

export function isItemInWishlist(user, productId) {
  const wishlist = getStoredWishlist(user);
  return wishlist.some((item) => (typeof item === 'string' ? item === productId : item.id === productId));
}

export function toggleWishlistItem(user, product) {
  if (!user) return false;
  const current = getStoredWishlist(user);
  const productId = typeof product === 'string' ? product : product.id;
  const exists = current.some((item) => (typeof item === 'string' ? item === productId : item.id === productId));

  let next;
  if (exists) {
    next = current.filter((item) => (typeof item === 'string' ? item !== productId : item.id !== productId));
  } else {
    const itemToAdd = typeof product === 'string' ? { id: product } : product;
    next = [...current, itemToAdd];
  }

  saveStoredWishlist(user, next);
  return !exists; // returns true if added, false if removed
}

export function removeWishlistItem(user, productId) {
  if (!user) return;
  const current = getStoredWishlist(user);
  const next = current.filter((item) => (typeof item === 'string' ? item !== productId : item.id !== productId));
  saveStoredWishlist(user, next);
}
