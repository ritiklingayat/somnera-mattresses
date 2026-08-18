import { useMemo, useState } from 'react';
import OrderTable from '../components/OrderTable';

export default function OrdersPage({ orders, onUpdateStatus }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const matchingOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          (filter === 'All' || order.status === filter) &&
          `${order.id} ${order.name}`.toLowerCase().includes(query.toLowerCase())
      ),
    [orders, query, filter]
  );
  const printInvoice = (order) => {
    const invoice = window.open('', '_blank');
    invoice.document.write(
      `<title>Invoice ${order.id}</title><main style="font-family:Arial;padding:48px"><h1>Somnera Mattress & Foam</h1><h2>Invoice ${order.id}</h2><p><b>Customer:</b> ${order.name}</p><p>${order.product}</p><h2>₹${order.amount.toLocaleString('en-IN')}</h2><p>Status: ${order.status}</p></main>`
    );
    invoice.print();
  };
  return (
    <>
      <div className="admin-title">
        <div>
          <p>Order management</p>
          <h1>Orders</h1>
        </div>
        <button className="admin-action" onClick={() => window.print()}>
          Export orders
        </button>
      </div>
      <section className="admin-card">
        <div className="order-toolbar">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order or customer"
          />
          <div>
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
              <button
                className={filter === status ? 'active-filter' : ''}
                key={status}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <OrderTable
          orders={matchingOrders}
          editable
          onStatusChange={onUpdateStatus}
          onPrint={printInvoice}
          onRefund={(id) => onUpdateStatus(id, 'Cancelled')}
        />
      </section>
    </>
  );
}
