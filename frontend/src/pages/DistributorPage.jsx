import { useState } from 'react';
import { submitDistributorRequest } from '../utils/distributorService';
import './DistributorPage.css';

export function DistributorPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    targetCity: '',
    investmentRange: '₹5 Lakh – ₹10 Lakh',
    businessExperience: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const investmentOptions = [
    '₹5 Lakh – ₹10 Lakh',
    '₹10 Lakh – ₹20 Lakh',
    '₹20 Lakh – ₹30 Lakh',
    '₹30 Lakh – ₹50 Lakh',
    '₹50 Lakh+',
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone Number is required';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.targetCity.trim()) errs.targetCity = 'Target City / Location is required';
    if (!formData.investmentRange) errs.investmentRange = 'Please select an investment range';
    if (!formData.businessExperience.trim()) errs.businessExperience = 'Business experience description is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitDistributorRequest(formData);
      if (res.success) {
        setSubmitStatus({
          type: 'success',
          message: res.message || 'Thank you! Your distributor request has been submitted successfully. Our team will contact you soon.',
        });
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          targetCity: '',
          investmentRange: '₹5 Lakh – ₹10 Lakh',
          businessExperience: '',
        });
        setErrors({});
      } else {
        setSubmitStatus({
          type: 'error',
          message: res.message || 'Failed to submit distributor request. Please try again.',
        });
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="distributor-page">
      {/* Header Banner */}
      <div className="distributor-header-banner">
        <div className="container">
          <span className="distributor-kicker">SOMNERA PARTNERSHIP NETWORK</span>
          <h1 className="distributor-hero-title">Become Our Distributor</h1>
          <p className="distributor-hero-sub">
            Partner with Somnera and grow with a trusted mattress and sleep solutions brand. Fill out the partnership form below and our expansion team will contact you.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="container distributor-content-container">
        <div className="distributor-card">
          <div className="distributor-card-header">
            <div className="badge-icon">🤝</div>
            <h2>Distributor Partnership Application</h2>
            <p>Join our nationwide network of authorized distributors and mattress retail partners.</p>
          </div>

          {submitStatus && (
            <div className={`distributor-status-alert ${submitStatus.type}`}>
              <span className="alert-icon">{submitStatus.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{submitStatus.message}</span>
            </div>
          )}

          <form className="distributor-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid-two">
              {/* Full Name */}
              <div className="form-field-wrapper">
                <label htmlFor="dist-fullName">Full Name <span className="req">*</span></label>
                <input
                  id="dist-fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'has-error' : ''}
                />
                {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
              </div>

              {/* Email Address */}
              <div className="form-field-wrapper">
                <label htmlFor="dist-email">Email Address <span className="req">*</span></label>
                <input
                  id="dist-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'has-error' : ''}
                />
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              {/* Phone Number */}
              <div className="form-field-wrapper">
                <label htmlFor="dist-phone">Phone Number <span className="req">*</span></label>
                <input
                  id="dist-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'has-error' : ''}
                />
                {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
              </div>

              {/* Target City / Location */}
              <div className="form-field-wrapper">
                <label htmlFor="dist-targetCity">Target City / Location <span className="req">*</span></label>
                <input
                  id="dist-targetCity"
                  name="targetCity"
                  type="text"
                  placeholder="e.g. Mumbai, Pune, Ahmedabad"
                  value={formData.targetCity}
                  onChange={handleChange}
                  className={errors.targetCity ? 'has-error' : ''}
                />
                {errors.targetCity && <span className="field-error-msg">{errors.targetCity}</span>}
              </div>
            </div>

            {/* Investment Range */}
            <div className="form-field-wrapper full-width">
              <label htmlFor="dist-investmentRange">Investment Range <span className="req">*</span></label>
              <select
                id="dist-investmentRange"
                name="investmentRange"
                value={formData.investmentRange}
                onChange={handleChange}
                className={errors.investmentRange ? 'has-error' : ''}
              >
                {investmentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.investmentRange && <span className="field-error-msg">{errors.investmentRange}</span>}
            </div>

            {/* Business Experience */}
            <div className="form-field-wrapper full-width">
              <label htmlFor="dist-businessExperience">Business Experience <span className="req">*</span></label>
              <textarea
                id="dist-businessExperience"
                name="businessExperience"
                rows="4"
                placeholder="Tell us about your business experience or current business."
                value={formData.businessExperience}
                onChange={handleChange}
                className={errors.businessExperience ? 'has-error' : ''}
              />
              {errors.businessExperience && <span className="field-error-msg">{errors.businessExperience}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="distributor-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-dot"></span> Submitting...
                </>
              ) : (
                <>
                  SUBMIT DISTRIBUTOR REQUEST <span className="arrow-icon">↗</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
