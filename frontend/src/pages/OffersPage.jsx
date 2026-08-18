import { useNavigate } from 'react-router-dom';

const OFFERS = [
  {
    id: 1,
    title: 'Monsoon Sleep Celebration',
    discount: 'FLAT 25% OFF',
    code: 'SOMNERA25',
    description: 'Enjoy extra savings on all Orthopaedic & Natural Latex mattresses. Includes 2 complimentary sleep pillows.',
    validTill: 'Limited Time Offer',
    category: 'Orthopaedic',
  },
  {
    id: 2,
    title: 'Memory Cloud Festive Special',
    discount: 'UP TO 30% OFF',
    code: 'CLOUD30',
    description: 'Special pricing on BodySense and Somnus memory foam mattresses with 10-year warranty guarantee.',
    validTill: 'Valid this month',
    category: 'Memory Foam',
  },
  {
    id: 3,
    title: 'Showroom Partner Combo Deal',
    discount: 'FREE PILLOW SET',
    code: 'COMBOFREE',
    description: 'Buy any Queen or King size mattress and receive 2 Luxury Contour Memory Pillows worth ₹3,499 free.',
    validTill: 'On orders above ₹15,000',
    category: 'Combo Deal',
  },
];

export function OffersPage() {
  const navigate = useNavigate();
  return (
    <div className="offers-page-wrapper">
      <div style={{ background: '#002b49', color: '#ffffff', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ background: '#f59e0b', color: '#0f172a', fontWeight: '900', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '4px', letterSpacing: '0.1em' }}>
            EXCLUSIVE DEALS & PROMOS
          </span>
          <h1 style={{ fontFamily: "var(--font-display, 'Playfair Display', serif)", fontSize: '2.5rem', margin: '14px 0 8px' }}>
            Somnera Special Sleep Offers
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#cbd5e1', fontSize: '1rem' }}>
            Save on premium orthopaedic support, natural latex and memory foam comfort with free doorstep delivery across India.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '50px 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              style={{
                background: '#ffffff',
                border: '2px solid #bae6fd',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(56, 189, 248, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <div>
                <span style={{ color: '#0284c7', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {offer.category}
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#0f172a', margin: '8px 0' }}>{offer.title}</h2>
                <div style={{ background: '#f0f9ff', color: '#0284c7', display: 'inline-block', fontWeight: '900', fontSize: '1.2rem', padding: '6px 14px', borderRadius: '8px', margin: '6px 0 14px' }}>
                  {offer.discount}
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 16px' }}>{offer.description}</p>
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>Coupon Code:</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', letterSpacing: '0.05em' }}>{offer.code}</strong>
                </div>
              </div>

              <button
                type="button"
                className="button button-primary"
                onClick={() => navigate('/mattresses')}
                style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#ffffff', fontWeight: '800', border: 'none', borderRadius: '8px' }}
              >
                CLAIM OFFER & SHOP NOW
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
