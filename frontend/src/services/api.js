import axios from 'axios';

/*
==================================================
SOMNERA COMMON API CLIENT
==================================================

Local:
VITE_API_BASE_URL=http://localhost:8082

Later production:
VITE_API_BASE_URL=https://your-backend-url.com
*/

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8082';

export const AUTH_TOKEN_KEY =
  'somnera_auth_token';

export const AUTH_USER_KEY =
  'somnera_auth_user';


/*
==================================================
AXIOS INSTANCE
==================================================
*/

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    Accept: 'application/json',
  },

  timeout: 30000,
});


/*
==================================================
REQUEST INTERCEPTOR
==================================================

Automatically attaches:

Authorization: Bearer <token>

for authenticated API requests.
*/

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);


/*
==================================================
RESPONSE INTERCEPTOR
==================================================
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    /*
    ==============================================
    401 - INVALID / EXPIRED JWT
    ==============================================
    */

    if (error.response?.status === 401) {
      localStorage.removeItem(
        AUTH_TOKEN_KEY,
      );

      localStorage.removeItem(
        AUTH_USER_KEY,
      );

      window.dispatchEvent(
        new Event('somnera:unauthorized'),
      );
    }

    return Promise.reject(error);
  },
);


/*
==================================================
ERROR MESSAGE HELPER
==================================================
*/

export function getApiErrorMessage(
  error,
  fallbackMessage = 'Something went wrong. Please try again.',
) {

  /*
  Backend returned an error response
  */

  if (error.response) {
    const backendData =
      error.response.data;

    if (
      typeof backendData?.message ===
        'string' &&
      backendData.message.trim()
    ) {
      return backendData.message;
    }

    if (
      typeof backendData?.error ===
        'string' &&
      backendData.error.trim()
    ) {
      return backendData.error;
    }

    /*
    Validation errors may sometimes come
    as an object/map.
    */

    if (
      backendData?.errors &&
      typeof backendData.errors ===
        'object'
    ) {
      const firstError =
        Object.values(
          backendData.errors,
        )[0];

      if (
        typeof firstError ===
        'string'
      ) {
        return firstError;
      }
    }

    if (error.response.status === 401) {
      return (
        'Your session has expired. ' +
        'Please login again.'
      );
    }

    if (error.response.status === 403) {
      return (
        'You are not authorized to perform this action.'
      );
    }

    if (error.response.status === 404) {
      return (
        backendData?.message ||
        'Requested resource was not found.'
      );
    }

    if (
      error.response.status >= 500
    ) {
      return (
        backendData?.message ||
        'Server error. Please try again.'
      );
    }
  }


  /*
  ==============================================
  NO RESPONSE FROM SERVER
  ==============================================
  */

  if (error.request) {
    return (
      'Unable to connect to the Somnera server. ' +
      'Please check that the backend is running.'
    );
  }


  /*
  ==============================================
  AXIOS / JAVASCRIPT ERROR
  ==============================================
  */

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
}


/*
==================================================
COMMON REQUEST HELPER
==================================================

This helper is intentionally compatible with the
existing authService API style:

apiRequest(endpoint, method, data)

Example:

apiRequest(
  '/api/auth/login',
  'POST',
  {
    email,
    password,
  }
)
*/

export async function apiRequest(
  endpoint,
  method = 'GET',
  data = null,
  customHeaders = {},
) {
  try {
    const config = {
      url: endpoint,
      method,
      headers: customHeaders,
    };

    if (data !== null) {
      config.data = data;
    }

    const response =
      await api.request(config);

    return response.data;

  } catch (error) {

    const message =
      getApiErrorMessage(error);

    console.error(
      `[Somnera API ${method} ${endpoint}]`,
      error,
    );

    const apiError =
      new Error(message);

    apiError.status =
      error.response?.status;

    apiError.data =
      error.response?.data;

    throw apiError;
  }
}

export default api;