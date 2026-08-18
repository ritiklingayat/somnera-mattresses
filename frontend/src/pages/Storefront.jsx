import { useMemo, useState } from 'react';
import { getPrice, sizes } from '../data/productsData';
import { siteConfig } from '../config/siteConfig';
import './Storefront.css';

const icons = ['✦', '◌', '⌁', '◈'];
function Intro({ eyebrow, title, copy, children }) {
  return (
    <section className="page-intro">
      <div className="container">
        <span className="section-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
        {children}
      </div>
    </section>
  );
}
function ProductCard({ product, addToCart }) {
  const thicknesses = Object.keys(product.prices);
  const [size, setSize] = useState('72x60');
  const [thickness, setThickness] = useState(thicknesses[0]);
  const price = getPrice(product, size, thickness);
  return (
    <article className="product-card">
      <div className="product-image">
        <span>{product.badge}</span>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-card-body">
        <p className="product-eyebrow">
          {product.category ? <strong>{product.category} · </strong> : ''}
          {product.eyebrow}
        </p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="pill-row">
          {thicknesses.map((t) => (
            <button
              className={t === thickness ? 'pill active' : 'pill'}
              onClick={() => setThickness(t)}
              key={t}
            >
              {t}&quot;
            </button>
          ))}
        </div>
        <select aria-label="Mattress size" value={size} onChange={(e) => setSize(e.target.value)}>
          {sizes.map((s) => (
            <option key={s}>{s} in</option>
          ))}
        </select>
        <div className="card-bottom">
          <div>
            <small>From</small>
            <strong>₹{price.toLocaleString('en-IN')}</strong>
          </div>
          <button
            className="add-button"
            onClick={() => addToCart({ ...product, size, thickness, price })}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
function Products({ products, addToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];
  const filteredProducts =
    activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <Intro
        eyebrow="The collection"
        title="Find your sleep signature."
        copy="Five considered comfort systems, made with premium materials and support that holds its shape night after night."
      />
      {categories.length > 1 && (
        <div className="category-filters container">
          {categories.map((c) => (
            <button
              key={c}
              className={`filter-pill ${c === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <section className="catalog container">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </section>
      <section className="size-guide">
        <div className="container two-col">
          <div>
            <span className="section-kicker">Interactive size guide</span>
            <h2>Choose the room, then the mattress.</h2>
            <p>Our size range is designed for every kind of sleeper and every kind of space.</p>
          </div>
          <div className="size-grid">
            {['Single · 30–36 in', 'Double · 48 in', 'Queen · 60–66 in', 'King · 72 in'].map(
              (x, i) => (
                <div key={x}>
                  <b>{icons[i]}</b>
                  {x}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function About() {
  return (
    <>
      <Intro
        eyebrow="Our story"
        title="Better sleep, thoughtfully made."
        copy="Somnera is an Indian sleep company bringing considered comfort, honest materials and deeply restorative rest to homes across the country."
      />
      <section className="container story-grid">
        <div>
          <h2>Our mission</h2>
          <p>
            To make a great night's sleep feel attainable—through mattresses engineered for real
            bodies, real homes and everyday wellbeing.
          </p>
          <h2>Our vision</h2>
          <p>
            To become the most trusted name in sleep comfort, where every product is as reliable as
            the rest it delivers.
          </p>
        </div>
        <div className="story-panel">
          <span>01</span>
          <h2>Manufacturing excellence</h2>
          <p>
            From foam formulation to final finish, our experienced craftsmen and precision machinery
            work under one roof for consistent quality.
          </p>
          <hr />
          <span>02</span>
          <h2>Quality assurance</h2>
          <p>
            Every Somnera mattress is tested for comfort, resilience and durability before it finds
            its way to your bedroom.
          </p>
        </div>
      </section>
    </>
  );
}
function Gallery({ products }) {
  return (
    <>
      <Intro
        eyebrow="Made to be lived in"
        title="A closer look at Somnera."
        copy="The details, people and spaces that make restorative sleep possible."
      />
      <section className="gallery-grid container">
        {products.map((p, i) => (
          <figure key={p.id} className={`gallery-item gallery-${i}`}>
            <img src={p.image} alt={`${p.name} mattress`} />
            <figcaption>{i < 2 ? 'Product details' : 'Comfort, made here'}</figcaption>
          </figure>
        ))}
        <div className="gallery-copy">
          <span className="section-kicker">From our factory</span>
          <h2>Crafting comfort with care.</h2>
          <p>Layer by layer, we make mattresses that perform beautifully for years.</p>
        </div>
      </section>
    </>
  );
}
function Warranty({ onNavigate }) {
  return (
    <>
      <Intro
        eyebrow="The Somnera promise"
        title="Comfort that stays with you."
        copy="Every Somnera mattress is backed by a clear, straightforward warranty and support from people who care."
      />
      <section className="container promise-grid">
        {[
          [
            '01',
            'Register your mattress',
            'Keep your purchase invoice and register your mattress after delivery.',
          ],
          [
            '02',
            'Raise a claim',
            'Connect with our support team with your order details and photos.',
          ],
          [
            '03',
            'We take care of it',
            'Our team will assess your claim and guide you to a quick resolution.',
          ],
        ].map(([n, t, c]) => (
          <article key={n}>
            <span>{n}</span>
            <h2>{t}</h2>
            <p>{c}</p>
          </article>
        ))}
      </section>
      <section className="warranty-terms">
        <div className="container">
          <h2>Warranty terms at a glance</h2>
          <div className="terms">
            <p>Coverage against manufacturing defects in foam and workmanship.</p>
            <p>Valid only with a valid purchase invoice and original product label.</p>
            <p>Normal softening, accidental damage and improper use are not covered.</p>
          </div>
          <button className="button button-primary" onClick={() => onNavigate('contact')}>
            Start a warranty claim
          </button>
        </div>
      </section>
    </>
  );
}
function Contact() {
  return (
    <>
      <Intro
        eyebrow="Sleep support, made personal"
        title="Let’s find your perfect comfort."
        copy="Whether you are choosing your first Somnera or need help with an order, our sleep experts are here for you."
      />
      <section className="contact-page container">
        <div className="contact-intro">
          <span className="section-kicker">Talk to a sleep expert</span>
          <h2>Comfort begins with a conversation.</h2>
          <p>
            Reach us in the way that feels easiest. We are happy to help you find the right feel,
            size and support for your home.
          </p>
          <div className="contact-methods">
            <a href={`tel:${siteConfig.phone}`}>
              <b>☎</b>
              <span>
                <small>Call us</small>+91 {siteConfig.phone}
              </span>
              <i>→</i>
            </a>
            <a href={`mailto:${siteConfig.email}`}>
              <b>✉</b>
              <span>
                <small>Email us</small>
                {siteConfig.email}
              </span>
              <i>→</i>
            </a>
            <a
              className="contact-whatsapp"
              target="_blank"
              rel="noreferrer"
              href={`https://wa.me/${siteConfig.whatsapp}`}
            >
              <b>◌</b>
              <span>
                <small>Fastest response</small>Chat on WhatsApp
              </span>
              <i>↗</i>
            </a>
          </div>
          <div className="contact-map">
            <div className="map-pin">✦</div>
            <div>
              <strong>Somnera Mattress & Foam</strong>
              <span>India · Serving better sleep nationwide</span>
            </div>
            <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">
              View on map ↗
            </a>
          </div>
        </div>
        <form
          className="contact-form contact-form-premium"
          onSubmit={(e) => {
            e.preventDefault();
            alert('Thank you! Our sleep experts will be in touch shortly.');
          }}
        >
          <div className="form-heading">
            <span>Send a message</span>
            <h2>How can we help?</h2>
            <p>Tell us a little about what you need. We usually respond within one business day.</p>
          </div>
          <div className="contact-two-fields">
            <label>
              Full name
              <input required placeholder="Your name" />
            </label>
            <label>
              Mobile number
              <input required type="tel" placeholder="+91 00000 00000" />
            </label>
          </div>
          <label>
            Email address
            <input required type="email" placeholder="you@example.com" />
          </label>
          <label>
            What can we help with?
            <select defaultValue="">
              <option value="" disabled>
                Select a topic
              </option>
              <option>Choose a mattress</option>
              <option>Existing order</option>
              <option>Warranty support</option>
              <option>Other enquiry</option>
            </select>
          </label>
          <label>
            Your message
            <textarea required rows="4" placeholder="Tell us about your sleep needs" />
          </label>
          <button className="button button-primary">
            Send enquiry <span>→</span>
          </button>
          <small className="form-note">
            By sending this form, you agree to be contacted by Somnera.
          </small>
        </form>
      </section>
      <section className="contact-reassurance">
        <div className="container">
          <span>Made with care</span>
          <p>Expert guidance · Secure support · Premium comfort</p>
        </div>
      </section>
    </>
  );
}
function Cart({ cart, updateQuantity, onNavigate }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <>
      <Intro
        eyebrow="Your selection"
        title="Your comfort cart."
        copy={
          cart.length
            ? 'A better night is just a few steps away.'
            : 'Your cart is waiting for the mattress made for you.'
        }
      />
      <section className="container cart-layout">
        {cart.length ? (
          <div className="cart-items">
            {cart.map((item, i) => (
              <article className="cart-item" key={`${item.id}-${item.size}-${item.thickness}`}>
                <img src={item.image} alt="" />
                <div>
                  <h2>{item.name}</h2>
                  <p>
                    {item.size} · {item.thickness}&quot; thickness
                  </p>
                  <strong>₹{item.price.toLocaleString('en-IN')}</strong>
                </div>
                <div className="quantity">
                  <button onClick={() => updateQuantity(i, item.quantity - 1)}>−</button>
                  <b>{item.quantity}</b>
                  <button onClick={() => updateQuantity(i, item.quantity + 1)}>+</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-cart">
            <h2>Your cart is empty.</h2>
            <button className="button button-dark" onClick={() => onNavigate('products')}>
              Browse mattresses
            </button>
          </div>
        )}
        <aside className="summary">
          <h2>Order summary</h2>
          <p>
            Subtotal <strong>₹{total.toLocaleString('en-IN')}</strong>
          </p>
          <p>
            Delivery <strong>Free</strong>
          </p>
          <hr />
          <h3>
            Total <strong>₹{total.toLocaleString('en-IN')}</strong>
          </h3>
          <button
            disabled={!cart.length}
            className="button button-primary"
            onClick={() => onNavigate('checkout')}
          >
            Secure checkout
          </button>
        </aside>
      </section>
    </>
  );
}
function Checkout({ cart, onNavigate }) {
  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
  return (
    <>
      <Intro
        eyebrow="Secure checkout"
        title="Almost ready for better sleep."
        copy="Your details are protected. We will confirm your order before dispatch."
      />
      <section className="container checkout">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Order request received. We will contact you to complete your Razorpay payment.');
            onNavigate('home');
          }}
        >
          <h2>Delivery information</h2>
          <div className="form-grid">
            {['Full name', 'Mobile number', 'Email address', 'City', 'State', 'Pincode'].map(
              (x) => (
                <label key={x}>
                  {x}
                  <input required />
                </label>
              )
            )}
          </div>
          <label>
            Full address
            <textarea required rows="3" />
          </label>
          <h2>Payment method</h2>
          <div className="payment-options">
            {['UPI', 'Credit / Debit Card', 'Net Banking', 'Wallet'].map((x) => (
              <label key={x}>
                <input name="payment" type="radio" defaultChecked={x === 'UPI'} />
                {x}
              </label>
            ))}
          </div>
          <p className="razorpay">Secure payments powered by Razorpay</p>
          <button className="button button-primary">Pay ₹{total.toLocaleString('en-IN')}</button>
        </form>
        <aside className="summary">
          <h2>Your order</h2>
          {cart.map((i) => (
            <p key={i.id}>
              {i.name} × {i.quantity}
              <strong>₹{(i.price * i.quantity).toLocaleString('en-IN')}</strong>
            </p>
          ))}
          <hr />
          <h3>
            Total <strong>₹{total.toLocaleString('en-IN')}</strong>
          </h3>
        </aside>
      </section>
    </>
  );
}
function Admin({ products, setProducts }) {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const save = () => {
    if (!name.trim()) return;
    if (editing !== null) setProducts(products.map((p, i) => (i === editing ? { ...p, name } : p)));
    else
      setProducts([
        ...products,
        { ...products[0], id: name.toLowerCase().replaceAll(' ', '-'), name, badge: 'New arrival' },
      ]);
    setName('');
    setEditing(null);
  };
  return (
    <>
      <Intro
        eyebrow="Store control"
        title="Product management."
        copy="Manage your catalog, prices and offers from one simple workspace."
      />
      <section className="admin container">
        <div className="admin-form">
          <h2>{editing === null ? 'Add a product' : 'Edit product'}</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
          />
          <button className="button button-primary" onClick={save}>
            {editing === null ? 'Add product' : 'Save changes'}
          </button>
          <p>Pricing and offers are managed per variant in the product catalog.</p>
        </div>
        <div className="admin-table">
          {products.map((p, i) => (
            <div key={`${p.id}-${i}`}>
              <img src={p.image} alt="" />
              <span>
                <b>{p.name}</b>
                <small>
                  {p.eyebrow} · {p.warranty} warranty
                </small>
              </span>
              <button
                onClick={() => {
                  setEditing(i);
                  setName(p.name);
                }}
              >
                Edit
              </button>
              <button
                className="danger"
                onClick={() => setProducts(products.filter((_, n) => n !== i))}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default function Storefront({
  view,
  products = [],
  addToCart,
  cart = [],
  updateQuantity,
  onNavigate,
  setProducts,
}) {
  if (view === 'products') return <Products products={products} addToCart={addToCart} />;
  if (view === 'about') return <About />;
  if (view === 'gallery') return <Gallery products={products} />;
  if (view === 'warranty') return <Warranty onNavigate={onNavigate} />;
  if (view === 'contact') return <Contact />;
  if (view === 'cart')
    return <Cart cart={cart} updateQuantity={updateQuantity} onNavigate={onNavigate} />;
  if (view === 'checkout') return <Checkout cart={cart} onNavigate={onNavigate} />;
  return <Admin products={products} setProducts={setProducts} />;
}
