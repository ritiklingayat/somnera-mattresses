import OrderTable from '../components/OrderTable';

export default function OverviewPage({ orders, onNavigate }) {
  const totalSales = orders
    .filter((order) => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.amount, 0);
  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;
  const stats = [
    ['₹' + totalSales.toLocaleString('en-IN'), 'Total sales', '↗ 12.5%'],
    [orders.length, 'Total orders', '↗ 8.2%'],
    [pendingOrders, 'Pending orders', pendingOrders ? 'Needs attention' : 'All caught up'],
    [
      '₹' + Math.round(totalSales / Math.max(orders.length, 1)).toLocaleString('en-IN'),
      'Average order value',
      '↗ 4.8%',
    ],
  ];
  return (
    <>
      <div className="admin-title">
        <div>
          <p>Store performance</p>
          <h1>Good morning, Admin.</h1>
        </div>
        <button className="admin-action" onClick={() => onNavigate('orders')}>
          View orders
        </button>
      </div>
      <div className="stat-grid">
        {stats.map(([value, label, note]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </div>
      <section className="admin-card performance">
        <div className="card-title">
          <div>
            <h2>Sales performance</h2>
            <p>Revenue in the last 7 days</p>
          </div>
          <b>₹{totalSales.toLocaleString('en-IN')}</b>
        </div>
        <div className="bar-chart">
          {[42, 66, 48, 78, 58, 90, 74].map((value, index) => (
            <div key={index}>
              <i style={{ height: `${value}%` }}></i>
              <span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-card">
        <div className="card-title">
          <div>
            <h2>Recent orders</h2>
            <p>Latest customer purchases</p>
          </div>
          <button onClick={() => onNavigate('orders')}>View all</button>
        </div>
        <OrderTable orders={orders.slice(0, 4)} />
      </section>
    </>
  );
}
