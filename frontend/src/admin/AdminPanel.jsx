import { useEffect, useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import useAdminRoute from './hooks/useAdminRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import OverviewPage from './pages/OverviewPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ModulePage from './pages/ModulePage';
import { initialOrders, moduleConfig } from './data/seedData';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredCategories,
  saveStoredCategories,
} from '../utils/storage';
import './AdminPanel.css';

export default function AdminPanel({ loggedIn, onLogin, onLogout }) {
  const [route, navigate] = useAdminRoute();
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(getStoredProducts);
  const [categories, setCategories] = useState(getStoredCategories);
  const [genericModules, setGenericModules] = useState({
    customers: [],
    coupons: [],
    reviews: [],
    leads: [],
    settings: [],
  });

  useEffect(() => {
    const sync = () => {
      setProducts(getStoredProducts());
      setCategories(getStoredCategories());
    };
    window.addEventListener('somnera_products_changed', sync);
    window.addEventListener('somnera_categories_changed', sync);
    return () => {
      window.removeEventListener('somnera_products_changed', sync);
      window.removeEventListener('somnera_categories_changed', sync);
    };
  }, []);

  if (!loggedIn) return <AdminLoginPage onLogin={onLogin} />;

  const updateOrderStatus = (id, status) =>
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    );

  // Product handlers
  const addProduct = (product) => {
    const updated = [...products, product];
    setProducts(updated);
    saveStoredProducts(updated);
  };
  const updateProduct = (product) => {
    const updated = products.map((item) => (item.id === product.id ? product : item));
    setProducts(updated);
    saveStoredProducts(updated);
  };
  const deleteProduct = (id) => {
    const updated = products.filter((product) => product.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  // Category handlers
  const addCategory = (category) => {
    const updated = [...categories, category];
    setCategories(updated);
    saveStoredCategories(updated);
  };
  const updateCategory = (category) => {
    const updated = categories.map((item) => (item.id === category.id ? category : item));
    setCategories(updated);
    saveStoredCategories(updated);
  };
  const deleteCategory = (id) => {
    const updated = categories.filter((item) => item.id !== id);
    setCategories(updated);
    saveStoredCategories(updated);
  };

  // Generic Module handlers
  const addRecord = (moduleName, record) => {
    setGenericModules((current) => ({
      ...current,
      [moduleName]: [...(current[moduleName] || []), record],
    }));
  };
  const updateRecord = (moduleName, record) => {
    setGenericModules((current) => ({
      ...current,
      [moduleName]: (current[moduleName] || []).map((r) => (r.id === record.id ? record : r)),
    }));
  };
  const deleteRecord = (moduleName, id) => {
    setGenericModules((current) => ({
      ...current,
      [moduleName]: (current[moduleName] || []).filter((r) => r.id !== id),
    }));
  };

  let page;
  if (route === 'overview') page = <OverviewPage orders={orders} onNavigate={navigate} />;
  else if (route === 'orders')
    page = <OrdersPage orders={orders} onUpdateStatus={updateOrderStatus} />;
  else if (route === 'products')
    page = (
      <ProductsPage
        products={products}
        categories={categories}
        onAdd={addProduct}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
      />
    );
  else if (route === 'categories')
    page = (
      <CategoriesPage
        categories={categories}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    );
  else {
    const activeModule = moduleConfig[route] ? route : 'settings';
    const activeConfig = moduleConfig[route] || moduleConfig.settings;
    page = (
      <ModulePage
        key={activeModule}
        config={activeConfig}
        records={genericModules[activeModule] || []}
        onAdd={(record) => addRecord(activeModule, record)}
        onUpdate={(record) => updateRecord(activeModule, record)}
        onDelete={(id) => deleteRecord(activeModule, id)}
      />
    );
  }

  return (
    <AdminLayout activeRoute={route} onNavigate={navigate} onLogout={onLogout}>
      {page}
    </AdminLayout>
  );
}
