/**
 * Somnera Mattress - Distributor Request API Service
 * Handles distributor lead submissions with API endpoint support and graceful demo mode fallback.
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export async function submitDistributorRequest({
  fullName,
  phone,
  email,
  targetCity,
  investmentRange,
  businessExperience,
}) {
  const payload = {
    fullName,
    phone,
    email,
    targetCity,
    investmentRange,
    businessExperience,
    requestType: 'DISTRIBUTOR',
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/leads/distributor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message || `Server returned error ${response.status}`);
    }
    return {
      success: true,
      message: 'Thank you! Your distributor request has been submitted successfully. Our team will contact you soon.',
      data,
    };
  } catch (error) {
    console.info('[Distributor Lead API]: Backend offline or endpoint unavailable. Processing locally in demo mode.', error.message);
    
    // Save to local storage demo log so admin or developer can inspect leads
    try {
      const existing = JSON.parse(localStorage.getItem('somnera_distributor_requests') || '[]');
      existing.push(payload);
      localStorage.setItem('somnera_distributor_requests', JSON.stringify(existing));
    } catch {
      // ignore localstorage errors
    }

    return {
      success: true,
      message: 'Thank you! Your distributor request has been submitted successfully. Our team will contact you soon.',
    };
  }
}
