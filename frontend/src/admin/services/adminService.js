import {
  apiRequest,
} from '../../services/api';


/*
==================================================
ADMIN CUSTOMERS
==================================================

Backend:
GET /api/admin/customers
*/

export async function getAdminCustomersApi() {

  const response =
    await apiRequest(
      '/api/admin/customers',
      'GET',
    );


  return Array.isArray(
    response?.data,
  )
    ? response.data
    : [];
}

/*
==================================================
ADMIN ORDERS
==================================================

Backend:
GET /api/admin/orders
*/

export async function getAdminOrdersApi() {

  const response =
    await apiRequest(
      '/api/admin/orders',
      'GET',
    );


  return Array.isArray(
    response?.data,
  )
    ? response.data
    : [];
}

/*
==================================================
ADMIN DISTRIBUTOR LEADS
==================================================

Backend:
GET /api/distributor-requests

ADMIN ONLY
*/

export async function getAdminDistributorRequestsApi() {

  const response =
    await apiRequest(
      '/api/distributor-requests',
      'GET',
    );


  return Array.isArray(
    response?.data,
  )
    ? response.data
    : [];
}