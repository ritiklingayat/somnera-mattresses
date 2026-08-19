import {
  apiRequest,
} from './api';


/*
==================================================
MAP WISHLIST ITEM → FRONTEND PRODUCT SHAPE
==================================================
*/

function mapWishlistPrices(
  item,
) {

  const prices = {};


  if (
    item.price4Inch !==
      null &&
    item.price4Inch !==
      undefined
  ) {

    prices[4] =
      Number(
        item.price4Inch,
      );
  }


  if (
    item.price5Inch !==
      null &&
    item.price5Inch !==
      undefined
  ) {

    prices[5] =
      Number(
        item.price5Inch,
      );
  }


  if (
    item.price6Inch !==
      null &&
    item.price6Inch !==
      undefined
  ) {

    prices[6] =
      Number(
        item.price6Inch,
      );
  }


  if (
    item.price8Inch !==
      null &&
    item.price8Inch !==
      undefined
  ) {

    prices[8] =
      Number(
        item.price8Inch,
      );
  }


  return prices;
}


export function mapWishlistItemFromApi(
  item,
) {

  if (!item) {
    return null;
  }


  return {

    wishlistId:
      item.wishlistId,

    id:
      item.productId,

    productId:
      item.productId,

    name:
      item.productName || '',

    productName:
      item.productName || '',

    image:
      item.imageUrl || '',

    imageUrl:
      item.imageUrl || '',

    categoryId:
      item.categoryId,

    category:
      item.categoryName || '',

    categoryName:
      item.categoryName || '',

    subCategoryId:
      item.subCategoryId,

    subcategory:
      item.subCategoryName || '',

    subCategoryName:
      item.subCategoryName || '',

    badge:
      item.badge || '',

    warranty:
      item.warranty || '',

    firmness:
      item.firmness || '',

    description:
      item.shortDescription || '',

    shortDescription:
      item.shortDescription || '',

    materials:
      typeof item.materials ===
        'string'
        ? item.materials
            .split(',')
            .map(
              (value) =>
                value.trim(),
            )
            .filter(Boolean)
        : [],

    prices:
      mapWishlistPrices(
        item,
      ),

    price4Inch:
      item.price4Inch,

    price5Inch:
      item.price5Inch,

    price6Inch:
      item.price6Inch,

    price8Inch:
      item.price8Inch,

    addedAt:
      item.addedAt,

  };
}


/*
==================================================
GET WISHLIST
==================================================
*/

export async function getWishlistApi() {

  const response =
    await apiRequest(
      '/api/wishlist',
      'GET',
    );


  const wishlist =
    response?.data;


  return {

    items:
      Array.isArray(
        wishlist?.items,
      )
        ? wishlist.items
            .map(
              mapWishlistItemFromApi,
            )
            .filter(Boolean)
        : [],

    totalItems:
      Number(
        wishlist?.totalItems ||
        0,
      ),

  };
}


/*
==================================================
ADD TO WISHLIST
==================================================
*/

export async function addWishlistItemApi(
  productId,
) {

  const response =
    await apiRequest(
      `/api/wishlist/${productId}`,
      'POST',
    );


  const wishlist =
    response?.data;


  return {

    items:
      Array.isArray(
        wishlist?.items,
      )
        ? wishlist.items
            .map(
              mapWishlistItemFromApi,
            )
            .filter(Boolean)
        : [],

    totalItems:
      Number(
        wishlist?.totalItems ||
        0,
      ),

  };
}


/*
==================================================
REMOVE FROM WISHLIST
==================================================
*/

export async function removeWishlistItemApi(
  productId,
) {

  const response =
    await apiRequest(
      `/api/wishlist/${productId}`,
      'DELETE',
    );


  const wishlist =
    response?.data;


  return {

    items:
      Array.isArray(
        wishlist?.items,
      )
        ? wishlist.items
            .map(
              mapWishlistItemFromApi,
            )
            .filter(Boolean)
        : [],

    totalItems:
      Number(
        wishlist?.totalItems ||
        0,
      ),

  };
}


/*
==================================================
CHECK PRODUCT
==================================================
*/

export async function checkWishlistItemApi(
  productId,
) {

  const response =
    await apiRequest(
      `/api/wishlist/check/${productId}`,
      'GET',
    );


  return Boolean(
    response?.data,
  );
}