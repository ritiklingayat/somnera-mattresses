import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import Home from './pages/Home';
import Storefront from './pages/Storefront';
import AdminPanel from './admin/AdminPanel';
import { AuthProvider, AuthModal, useAuth } from './components/Account';
import { getStoredProducts, saveStoredProducts, getStoredCategories } from './utils/storage';

// One-time migration: ensure any stored products get productSection added.
// getStoredProducts already runs migrateProducts, so we just save it back.
(function runProductMigration() {
  try {
    const products = getStoredProducts();
    saveStoredProducts(products);
  } catch (e) {
    // safe to ignore — migration is best-effort
  }
})();

import { MattressesPage } from './pages/MattressesPage';
import { PillowsProtectorsPage } from './pages/PillowsProtectorsPage';
import { SofaCumBedPage } from './pages/SofaCumBedPage';
import { FindShowroomPage } from './pages/FindShowroomPage';
import { SleepAdvicePage } from './pages/SleepAdvicePage';
import { DistributorPage } from './pages/DistributorPage';
import { WishlistPage } from './pages/WishlistPage';
import { OffersPage } from './pages/OffersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/Account/ProfilePage';
import OrdersPage from './pages/Account/OrdersPage';

const pageFromHash = () => {
  const hash = (window.location.hash || '#home').replace('#', '');
  // Clean up any query parameters from hash if present
  const cleanHash = hash.split('?')[0];
  if (['login', 'register', 'forgot-password', 'reset-password'].includes(cleanHash)) {
    return 'home';
  }
  return cleanHash || 'home';
};

