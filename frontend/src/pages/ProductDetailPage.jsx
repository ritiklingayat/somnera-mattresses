import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPrice, sizes } from '../data/productsData';
import { getMinProductPrice } from '../utils/productFilterUtils';
import './ProductDetailPage.css';

export default function ProductDetailPage({ id: propId, products = [], addToCart }) {
  const params = useParams();
  const targetId = propId || params.id;
  const product = products.find((p) => p.id === targetId);

  const thicknessKeys = Object.keys(product?.prices || {});
  const [selectedSize, setSelectedSize] = useState('72x60');
  const [selectedThickness, setSelectedThickness] = useState(
    thicknessKeys.length > 0 ? thicknessKeys[0] : '6'
  );

  useEffect(() => {
    const keys = Object.keys(product?.prices || {});
    if (keys.length > 0) {
      setSelectedThickness((prev) => (keys.includes(prev) ? prev : keys[0]));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container product-not-found">
        <span className="product-not-found-icon">🛏️</span>
        <h2>Product not found</h2>
        <p>The mattress you are looking for is not currently available.</p>
        <Link to="/mattresses" className="button button-primary">
          Browse All Mattresses →
        </Link>
      </div>
    );
  }

  const price = getPrice(product, selectedSize, selectedThickness);
  const displayPrice = price > 0 ? price : getMinProductPrice(product);
  const discountPercent = product.discountPercent || 15;
  const originalPrice = Math.round(displayPrice * (1 + discountPercent / 100));
  const materials = Array.isArray(product.materials) ? product.materials : [];

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/mattresses">Mattresses</Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          <div className="product-detail-image-col">
            <div className="product-detail-image-wrap">
              <img src={product.image} alt={product.name} />
              {product.badge && <span className="product-detail-badge">{product.badge}</span>}
            </div>
          </div>

          <div className="product-detail-info-col">
            <span className="product-detail-eyebrow">
              {product.category} • {product.eyebrow}
            </span>
            <h1 className="product-detail-title">{product.name}</h1>

            <div className="product-detail-rating">
              <span className="stars">★★★★★</span>
              <strong>{product.rating || 4.8}</strong>
              <small>({product.reviewCount || 28} reviews)</small>
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="product-detail-specs-box">
              <div>
                <strong>Firmness:</strong> <span>{product.firmness || 'Medium firm'}</span>
              </div>
              <div>
                <strong>Warranty:</strong> <span>{product.warranty || '10 years'}</span>
              </div>
            </div>

            {materials.length > 0 && (
              <div className="product-detail-materials">
                <strong>Key Materials:</strong>
                <div className="materials-tags">
                  {materials.map((m) => (
                    <span key={m} className="mat-tag">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {thicknessKeys.length > 0 && (
              <div className="quickview-option-row">
                <label>Thickness:</label>
                <div className="thickness-pills">
                  {thicknessKeys.map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`thickness-pill ${t === selectedThickness ? 'active' : ''}`}
                      onClick={() => setSelectedThickness(t)}
                      aria-pressed={t === selectedThickness}
                    >
                      {t}&quot;
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quickview-option-row">
              <label htmlFor="detail-size-select">Size:</label>
              <select
                id="detail-size-select"
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

            <div className="product-detail-price-row">
              <div>
                <small>Total Price</small>
                <strong className="price-val">₹{displayPrice.toLocaleString('en-IN')}</strong>
                <del className="original-price">₹{originalPrice.toLocaleString('en-IN')}</del>
                <span className="discount-tag">({discountPercent}% OFF)</span>
              </div>
              <span className="tax-inclusive-text">(Incl. of all taxes)</span>
            </div>

            <div className="product-detail-actions">
              <button
                type="button"
                className="button button-primary quickview-add-btn"
                onClick={() =>
                  addToCart({
                    ...product,
                    size: selectedSize,
                    thickness: selectedThickness,
                    price: displayPrice,
                  })
                }
              >
                ADD TO CART
              </button>
              <Link to="/mattresses" className="back-to-mattresses">
                ← Back to Mattresses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
