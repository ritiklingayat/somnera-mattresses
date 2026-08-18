import {
  apiRequest,
} from '../../services/api';


/**
 * Somnera Mattress
 * Authentication API Service
 *
 * IMPORTANT:
 *
 * Phase 1 only centralizes API communication.
 *
 * Exact authentication endpoint/DTO corrections
 * will be done during PHASE 2.
 */


/*
==================================================
LOGIN
==================================================
*/

export async function loginApi({
  email,
  password,
}) {
  return apiRequest(
    '/api/auth/login',
    'POST',
    {
      email,
      password,
    },
  );
}


/*
==================================================
REGISTER
==================================================
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
  return apiRequest(
    '/api/auth/register',
    'POST',
    {
      firstName,
      lastName,
      email,
      mobile,
      password,
      confirmPassword,
      otp,
    },
  );
}


/*
==================================================
REGISTRATION OTP
==================================================

NOTE:
Exact backend endpoint correction will be
handled in Phase 2.
*/

export async function generateRegistrationOtpApi(
  email,
) {
  return apiRequest(
    '/api/auth/send-otp',
    'POST',
    {
      email,
    },
  );
}


/*
==================================================
LEGACY OTP FUNCTIONS
==================================================

These currently belong to the existing frontend
flow.

They will be corrected/removed in Phase 2 after
matching the real Spring Boot authentication flow.
*/

export async function sendOtpApi(
  target,
  purpose = 'REGISTER',
) {
  return apiRequest(
    '/api/auth/send-otp',
    'POST',
    {
      target,
      purpose,
    },
  );
}


export async function verifyOtpApi(
  target,
  otp,
  purpose = 'REGISTER',
) {
  return apiRequest(
    '/api/auth/verify-otp',
    'POST',
    {
      target,
      otp,
      purpose,
    },
  );
}


export async function resendOtpApi(
  target,
  purpose = 'REGISTER',
) {
  return sendOtpApi(
    target,
    purpose,
  );
}


/*
==================================================
FORGOT PASSWORD
==================================================
*/

export async function forgotPasswordApi({
  email,
}) {
  return apiRequest(
    '/api/auth/forgot-password',
    'POST',
    {
      email,
    },
  );
}


/*
==================================================
RESET PASSWORD
==================================================

NOTE:
Current frontend expects token-based reset.

Backend actually uses:
email + otp + newPassword + confirmPassword

This will be corrected in Phase 2.
*/

export async function resetPasswordApi({
  token,
  newPassword,
  confirmPassword,
}) {
  return apiRequest(
    '/api/auth/reset-password',
    'POST',
    {
      token,
      newPassword,
      confirmPassword,
    },
  );
}


/*
==================================================
CURRENT USER
==================================================

Actual endpoint will be finalized in Phase 2.
*/

export async function getCurrentUserApi() {

  const endpoint =
    import.meta.env
      .VITE_PROFILE_ENDPOINT;

  if (!endpoint) {
    return null;
  }

  return apiRequest(endpoint);
}


/*
==================================================
MY ORDERS
==================================================

This will be properly integrated during
Phase 8.
*/

export async function getMyOrdersApi() {

  const endpoint =
    import.meta.env
      .VITE_MY_ORDERS_ENDPOINT;

  if (!endpoint) {
    throw new Error(
      'Backend support required: ' +
      'configure an authenticated ' +
      'current-user orders endpoint.',
    );
  }

  return apiRequest(endpoint);
}