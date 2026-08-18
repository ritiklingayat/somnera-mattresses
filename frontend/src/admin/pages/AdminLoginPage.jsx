import { useState } from 'react';

export default function AdminLoginPage({ onLogin }) {
  const [hasError, setHasError] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get('id') === 'admin' && form.get('password') === 'admin') onLogin();
    else setHasError(true);
  };
  return (
    <main className="admin-login">
      <div className="login-split-container">
        <div className="login-visual">
          <div className="visual-content">
            <h2>Crafting Comfort.</h2>
            <p>Welcome back to the Somnera operations center. Manage your catalog, orders, and experiences.</p>
          </div>
        </div>
        <section className="login-form-container">
          <div className="admin-mark">S</div>
          <span>Somnera commerce</span>
          <h1>Admin portal</h1>
          <p>Sign in to your secure workspace.</p>
          <form onSubmit={handleSubmit}>
            <label>Admin ID<input name="id" autoComplete="username" placeholder="Enter admin ID" /></label>
            <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Enter password" /></label>
            {hasError && <p className="login-error">Incorrect ID or password.</p>}
            <button>Sign in <b>→</b></button>
          </form>
          <small>Demo access: admin / admin</small>
        </section>
      </div>
    </main>
  );
}
