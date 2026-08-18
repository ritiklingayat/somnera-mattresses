import {
  apiRequest,
} from './api';


/*
==================================================
GET ALL CATEGORIES
==================================================

Backend:
GET /api/categories
*/

export async function getCategoriesApi() {

  const response =
    await apiRequest(
      '/api/categories',
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
GET CATEGORY BY ID
==================================================
*/

export async function getCategoryByIdApi(
  categoryId,
) {

  const response =
    await apiRequest(
      `/api/categories/${categoryId}`,
      'GET',
    );


  return response?.data ?? null;
}


/*
==================================================
GET ALL PRODUCTS
==================================================

Backend:
GET /api/products
*/

export async function getProductsApi() {

  const response =
    await apiRequest(
      '/api/products',
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
GET PRODUCT BY ID
==================================================
*/

export async function getProductByIdApi(
  productId,
) {

  const response =
    await apiRequest(
      `/api/products/${productId}`,
      'GET',
    );


  return response?.data ?? null;
}