function MainAppContent({ cart, setCart, catalog, setCatalog, categories, searchQuery, setSearchQuery, page, setPage }) {
  const { isLoggedIn, openAuthModal, toastMessage, showToast } = useAuth();

  const filteredCatalog = useMemo(() => {
    if (!searchQuery) return catalog;
    const lower = searchQuery.toLowerCase();
    return catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.description && p.description.toLowerCase().includes(lower)) ||
        (p.eyebrow && p.eyebrow.toLowerCase().includes(lower)) ||
        (p.category && p.category.toLowerCase().includes(lower)) ||
        (p.firmness && p.firmness.toLowerCase().includes(lower)) ||
        (Array.isArray(p.materials) && p.materials.some((m) => m.toLowerCase().includes(lower))) ||
        (Array.isArray(p.needs) && p.needs.some((n) => n.toLowerCase().includes(lower))) ||
        (Array.isArray(p.tech) && p.tech.some((t) => t.toLowerCase().includes(lower))) ||
        (Array.isArray(p.feels) && p.feels.some((f) => f.toLowerCase().includes(lower)))
    );
  }, [catalog, searchQuery]);

  const changePage = (next) => {
    window.location.hash = next;
    setPage(next.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCatalog = (nextCatalog) => {
    const newProducts = typeof nextCatalog === 'function' ? nextCatalog(catalog) : nextCatalog;
    setCatalog(newProducts);
    saveStoredProducts(newProducts);
  };

  const directAddToCart = (item) => {
    setCart((current) => {
      const index = current.findIndex(
        (entry) => entry.id === item.id && entry.size === item.size && entry.thickness === item.thickness
      );
      if (index < 0) return [...current, { ...item, quantity: 1 }];
      return current.map((entry, i) => (i === index ? { ...entry, quantity: entry.quantity + 1 } : entry));
    });
  };

  // Requirement 4: Add to Cart -> Auth Check Flow
  const handleAddToCart = (item) => {
    if (isLoggedIn) {
      directAddToCart(item);
      showToast(`${item.name} added to cart!`);
    } else {
      // Prompt luxury login modal and preserve pending action
      openAuthModal('login', item);
    }
  };

  const updateQuantity = (index, quantity) =>
    setCart((current) =>
      quantity < 1 ? current.filter((_, i) => i !== index) : current.map((item, i) => (i === index ? { ...item, quantity } : item))
    );

  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

  // Open modal if URL has #login, #register, etc.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '').split('?')[0];
    if (['login', 'register', 'forgot-password', 'reset-password'].includes(hash)) {
      openAuthModal(hash);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn && ['profile', 'orders'].includes(page)) {
      openAuthModal('login');
      window.location.hash = 'home';
    }
  }, [isLoggedIn, page]);

  let content;
  if (page === 'profile' && isLoggedIn) content = <ProfilePage />;
  else if (page === 'orders' && isLoggedIn) content = <OrdersPage />;
  else if (page === 'products' || page === 'mattresses')
    content = <MattressesPage products={filteredCatalog.filter(p => !p.productSection || p.productSection === 'MATTRESS')} addToCart={handleAddToCart} />;
  else if (page === 'pillows-protectors')
    content = <PillowsProtectorsPage products={catalog.filter(p => p.productSection === 'PILLOWS_ACCESSORIES')} addToCart={handleAddToCart} />;
  else if (page === 'sofa-cum-bed')
    content = <SofaCumBedPage products={catalog.filter(p => p.productSection === 'SOFA_CUM_BED')} addToCart={handleAddToCart} />;
  else if (page === 'find-showroom')
    content = <FindShowroomPage />;
  else if (page === 'sleep-advice')
    content = <SleepAdvicePage />;
  else if (page === 'distributor')
    content = <DistributorPage />;
  else if (page === 'wishlist')
    content = <WishlistPage products={catalog} onNavigate={changePage} addToCart={handleAddToCart} />;
  else if (page === 'offers')
    content = <OffersPage onNavigate={changePage} />;
  else if (page.startsWith('product/'))
    content = <ProductDetailPage id={page.replace('product/', '')} products={catalog} addToCart={handleAddToCart} />;
  else if (page === 'about') content = <Storefront view="about" onNavigate={changePage} />;
  else if (page === 'gallery') content = <Storefront view="gallery" products={catalog} />;
  else if (page === 'warranty') content = <Storefront view="warranty" onNavigate={changePage} />;
  else if (page === 'contact') content = <Storefront view="contact" />;
  else if (page === 'cart')
    content = <Storefront view="cart" cart={cart} updateQuantity={updateQuantity} onNavigate={changePage} />;
  else if (page === 'checkout') content = <Storefront view="checkout" cart={cart} onNavigate={changePage} />;
  else if (page === 'admin') content = <Storefront view="admin" products={catalog} setProducts={updateCatalog} />;
  else content = <Home products={catalog} categories={categories} onBrowse={() => changePage('mattresses')} onAddToCart={handleAddToCart} />;


  return (
    <>
      <Header
        cartCount={cartCount}
        categories={categories}
        catalog={catalog}
        onNavigate={changePage}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <main>{content}</main>
      <Footer />
      <WhatsAppButton />
      
      {/* Luxury Redesigned Authentication Modal */}
      <AuthModal />

      {/* Global Toast Feedback */}
      {toastMessage && (
        <div className="somnera-toast-notification">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#241132" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [page, setPage] = useState(pageFromHash());
  const [cart, setCart] = useState([]);
  const [catalog, setCatalog] = useState(getStoredProducts);
  const [categories, setCategories] = useState(getStoredCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => sessionStorage.getItem('somnera-admin') === 'true');

  useEffect(() => {
    const syncHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', syncHash);

    const syncCatalog = () => setCatalog(getStoredProducts());
    window.addEventListener('somnera_products_changed', syncCatalog);
    const syncCategories = () => setCategories(getStoredCategories());
    window.addEventListener('somnera_categories_changed', syncCategories);

    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('somnera_products_changed', syncCatalog);
      window.removeEventListener('somnera_categories_changed', syncCategories);
    };
  }, []);

  if (window.location.pathname.startsWith('/admin')) {
    return (
      <AdminPanel
        loggedIn={adminLoggedIn}
        onLogin={() => {
          sessionStorage.setItem('somnera-admin', 'true');
          setAdminLoggedIn(true);
        }}
        onLogout={() => {
          sessionStorage.removeItem('somnera-admin');
          setAdminLoggedIn(false);
        }}
      />
    );
  }

  const handleAddToCartSuccess = (item) => {
    setCart((current) => {
      const index = current.findIndex(
        (entry) => entry.id === item.id && entry.size === item.size && entry.thickness === item.thickness
      );
      if (index < 0) return [...current, { ...item, quantity: 1 }];
      return current.map((entry, i) => (i === index ? { ...entry, quantity: entry.quantity + 1 } : entry));
    });
  };

  return (
    <AuthProvider onAddToCartSuccess={handleAddToCartSuccess}>
      <MainAppContent
        cart={cart}
        setCart={setCart}
        catalog={catalog}
        setCatalog={setCatalog}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        page={page}
        setPage={setPage}
      />
    </AuthProvider>
  );
}
