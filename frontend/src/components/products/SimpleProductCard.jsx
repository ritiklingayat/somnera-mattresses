import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMinProductPrice } from '../../utils/productFilterUtils';
import { useAuth } from '../Account';
import { isItemInWishlist, toggleWishlistItem } from '../../utils/wishlistStorage';

/**
 * Generic product card for non-mattress sections (pillows, sofa).
 */
function SimpleProductCard({ product }) {
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

  const price = product.price > 0 ? product.price : getMinProductPrice(product);
  const discountPercent = product.discountPercent || 12;
  const originalPrice = Math.round(price * (1 + discountPercent / 100));

  return (
    <article
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '65%', background: '#f8f5ef', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: '#241132',
              color: '#d3af5d',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 4,
              letterSpacing: '0.05em',
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Action Overlay */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6, zIndex: 5 }}>
          <button
            type="button"
            onClick={handleWishlistToggle}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: inWishlist ? '#ef4444' : '#0f172a',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? '#ef4444' : 'none'} stroke={inWishlist ? '#ef4444' : 'currentColor'} strokeWidth="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleEyeClick}
            title="View Product Details"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0f172a',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {product.category || product.eyebrow}
        </p>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5, flex: 1 }}>
          {product.description}
        </p>

        {price > 0 && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
              ₹{price.toLocaleString('en-IN')}
            </strong>
            <del style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              ₹{originalPrice.toLocaleString('en-IN')}
            </del>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981' }}>
              {discountPercent}% OFF
            </span>
          </div>
        )}

        <Link
          to={`/product/${product.id}`}
          style={{
            marginTop: 8,
            padding: '9px 0',
            background: '#241132',
            color: '#d3af5d',
            borderRadius: 8,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '0.82rem',
            textDecoration: 'none',
            display: 'block',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#3a1d4a')}
          onMouseLeave={(e) => (e.target.style.background = '#241132')}
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}

export { SimpleProductCard };
