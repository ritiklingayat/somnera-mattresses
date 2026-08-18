import { useState } from 'react';

const SHOWROOMS = [
  {
    id: 1,
    city: 'Chhtrapati Sambhajinagar',
    name: 'Somnera Flagship Experience Center - Bandra West',
    address: 'Plot 45, Turner Road, Bandra West, Mumbai, Maharashtra 400050',
    phone: '+91 98765 43210',
    hours: '10:00 AM - 9:00 PM (Open 7 Days)',
    facilities: ['Trial Zone', 'Sleep Consultant On-Site', 'Parking Available'],
  },
];

export function FindShowroomPage() {
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShowrooms = SHOWROOMS.filter((store) => {
    if (selectedCity !== 'ALL' && store.city !== selectedCity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="find-showroom-page">
      <div
        className="showroom-hero-banner"
        style={{ background: '#002b49', color: '#ffffff', padding: '60px 0', textAlign: 'center' }}
      >
        <div className="container">
          <span
            style={{
              color: '#38bdf8',
              fontWeight: '800',
              letterSpacing: '0.12em',
              fontSize: '0.8rem',
            }}
          >
            SOMNERA EXPERIENCE STORES
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Playfair Display', serif)",
              fontSize: '2.5rem',
              margin: '12px 0',
            }}
          >
            Find a Somnera Showroom Near You
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#cbd5e1', fontSize: '1rem' }}>
            Experience our orthopaedic and memory foam mattresses in person. Test firmness levels
            with expert sleep consultants.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 0 80px' }}>
        {/* Controls bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontWeight: '700',
              fontSize: '0.9rem',
            }}
          >
            <option value="ALL">All Cities ({SHOWROOMS.length})</option>
            <option value="MUMBAI">Mumbai (2)</option>
            <option value="DELHI">Delhi (1)</option>
            <option value="BENGALURU">Bengaluru (1)</option>
            <option value="PUNE">Pune (1)</option>
          </select>

          <input
            type="text"
            placeholder="Search by area, pincode or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Showrooms Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredShowrooms.map((store) => (
            <div
              key={store.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0284c7',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {store.city}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '12px 0 8px 0' }}>
                  {store.name}
                </h3>
                <p
                  style={{
                    color: '#475569',
                    fontSize: '0.88rem',
                    margin: '0 0 12px 0',
                    lineHeight: 1.5,
                  }}
                >
                  📍 {store.address}
                </p>
                <p
                  style={{
                    color: '#0284c7',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}
                >
                  📞 {store.phone}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 14px 0' }}>
                  🕒 {store.hours}
                </p>

                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}
                >
                  {store.facilities.map((f) => (
                    <span
                      key={f}
                      style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: '600',
                      }}
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                  }}
                >
                  Get Directions ↗
                </a>
                <a
                  href={`tel:${store.phone.replace(/\s+/g, '')}`}
                  style={{
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                  }}
                >
                  Call Store
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
