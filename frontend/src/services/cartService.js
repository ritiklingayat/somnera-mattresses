import {
  apiRequest,
} from './api';


/*
==================================================
MAP BACKEND CART ITEM
==================================================
*/

export function mapCartItemFromApi(
  item,
) {

  if (!item) {
    return null;
  }


  return {

    /*
     * Cart item database ID.
     *
     * IMPORTANT:
     * PUT / DELETE use this ID,
     * not productId.
     */

    cartItemId:
      item.id,

    id:
      item.id,


    /*
     * Product
     */

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


    /*
     * Category
     */

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


    /*
     * Selected backend variant
     */

    thickness:
      String(
        item.thickness,
      ),


    /*
     * Trusted backend pricing
     */

    unitPrice:
      Number(
        item.unitPrice ||
        0,
      ),

    price:
      Number(
        item.unitPrice ||
        0,
      ),

    quantity:
      Number(
        item.quantity ||
        0,
      ),

    itemTotal:
      Number(
        item.itemTotal ||
        0,
      ),

  };
}


/*
==================================================
MAP CART RESPONSE
==================================================
*/

export function mapCartFromApi(
  cart,
) {

  return {

    cartId:
      cart?.cartId ??
      null,

    items:
      Array.isArray(
        cart?.items,
      )
        ? cart.items
            .map(
              mapCartItemFromApi,
            )
            .filter(Boolean)
        : [],

    totalItems:
      Number(
        cart?.totalItems ||
        0,
      ),

    cartTotal:
      Number(
        cart?.cartTotal ||
        0,
      ),

  };
}


/*
==================================================
GET CART
==================================================

GET /api/cart
*/

export async function getCartApi() {

  const response =
    await apiRequest(
      '/api/cart',
      'GET',
    );


  return mapCartFromApi(
    response?.data,
  );
}


/*
==================================================
ADD ITEM
==================================================

POST /api/cart/items

Backend request:

{
  productId,
  thickness,
  quantity
}
*/

export async function addToCartApi({
  productId,
  thickness,
  quantity = 1,
}) {

  const response =
    await apiRequest(
      '/api/cart/items',
      'POST',
      {
        productId:
          Number(productId),

        thickness:
          Number(thickness),

        quantity:
          Number(quantity),
      },
    );


  return mapCartFromApi(
    response?.data,
  );
}


/*
==================================================
UPDATE QUANTITY
==================================================

PUT /api/cart/items/{itemId}
*/

export async function updateCartItemApi(
  itemId,
  quantity,
) {

  const response =
    await apiRequest(
      `/api/cart/items/${itemId}`,
      'PUT',
      {
        quantity:
          Number(quantity),
      },
    );


  return mapCartFromApi(
    response?.data,
  );
}


/*
==================================================
REMOVE ITEM
==================================================

DELETE /api/cart/items/{itemId}
*/

export async function removeCartItemApi(
  itemId,
) {

  const response =
    await apiRequest(
      `/api/cart/items/${itemId}`,
      'DELETE',
    );


  return mapCartFromApi(
    response?.data,
  );
}


/*
==================================================
CLEAR COMPLETE CART
==================================================

DELETE /api/cart
*/

export async function clearCartApi() {

  const response =
    await apiRequest(
      '/api/cart',
      'DELETE',
    );


  return mapCartFromApi(
    response?.data,
  );
}