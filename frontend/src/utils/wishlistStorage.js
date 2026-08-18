/**
 * Somnera - User-Specific Wishlist Storage Utility
 *
 * Temporary localStorage implementation.
 *
 * NOTE:
 * Phase 4 will replace this with the real
 * backend wishlist APIs.
 */


function getUserKey(user) {

  if (!user) {
    return null;
  }


  let identifier;


  /*
   * Support authenticated user object.
   */

  if (
    typeof user ===
    'object'
  ) {

    identifier =
      user.id ??
      user.userId ??
      user.email ??
      'anonymous';

  } else {

    /*
     * Also support old string usage.
     */

    identifier =
      user;
  }


  const normalized =
    String(identifier)
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]/g,
        '_',
      );


  return (
    `somnera_wishlist_${normalized}`
  );
}


/*
==================================================
GET WISHLIST
==================================================
*/

export function getStoredWishlist(
  user,
) {

  const key =
    getUserKey(user);


  if (!key) {
    return [];
  }


  try {

    const raw =
      localStorage.getItem(
        key,
      );


    if (!raw) {
      return [];
    }


    const parsed =
      JSON.parse(raw);


    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      'Failed to parse user wishlist:',
      error,
    );


    return [];
  }
}


/*
==================================================
SAVE WISHLIST
==================================================
*/

export function saveStoredWishlist(
  user,
  items,
) {

  const key =
    getUserKey(user);


  if (!key) {
    return;
  }


  try {

    localStorage.setItem(
      key,
      JSON.stringify(
        Array.isArray(items)
          ? items
          : [],
      ),
    );


    window.dispatchEvent(
      new CustomEvent(
        'somnera_wishlist_changed',
        {
          detail: {
            userKey: key,
          },
        },
      ),
    );

  } catch (error) {

    console.error(
      'Failed to save user wishlist:',
      error,
    );
  }
}


/*
==================================================
CHECK PRODUCT
==================================================
*/

export function isItemInWishlist(
  user,
  productId,
) {

  const wishlist =
    getStoredWishlist(
      user,
    );


  return wishlist.some(
    (item) => {

      const itemId =
        typeof item ===
        'string'
          ? item
          : item.id ??
            item.productId;


      return String(itemId) ===
        String(productId);
    },
  );
}


/*
==================================================
TOGGLE PRODUCT
==================================================
*/

export function toggleWishlistItem(
  user,
  product,
) {

  if (!user) {
    return false;
  }


  const current =
    getStoredWishlist(
      user,
    );


  const productId =
    typeof product ===
    'string'
      ? product
      : product.id ??
        product.productId;


  const exists =
    current.some(
      (item) => {

        const itemId =
          typeof item ===
          'string'
            ? item
            : item.id ??
              item.productId;


        return String(itemId) ===
          String(productId);
      },
    );


  let next;


  if (exists) {

    next =
      current.filter(
        (item) => {

          const itemId =
            typeof item ===
            'string'
              ? item
              : item.id ??
                item.productId;


          return String(itemId) !==
            String(productId);
        },
      );

  } else {

    const itemToAdd =
      typeof product ===
      'string'
        ? {
            id: product,
          }
        : product;


    next = [
      ...current,
      itemToAdd,
    ];
  }


  saveStoredWishlist(
    user,
    next,
  );


  /*
   * true  = product added
   * false = product removed
   */

  return !exists;
}


/*
==================================================
REMOVE PRODUCT
==================================================
*/

export function removeWishlistItem(
  user,
  productId,
) {

  if (!user) {
    return;
  }


  const current =
    getStoredWishlist(
      user,
    );


  const next =
    current.filter(
      (item) => {

        const itemId =
          typeof item ===
          'string'
            ? item
            : item.id ??
              item.productId;


        return String(itemId) !==
          String(productId);
      },
    );


  saveStoredWishlist(
    user,
    next,
  );
}


/*
==================================================
OPTIONAL COMPATIBILITY ALIAS
==================================================
*/

export function removeFromWishlist(
  user,
  productId,
) {

  return removeWishlistItem(
    user,
    productId,
  );
}


/*
==================================================
CLEAR WISHLIST
==================================================
*/

export function clearWishlist(
  user,
) {

  const key =
    getUserKey(user);


  if (!key) {
    return;
  }


  localStorage.removeItem(
    key,
  );


  window.dispatchEvent(
    new CustomEvent(
      'somnera_wishlist_changed',
      {
        detail: {
          userKey: key,
        },
      },
    ),
  );
}