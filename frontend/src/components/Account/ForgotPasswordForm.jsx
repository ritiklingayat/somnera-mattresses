import { useState } from 'react';
import { useAuth } from './AuthContext';
import OtpInput from './OtpInput';

export default function ForgotPasswordForm() {
  const { forgotPassword, verifyOtp, resendOtp, resetPassword, setModalView } = useAuth();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Set New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // STEP 1: EMAIL SUBMIT (ForgotPasswordRequest)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const em = email.trim();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(em);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: OTP VERIFICATION
  const handleOtpComplete = async (otpCode) => {
    setError('');
    setOtp(otpCode);
    try {
      setLoading(true);
      await verifyOtp(email.trim(), otpCode, 'FORGOT_PASSWORD');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid OTP code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: RESET PASSWORD SUBMIT (ResetPasswordRequest DTO: token, newPassword, confirmPassword)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 8 || newPassword.length > 100) {
      setError('Password must be between 8 and 100 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Confirm password does not match.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(newPassword, confirmPassword);
      setStep(4);
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError('');
      await resendOtp(email.trim(), 'FORGOT_PASSWORD');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="auth-form-view">
      <div className="auth-header">
        <h2>{step === 4 ? 'Password Updated!' : 'Reset Password'}</h2>
        <p>
          {step === 1 && 'Enter your registered email address to receive an OTP.'}
          {step === 2 && `Enter the 6-digit verification code sent to ${email}`}
          {step === 3 && 'Create a new secure password for your Somnera account.'}
          {step === 4 && 'Your password has been changed successfully. You can now login.'}
        </p>
      </div>

      {error && (
        <div className="auth-alert auth-alert-error" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: EMAIL ADDRESS */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="forgot-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP / Continue →'}
          </button>
        </form>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 2 && (
        <div className="step-form">
          <OtpInput onComplete={handleOtpComplete} onResend={handleResend} length={6} />

          {loading && (
            <div className="loading-status">
              <span className="spinner" /> Verifying OTP...
            </div>
          )}

          <button type="button" className="auth-back-btn mt-4" onClick={() => setStep(1)}>
            ← Back to Email
          </button>
        </div>
      )}

      {/* STEP 3: SET NEW PASSWORD */}
      {step === 3 && (
        <form onSubmit={handleResetSubmit} noValidate className="step-form">
          <div className="form-group">
            <label htmlFor="new-password">Set New Password *</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label="Toggle password visibility"
              >
                {showNewPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-new-password">Confirm Password *</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      )}

      {/* STEP 4: SUCCESS */}
      {step === 4 && (
        <div className="auth-success-box">
          <div className="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#241132" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>Password Updated Successfully</h3>
          <p>You can now log in using your new password.</p>

          <button type="button" className="auth-submit-btn" onClick={() => setModalView('login')}>
            Login Now
          </button>
        </div>
      )}

      {step !== 4 && (
        <div className="auth-footer-prompt">
          <span>Remember your password?</span>
          <button type="button" className="link-btn-accent" onClick={() => setModalView('login')}>
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
