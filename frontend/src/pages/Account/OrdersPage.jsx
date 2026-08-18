import { useEffect, useState } from 'react';
import { getMyOrdersApi } from '../../components/Account/authService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import AccountLayout from './AccountLayout';

const labelStatus = (status = '') => String(status).replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const steps = String(import.meta.env?.VITE_ORDER_STATUS_STEPS || '')
  .split(',')
  .map((step) => step.trim().toUpperCase())
  .filter(Boolean);

function OrderTracker({ status }) {
  const normalized = String(status || '').toUpperCase().replaceAll(' ', '_');
  if (!steps.includes(normalized)) return null;
  const current = steps.indexOf(normalized);
  return (
    <ol className="order-tracker" aria-label={`Order status: ${labelStatus(normalized)}`}>
      {steps.map((step, index) => (
        <li key={step} className={index <= current ? 'is-complete' : ''}>
          <span aria-hidden="true" />
          <small>{labelStatus(step)}</small>
        </li>
      ))}
    </ol>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getMyOrdersApi()
      .then((result) => {
        if (active) setOrders(Array.isArray(result) ? result : result?.orders || result?.content || []);
      })
      .catch((err) => active && setError(err.message || 'Unable to load your orders. Please try again.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <AccountLayout active="orders">
      <div className="account-card">
        <p className="account-kicker">MY ORDERS</p>
        <h1>Order History</h1>
        <p className="account-card-sub">Track and review everything you've ordered.</p>
        {loading ? <LoadingSpinner label="Loading your orders..." /> : error ? (
          <div className="account-error" role="alert"><strong>Unable to load orders</strong><p>{error}</p></div>
        ) : orders.length === 0 ? (
          <div className="account-empty"><p>You haven't placed any orders yet.</p><a href="#mattresses" className="account-submit-btn">Start Shopping</a></div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const items = order.items || order.orderItems || [];
              const date = order.createdAt || order.orderDate;
              return (
                <article className="order-item" key={order.id || order.orderId}>
                  <header className="order-item__header">
                    <div><small>Order ID</small><strong>#{order.orderId || order.id}</strong></div>
                    {date ? <div><small>Ordered On</small><strong>{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div> : null}
                    <div><small>Status</small><span className={`order-status status-${String(order.status || '').toLowerCase().replaceAll('_', '-')}`}>{labelStatus(order.status)}</span></div>
                  </header>
                  <OrderTracker status={order.status} />
                  {items.map((item, index) => (
                    <div className="order-product" key={item.id || item.productId || index}>
                      {item.image || item.productImage ? <img src={item.image || item.productImage} alt="" /> : null}
                      <div><strong>{item.productName || item.name}</strong>{item.size ? <small>Size: {item.size}</small> : null}{item.thickness ? <small>Thickness: {item.thickness}</small> : null}</div>
                      <div><strong>{item.price != null ? `₹${Number(item.price).toLocaleString('en-IN')}` : ''}</strong>{item.quantity != null ? <small>Qty: {item.quantity}</small> : null}</div>
                    </div>
                  ))}
                  <footer className="order-item__footer">
                    {order.paymentMethod ? <span>Payment: <strong>{labelStatus(order.paymentMethod)}</strong></span> : null}
                    {order.totalAmount != null || order.total != null ? <span>Total: <strong>₹{Number(order.totalAmount ?? order.total).toLocaleString('en-IN')}</strong></span> : null}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
