import axios from 'axios';


/*
==================================================
SOMNERA COMMON API CLIENT
==================================================
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
*/

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        AUTH_TOKEN_KEY,
      );


    const url =
      String(
        config.url || '',
      );


    const isAuthRequest =
      url.startsWith(
        '/api/auth/',
      );


    /*
     * Do not attach an old JWT to:
     *
     * login
     * register
     * forgot password
     * OTP APIs
     */

    if (
      token &&
      !isAuthRequest
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }


    return config;
  },


  (error) => {

    return Promise.reject(
      error,
    );
  },

);


/*
==================================================
RESPONSE INTERCEPTOR
==================================================
*/

api.interceptors.response.use(

  /*
  ================================================
  SUCCESS RESPONSE
  ================================================
  */

  (response) => {

    return response;
  },


  /*
  ================================================
  ERROR RESPONSE
  ================================================
  */

  (error) => {

    const status =
      error.response?.status;


    const requestUrl =
      String(
        error.config?.url ||
        '',
      );


    const isAuthRequest =
      requestUrl.startsWith(
        '/api/auth/',
      );


    const token =
      localStorage.getItem(
        AUTH_TOKEN_KEY,
      );


    /*
    ==============================================
    401 - INVALID / EXPIRED JWT
    ==============================================

    Important:

    Wrong password on /api/auth/login
    must NOT clear session as an
    "expired session".

    Only protected API failures should
    trigger automatic logout.
    */

    if (
      status === 401 &&
      token &&
      !isAuthRequest
    ) {

      localStorage.removeItem(
        AUTH_TOKEN_KEY,
      );


      localStorage.removeItem(
        AUTH_USER_KEY,
      );


      window.dispatchEvent(
        new Event(
          'somnera:unauthorized',
        ),
      );
    }


    return Promise.reject(
      error,
    );
  },

);


/*
==================================================
API ERROR MESSAGE HELPER
==================================================
*/

export function getApiErrorMessage(
  error,
  fallbackMessage =
    'Something went wrong. Please try again.',
) {

  /*
  ================================================
  BACKEND RETURNED RESPONSE
  ================================================
  */

  if (error.response) {

    const backendData =
      error.response.data;


    /*
     * Spring Boot ApiResponse message
     */

    if (
      typeof backendData?.message ===
        'string' &&
      backendData.message.trim()
    ) {

      return backendData.message;
    }


    /*
     * Generic backend error field
     */

    if (
      typeof backendData?.error ===
        'string' &&
      backendData.error.trim()
    ) {

      return backendData.error;
    }


    /*
     * Validation errors
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


    /*
     * HTTP status fallbacks
     */

    if (
      error.response.status ===
        401
    ) {

      return (
        backendData?.message ||
        'Invalid email or password.'
      );
    }


    if (
      error.response.status ===
        403
    ) {

      return (
        backendData?.message ||
        'You are not authorized to perform this action.'
      );
    }


    if (
      error.response.status ===
        404
    ) {

      return (
        backendData?.message ||
        'Requested resource was not found.'
      );
    }


    if (
      error.response.status >=
        500
    ) {

      return (
        backendData?.message ||
        'Server error. Please try again.'
      );
    }

  }


  /*
  ================================================
  SERVER NOT REACHABLE
  ================================================
  */

  if (error.request) {

    return (
      'Unable to connect to the Somnera server. ' +
      'Please check that the backend is running.'
    );
  }


  /*
  ================================================
  JAVASCRIPT / AXIOS ERROR
  ================================================
  */

  if (error.message) {

    return error.message;
  }


  return fallbackMessage;
}


/*
==================================================
COMMON API REQUEST HELPER
==================================================
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

      headers:
        customHeaders,

    };


    if (
      data !== null
    ) {

      config.data =
        data;
    }


    const response =
      await api.request(
        config,
      );


    return response.data;


  } catch (error) {


    const message =
      getApiErrorMessage(
        error,
      );


    console.error(
      `[Somnera API ${method} ${endpoint}]`,
      error,
    );


    const apiError =
      new Error(
        message,
      );


    apiError.status =
      error.response?.status;


    apiError.data =
      error.response?.data;


    throw apiError;

  }

}


export default api;