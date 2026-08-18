import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrice, sizes } from '../../data/productsData';
import { getMinProductPrice } from '../../utils/productFilterUtils';
import { useAuth } from '../Account';
import { isItemInWishlist, toggleWishlistItem } from '../../utils/wishlistStorage';

export function ProductCard({
  product,
  addToCart,
  onQuickView,
  isCompared,
  onToggleCompare,
}) {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (user) {
      setInWishlist(isItemInWishlist(user, product.id));
    } else {
      setInWishlist(false);
    }
  }, [user, product.id]);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (!isLoggedIn || !user) {
      openAuthModal('login');
      return;
    }
    const added = toggleWishlistItem(user, product);
    setInWishlist(added);
  };

  const handleEyeClick = (e) => {
    e.stopPropagation();
    window.location.hash = `product/${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const thicknessKeys = Object.keys(product.prices || {});
  const defaultThickness = thicknessKeys.length > 0 ? thicknessKeys[0] : '6';

  const [selectedSize, setSelectedSize] = useState('72x60');
  const [selectedThickness, setSelectedThickness] = useState(defaultThickness);

  // Dynamic minimum price calculation from thickness
  const calculatedPrice = getPrice(product, selectedSize, selectedThickness);
  const minBasePrice = getMinProductPrice(product);
  const displayStartingPrice = calculatedPrice > 0 ? calculatedPrice : minBasePrice;

  // Calculate discount and original price
  const discountPercent = product.discountPercent || 15;
  const originalPrice = Math.round(displayStartingPrice * (1 + discountPercent / 100));

  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || 28;

  return (
    <article className="somnera-product-card">
      <div className="card-image-wrapper">
        {product.badge && <span className="card-badge">{product.badge}</span>}
        
        <img
          src={product.image}
          alt={product.name}
          className="card-image"
          loading="lazy"
        />

        {/* Overlay Actions: Eye (View Details) & Heart (Wishlist) */}
        <div className="card-overlay-group">
          {/* Heart / Wishlist Button */}
          <button
            type="button"
            className={`card-overlay-icon-btn ${inWishlist ? 'wishlist-active' : ''}`}
            onClick={handleWishlistToggle}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label={`Wishlist ${product.name}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? '#ef4444' : 'none'} stroke={inWishlist ? '#ef4444' : 'currentColor'} strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Eye / View Details Button */}
          <button
            type="button"
            className="card-overlay-icon-btn"
            onClick={handleEyeClick}
            title="View Product Details"
            aria-label={`View details for ${product.name}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {/* Compare Checkbox */}
        <button
          type="button"
          className={`card-compare-btn ${isCompared ? 'active' : ''}`}
          onClick={() => onToggleCompare(product)}
          title="Compare mattress"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="8" height="18" rx="1" />
            <rect x="14" y="3" width="8" height="18" rx="1" />
          </svg>
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>
      </div>

      <div className="card-content">
        <div className="card-eyebrow">
          {product.category && <strong>{product.category} • </strong>}
          <span>{product.firmness || product.eyebrow}</span>
        </div>

        <h3 className="card-title">
          <Link to={`/product/${product.id}`} className="card-title-link" aria-label={`View details for ${product.name}`}>
            {product.name}
          </Link>
        </h3>

        <div className="card-rating">
          <span className="stars">★★★★★</span>
          <span className="rating-score">{rating}</span>
          <span className="review-count">({reviewCount})</span>
        </div>

        {/* Thickness Selectors */}
        {thicknessKeys.length > 0 && (
          <div className="card-thickness-row">
            <span className="thickness-label">Thickness:</span>
            <div className="thickness-pills">
              {thicknessKeys.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`thickness-pill ${t === selectedThickness ? 'active' : ''}`}
                  onClick={() => setSelectedThickness(t)}
                >
                  {t}&quot;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        <div className="card-size-row">
          <label htmlFor={`size-select-${product.id}`}>Size:</label>
          <select
            id={`size-select-${product.id}`}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s} in
              </option>
            ))}
          </select>
        </div>

        {/* Pricing Block */}
        <div className="card-price-block">
          <div className="price-primary">
            <small>From MRP</small>
            <strong className="current-price">₹{displayStartingPrice.toLocaleString('en-IN')}</strong>
            <del className="original-price">₹{originalPrice.toLocaleString('en-IN')}</del>
            <span className="discount-tag">({discountPercent}% OFF)</span>
          </div>
          <span className="tax-inclusive-text">(Incl. of all taxes)</span>
        </div>

        <div className="card-warranty-strip">
          <span>✓ {product.warranty || '10 years'} warranty</span>
          <span>✓ Free Delivery</span>
        </div>

        {/* Actions */}
        <div className="card-actions-row">
          <Link to={`/product/${product.id}`} className="view-details-btn">
            Details
          </Link>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={() =>
              addToCart({
                ...product,
                size: selectedSize,
                thickness: selectedThickness,
                price: displayStartingPrice,
              })
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            ADD TO CART
          </button>
        </div>
      </div>
    </article>
  );
}
