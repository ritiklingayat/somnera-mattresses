import {
  apiRequest,
} from '../../services/api';


/*
==================================================
LOGIN
==================================================
Backend:
POST /api/auth/login

Request:
{
  email,
  password
}

Backend wrapper:
{
  success,
  message,
  data: {
    token,
    tokenType,
    userId,
    firstName,
    lastName,
    email,
    role
  },
  timestamp
}
*/

export async function loginApi({
  email,
  password,
}) {
  const response =
    await apiRequest(
      '/api/auth/login',
      'POST',
      {
        email,
        password,
      },
    );

  return response.data;
}


/*
==================================================
SEND REGISTRATION OTP
==================================================
Backend:
POST /api/auth/send-registration-otp

Request:
{
  email
}
*/

export async function generateRegistrationOtpApi(
  email,
) {
  return apiRequest(
    '/api/auth/send-registration-otp',
    'POST',
    {
      email,
    },
  );
}


/*
==================================================
REGISTER
==================================================
Backend:
POST /api/auth/register
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
  const response =
    await apiRequest(
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

  return response.data;
}


/*
==================================================
FORGOT PASSWORD
==================================================
Backend:
POST /api/auth/forgot-password

This API generates and emails the reset OTP.
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
Backend:
POST /api/auth/reset-password

There is NO separate forgot-password
OTP verification API.

OTP is verified while resetting the password.
*/

export async function resetPasswordApi({
  email,
  otp,
  newPassword,
  confirmPassword,
}) {
  return apiRequest(
    '/api/auth/reset-password',
    'POST',
    {
      email,
      otp,
      newPassword,
      confirmPassword,
    },
  );
}


/*
==================================================
CURRENT LOGGED-IN USER
==================================================
Backend:
GET /api/users/me
*/

export async function getCurrentUserApi() {
  const response =
    await apiRequest(
      '/api/users/me',
      'GET',
    );

  return response.data;
}


/*
==================================================
MY ORDERS
==================================================

Backend:
GET /api/orders

Full order integration will be completed
during Phase 8.

We keep this function now because the existing
OrdersPage.jsx already imports it.
*/

export async function getMyOrdersApi() {
  const response =
    await apiRequest(
      '/api/orders',
      'GET',
    );

  return response.data;
}

/*
==================================================
MY ORDER BY ID
==================================================

Backend:
GET /api/orders/{orderId}

Backend automatically verifies that the
requested order belongs to the authenticated user.
*/

export async function getMyOrderByIdApi(
  orderId,
) {

  const response =
    await apiRequest(
      `/api/orders/${orderId}`,
      'GET',
    );


  return response.data;
}