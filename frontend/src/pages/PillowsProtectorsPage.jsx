import { useSearchParams, Link } from 'react-router-dom';
import { SimpleProductCard } from '../components/products/SimpleProductCard';

const CATEGORIES = [
  {
    id: 'pillows',
    title: 'Orthopaedic & Memory Foam Pillows',
    tagline: 'Ergonomic neck support for effortless spinal alignment',
    icon: '☁️',
    description: 'Engineered with contoured memory foam and cooling gel technology to reduce neck stiffness and support comfortable side or back sleeping.',
    items: [
      { name: 'Somnera Contour Ortho Pillow', spec: 'High-density Memory Foam', price: '₹1,499' },
      { name: 'Somnera Pure Latex Plush Pillow', spec: '100% Organic Natural Latex', price: '₹2,299' },
      { name: 'Somnera Dual-Cooling Gel Pillow', spec: 'Gel-Infused Thermal Control', price: '₹1,899' },
    ],
  },
  {
    id: 'mattress-protectors',
    title: 'Waterproof Mattress Protectors',
    tagline: '100% Spill-proof, breathable barrier against dust mites and liquid',
    icon: '🛡️',
    description: 'Super-soft Terry Cotton top layer with TPU waterproof lining. Protects your Somnera mattress against accidental spills, stain marks, and allergies.',
    items: [
      { name: 'Somnera Shield Waterproof Protector (Queen)', spec: '72x60 in Elastic Fitted', price: '₹1,299' },
      { name: 'Somnera Shield Waterproof Protector (King)', spec: '72x72 in Elastic Fitted', price: '₹1,599' },
      { name: 'Somnera Bamboo Eco-Shield Protector', spec: 'Hypoallergenic Organic Fabric', price: '₹1,999' },
    ],
  },
  {
    id: 'pillow-protectors',
    title: 'Hypoallergenic Pillow Protectors',
    tagline: 'Keep your pillows fresh, hygienic and stain-free',
    icon: '🔒',
    description: 'Zippered pillow encasements that block dust mites, sweat and dander while maintaining full pillow breathability.',
    items: [
      { name: 'Somnera Zippered Pillow Protector (Pair)', spec: 'Pack of 2 Standard Fits', price: '₹799' },
      { name: 'Somnera Cooling Touch Pillow Covers', spec: 'Pack of 2 Silk Touch Fabric', price: '₹999' },
    ],
  },
  {
    id: 'accessories',
    title: 'Sleep Accessories & Toppers',
    tagline: 'Enhance your bed with extra plush comfort layers',
    icon: '✨',
    description: 'Premium mattress toppers, travel pillows, and neck rolls designed to elevate comfort wherever you rest.',
    items: [
      { name: 'Somnera 2" Memory Foam Mattress Topper', spec: 'Transforms any Firm Bed', price: '₹3,999' },
      { name: 'Somnera Ergonomic Travel Neck Cushion', spec: 'Compact Travel Comfort', price: '₹899' },
    ],
  },
];

export function PillowsProtectorsPage({ products = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = searchParams.get('type') || 'all';

  const activeCategory = CATEGORIES.find((cat) => cat.id === currentType);

  return (
    <div className="pillows-protectors-page">
      {/* Hero Header */}
      <section className="category-hero" style={{ background: '#002b49', color: '#ffffff', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ color: '#38bdf8', fontWeight: '800', letterSpacing: '0.12em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            SOMNERA SLEEP ESSENTIALS
          </span>
          <h1 style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)", fontSize: '2.5rem', margin: '12px 0' }}>
            Pillows, Protectors &amp; Accessories
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
            Complete your bed setup with memory foam pillows, waterproof fitted protectors, and body-contouring sleep accessories.
          </p>
        </div>
      </section>

      {/* Live admin-added products grid */}
      {products.length > 0 && (
        <div className="container" style={{ padding: '40px 0 0' }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
              AVAILABLE NOW
            </p>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>Our Products</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {products.map((p) => (
              <SimpleProductCard key={p.id} product={p} />
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 40px' }} />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="container" style={{ padding: '36px 0 20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => setSearchParams({})}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              border: currentType === 'all' ? 'none' : '1px solid #cbd5e1',
              background: currentType === 'all' ? '#002b49' : '#ffffff',
              color: currentType === 'all' ? '#ffffff' : '#334155',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            All Items
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSearchParams({ type: cat.id })}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                border: currentType === cat.id ? 'none' : '1px solid #cbd5e1',
                background: currentType === cat.id ? '#002b49' : '#ffffff',
                color: currentType === cat.id ? '#ffffff' : '#334155',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.icon} {cat.title.split(' ')[0]} {cat.title.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* Category Content List */}
      <div className="container" style={{ padding: '20px 0 60px' }}>
        {(activeCategory ? [activeCategory] : CATEGORIES).map((cat) => (
          <div
            key={cat.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: 0 }}>{cat.title}</h2>
                <p style={{ color: '#0284c7', fontSize: '0.88rem', fontWeight: '700', margin: '2px 0 0 0' }}>
                  {cat.tagline}
                </p>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {cat.description}
            </p>

            {/* Sub-items grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 6px 0' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 14px 0' }}>{item.spec}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{item.price}</strong>
                    <span
                      style={{
                        background: '#e0f2fe',
                        color: '#0284c7',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      COMING SOON
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom CTA Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, #002b49 0%, #0a3a5c 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '40px 30px',
            textAlign: 'center',
            marginTop: '20px',
          }}
        >
          <span style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.78rem', letterSpacing: '0.1em' }}>
            LOOKING FOR IMMEDIATE COMFORT?
          </span>
          <h2 style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)", fontSize: '1.8rem', margin: '10px 0 14px' }}>
            Explore Our Orthopaedic Mattress Collection
          </h2>
          <p style={{ maxWidth: '580px', margin: '0 auto 24px', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Our sleep accessories pair perfectly with Somnera orthopaedic mattresses. Discover your ideal firmness and size today with free India-wide delivery.
          </p>
          <Link to="/mattresses" className="button button-primary" style={{ display: 'inline-flex', padding: '14px 32px' }}>
            Browse All Mattresses →
          </Link>
        </div>
      </div>
    </div>
  );
}
