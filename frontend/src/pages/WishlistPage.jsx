import { useEffect, useState } from 'react';
import { useAuth } from '../components/Account';
import { getStoredWishlist, removeWishlistItem } from '../utils/wishlistStorage';
import { getMinProductPrice } from '../utils/productFilterUtils';
import { getPrice } from '../data/productsData';
import './WishlistPage.css';

export function WishlistPage({ products = [], onNavigate, addToCart }) {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist for current logged-in user
  const syncWishlist = () => {
    if (!isLoggedIn || !user) {
      setWishlistItems([]);
      return;
    }
    const stored = getStoredWishlist(user);
    // Map stored IDs or objects back to active products catalog
    const fullProducts = stored
      .map((item) => {
        const id = typeof item === 'string' ? item : item.id;
        return products.find((p) => p.id === id) || (typeof item === 'object' ? item : null);
      })
      .filter(Boolean);

    setWishlistItems(fullProducts);
  };

  useEffect(() => {
    syncWishlist();

    const handleWishlistChange = () => {
      syncWishlist();
    };

    window.addEventListener('somnera_wishlist_changed', handleWishlistChange);
    return () => window.removeEventListener('somnera_wishlist_changed', handleWishlistChange);
  }, [user, isLoggedIn, products]);

  const handleRemove = (productId) => {
    if (!user) return;
    removeWishlistItem(user, productId);
    syncWishlist();
  };

  const handleNav = (href) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.hash = href;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="wishlist-page">
        <div className="container wishlist-unauth-container">
          <div className="wishlist-empty-card">
            <span className="empty-icon">🔒</span>
            <h2>Please log in to view your Wishlist</h2>
            <p>Your saved mattresses and accessories are stored securely in your Somnera account.</p>
            <button className="wishlist-primary-btn" onClick={() => openAuthModal('login')}>
              Log In / Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="container">
          <span className="wishlist-kicker">YOUR SAVED FAVORITES</span>
          <h1>My Wishlist</h1>
          <p>Review and add your saved Somnera comfort items directly to cart.</p>
        </div>
      </div>

      <div className="container wishlist-container">
        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty-card">
            <span className="empty-icon">🤍</span>
            <h2>Your wishlist is empty.</h2>
            <p>Explore our premium orthopaedic mattresses and sleep accessories to save your favorites.</p>
            <button className="wishlist-primary-btn" onClick={() => handleNav('mattresses')}>
              Browse Mattresses →
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((product) => {
              const thicknessKeys = Object.keys(product.prices || {});
              const defaultThickness = thicknessKeys.length > 0 ? thicknessKeys[0] : '6';
              const price = getPrice(product, '72x60', defaultThickness) || getMinProductPrice(product) || product.price || 0;

              return (
                <article key={product.id} className="wishlist-card">
                  <div className="wishlist-card-image-wrap">
                    <img src={product.image} alt={product.name} />
                    {product.badge && <span className="wishlist-badge">{product.badge}</span>}
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => handleRemove(product.id)}
                      title="Remove from wishlist"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="wishlist-card-content">
                    <p className="wishlist-category">{product.category || product.eyebrow}</p>
                    <h3 className="wishlist-title">{product.name}</h3>
                    <p className="wishlist-desc">{product.description}</p>

                    {price > 0 && (
                      <div className="wishlist-price-row">
                        <span className="price-label">Price:</span>
                        <strong className="price-val">₹{price.toLocaleString('en-IN')}</strong>
                      </div>
                    )}

                    <div className="wishlist-actions">
                      <button
                        className="wishlist-details-btn"
                        onClick={() => handleNav(`product/${product.id}`)}
                      >
                        View Details
                      </button>

                      {addToCart && (
                        <button
                          className="wishlist-add-cart-btn"
                          onClick={() => {
                            addToCart({
                              ...product,
                              size: '72x60',
                              thickness: defaultThickness,
                              price,
                            });
                          }}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
