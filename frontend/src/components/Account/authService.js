/**
 * Somnera Mattress - Authentication API Service
 * Endpoint mappings matching exact backend DTOs:
 * - LoginRequest: { email, password }
 * - RegisterRequest: { firstName, lastName, email, mobile, password, confirmPassword, otp }
 * - GenerateOtpRequest: { email }
 * - ForgotPasswordRequest: { email }
 * - ResetPasswordRequest: { token, newPassword, confirmPassword }
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Helper for backend API calls with JSON headers & JWT token propagation
 */
export async function apiRequest(endpoint, method = 'GET', data = null, customHeaders = {}) {
  const token = localStorage.getItem('somnera_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const config = {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        result?.message || result?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }
    return result;
  } catch (error) {
    console.warn(`[Somnera Auth API ${method} ${endpoint}]:`, error.message);
    if (error instanceof TypeError || /failed to fetch|networkerror/i.test(error.message)) {
      throw new Error('Unable to connect to Somnera. Please try again.');
    }
    throw error;
  }
}

/**
 * 1. LOGIN API
 * Backend DTO: LoginRequest { email, password }
 */
export async function loginApi({ email, password }) {
  return apiRequest('/auth/login', 'POST', { email, password });
}

/**
 * 2. REGISTER API
 * Backend DTO: RegisterRequest { firstName, lastName, email, mobile, password, confirmPassword, otp }
 */
export async function registerApi({
  firstName,
  lastName,
  email,
  mobile,
  password,
  confirmPassword,
  otp,
}) {
  return apiRequest('/auth/register', 'POST', {
      firstName,
      lastName,
      email,
      mobile,
      password,
      confirmPassword,
      otp,
  });
}

/**
 * 3. GENERATE REGISTRATION OTP API
 * Backend DTO: { email }
 * Sends OTP to the provided email for account registration.
 */
export async function generateRegistrationOtpApi(email) {
  return apiRequest('/auth/send-otp', 'POST', { email });
}

/**
 * 4. SEND OTP API (legacy — used by ForgotPassword flow via AuthContext)
 */
export async function sendOtpApi(target, purpose = 'REGISTER') {
  return apiRequest('/auth/send-otp', 'POST', { target, purpose });
}

/**
 * 5. VERIFY OTP API
 */
export async function verifyOtpApi(target, otp, purpose = 'REGISTER') {
  return apiRequest('/auth/verify-otp', 'POST', { target, otp, purpose });
}

/**
 * 6. RESEND OTP API
 */
export async function resendOtpApi(target, purpose = 'REGISTER') {
  return sendOtpApi(target, purpose);
}

/**
 * 7. FORGOT PASSWORD API
 * Backend DTO: ForgotPasswordRequest { email }
 */
export async function forgotPasswordApi({ email }) {
  return apiRequest('/auth/forgot-password', 'POST', { email });
}

/**
 * 8. RESET PASSWORD API
 * Backend DTO: ResetPasswordRequest { token, newPassword, confirmPassword }
 */
export async function resetPasswordApi({ token, newPassword, confirmPassword }) {
  return apiRequest('/auth/reset-password', 'POST', {
      token,
      newPassword,
      confirmPassword,
  });
}

/**
 * Account endpoints vary between backend implementations. They are opt-in so
 * this frontend never guesses an insecure user-id based URL.
 */
export async function getCurrentUserApi() {
  const endpoint = import.meta.env?.VITE_PROFILE_ENDPOINT;
  if (!endpoint) return null;
  return apiRequest(endpoint);
}

export async function getMyOrdersApi() {
  const endpoint = import.meta.env?.VITE_MY_ORDERS_ENDPOINT;
  if (!endpoint) {
    throw new Error('Backend support required: configure VITE_MY_ORDERS_ENDPOINT with an authenticated current-user orders endpoint.');
  }
  return apiRequest(endpoint);
}
