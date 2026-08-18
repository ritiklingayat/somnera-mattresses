import api, {
  getApiErrorMessage,
} from '../../services/api';

import {
  mapProductFromApi,
} from '../../utils/catalogMapper';


/*
==================================================
PRODUCT SECTION MAPPING
==================================================

Frontend:
MATTRESS

Backend:
MATTRESSES
*/

function mapSectionToBackend(
  section,
) {

  if (
    section ===
    'MATTRESS'
  ) {

    return 'MATTRESSES';
  }


  return section;
}


/*
==================================================
NUMBER HELPER
==================================================
*/

function nullableNumber(
  value,
) {

  if (
    value === '' ||
    value === null ||
    value === undefined
  ) {

    return null;
  }


  const parsed =
    Number(value);


  return Number.isNaN(parsed)
    ? null
    : parsed;
}


/*
==================================================
BUILD BACKEND PRODUCT DTO
==================================================
*/

export function buildProductRequest(
  draft,
) {

  return {

    productName:
      draft.name.trim(),

    productSection:
      mapSectionToBackend(
        draft.productSection,
      ),

    badge:
      draft.badge?.trim() ||
      null,

    categoryId:
      Number(
        draft.categoryId,
      ),

    subCategoryId:
      Number(
        draft.subCategoryId,
      ),

    warranty:
      draft.warranty?.trim() ||
      null,

    shortDescription:
      draft.description?.trim() ||
      null,

    materials:
      draft.materials?.trim() ||
      null,

    shopByNeed:
      Array.isArray(
        draft.needs,
      )
        ? draft.needs
        : [],

    shopByUser:
      Array.isArray(
        draft.userTypes,
      )
        ? draft.userTypes
        : [],

    shopByTech:
      Array.isArray(
        draft.tech,
      )
        ? draft.tech
        : [],

    mattressFeel:
      Array.isArray(
        draft.feels,
      )
        ? draft.feels
        : [],

    firmness:
      draft.firmness?.trim() ||
      null,

    price4Inch:
      nullableNumber(
        draft.price4,
      ),

    price5Inch:
      nullableNumber(
        draft.price5,
      ),

    price6Inch:
      nullableNumber(
        draft.price6,
      ),

    price8Inch:
      nullableNumber(
        draft.price8,
      ),

  };
}


/*
==================================================
BUILD MULTIPART FORM DATA
==================================================
*/

function buildProductFormData(
  productRequest,
  imageFile,
) {

  const formData =
    new FormData();


  /*
   * Critical:
   * Spring Boot @RequestPart("product")
   * expects JSON content, not a plain string part.
   */

  const productBlob =
    new Blob(
      [
        JSON.stringify(
          productRequest,
        ),
      ],
      {
        type:
          'application/json',
      },
    );


  formData.append(
    'product',
    productBlob,
  );


  if (imageFile) {

    formData.append(
      'image',
      imageFile,
    );
  }


  return formData;
}


/*
==================================================
GET PRODUCTS
==================================================
*/

export async function getAdminProductsApi() {

  try {

    const response =
      await api.get(
        '/api/products',
      );


    const products =
      Array.isArray(
        response.data?.data,
      )
        ? response.data.data
        : [];


    return products
      .map(
        mapProductFromApi,
      )
      .filter(Boolean);


  } catch (error) {

    throw new Error(
      getApiErrorMessage(
        error,
        'Unable to load products.',
      ),
    );
  }
}


/*
==================================================
ADD PRODUCT
==================================================
*/

export async function addAdminProductApi(
  draft,
  imageFile,
) {

  if (!imageFile) {

    throw new Error(
      'Product image is required.',
    );
  }


  const request =
    buildProductRequest(
      draft,
    );


  const formData =
    buildProductFormData(
      request,
      imageFile,
    );


  try {

    const response =
      await api.post(
        '/api/products',
        formData,
      );


    return mapProductFromApi(
      response.data?.data,
    );


  } catch (error) {

    throw new Error(
      getApiErrorMessage(
        error,
        'Unable to add product.',
      ),
    );
  }
}


/*
==================================================
UPDATE PRODUCT
==================================================
*/

export async function updateAdminProductApi(
  productId,
  draft,
  imageFile = null,
) {

  const request =
    buildProductRequest(
      draft,
    );


  const formData =
    buildProductFormData(
      request,
      imageFile,
    );


  try {

    const response =
      await api.put(
        `/api/products/${productId}`,
        formData,
      );


    return mapProductFromApi(
      response.data?.data,
    );


  } catch (error) {

    throw new Error(
      getApiErrorMessage(
        error,
        'Unable to update product.',
      ),
    );
  }
}


/*
==================================================
DELETE PRODUCT
==================================================
*/

export async function deleteAdminProductApi(
  productId,
) {

  try {

    await api.delete(
      `/api/products/${productId}`,
    );


  } catch (error) {

    throw new Error(
      getApiErrorMessage(
        error,
        'Unable to delete product.',
      ),
    );
  }
}