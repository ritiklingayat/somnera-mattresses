/*
==================================================
CATEGORY MAPPER
==================================================

Backend shape:

{
  id,
  categoryName,
  subCategories: [
    {
      id,
      subCategoryName
    }
  ]
}

Frontend existing UI expects approximately:

{
  id,
  name,
  subcategories
}
*/

export function mapCategoryFromApi(
  category,
) {

  if (!category) {
    return null;
  }


  return {

    id:
      category.id,

    name:
      category.categoryName || '',

    categoryName:
      category.categoryName || '',

    subcategories:
      Array.isArray(
        category.subCategories,
      )
        ? category.subCategories.map(
            (sub) => ({
              id:
                sub.id,

              name:
                sub.subCategoryName || '',

              subCategoryName:
                sub.subCategoryName || '',
            }),
          )
        : [],

  };
}


/*
==================================================
PRODUCT SECTION MAPPER
==================================================

Backend enum values:

MATTRESSES
PILLOWS_ACCESSORIES
SOFA_CUM_BED
SOFA_CUSHIONING

Existing frontend previously used:

MATTRESS
PILLOWS_ACCESSORIES
SOFA_CUM_BED
*/

function mapProductSection(
  section,
) {

  if (
    section === 'MATTRESSES'
  ) {
    return 'MATTRESS';
  }


  return section || '';
}


/*
==================================================
MATERIAL STRING → ARRAY
==================================================
*/

function parseMaterials(
  materials,
) {

  if (
    Array.isArray(materials)
  ) {
    return materials;
  }


  if (
    typeof materials ===
      'string'
  ) {

    return materials
      .split(',')
      .map(
        (item) =>
          item.trim(),
      )
      .filter(Boolean);
  }


  return [];
}


/*
==================================================
THICKNESS PRICE MAPPER
==================================================

Backend stores rate per square foot:

price4Inch
price5Inch
price6Inch
price8Inch

Existing frontend getPrice() expects:

prices: {
  4: value,
  5: value,
  6: value,
  8: value
}
*/

function mapPrices(
  product,
) {

  const prices = {};


  if (
    product.price4Inch !==
      null &&
    product.price4Inch !==
      undefined
  ) {

    prices[4] =
      Number(
        product.price4Inch,
      );
  }


  if (
    product.price5Inch !==
      null &&
    product.price5Inch !==
      undefined
  ) {

    prices[5] =
      Number(
        product.price5Inch,
      );
  }


  if (
    product.price6Inch !==
      null &&
    product.price6Inch !==
      undefined
  ) {

    prices[6] =
      Number(
        product.price6Inch,
      );
  }


  if (
    product.price8Inch !==
      null &&
    product.price8Inch !==
      undefined
  ) {

    prices[8] =
      Number(
        product.price8Inch,
      );
  }


  return prices;
}


/*
==================================================
PRODUCT MAPPER
==================================================
*/

export function mapProductFromApi(
  product,
) {

  if (!product) {
    return null;
  }


  return {

    /*
    ==============================================
    IDs
    ==============================================
    */

    id:
      product.id,

    backendId:
      product.id,


    /*
    ==============================================
    BASIC PRODUCT
    ==============================================
    */

    name:
      product.productName || '',

    productName:
      product.productName || '',


    productSection:
      mapProductSection(
        product.productSection,
      ),


    badge:
      product.badge || '',


    /*
    ==============================================
    CATEGORY
    ==============================================
    */

    categoryId:
      product.categoryId,

    category:
      product.categoryName || '',

    categoryName:
      product.categoryName || '',


    subCategoryId:
      product.subCategoryId,

    subcategory:
      product.subCategoryName || '',

    subCategoryName:
      product.subCategoryName || '',


    /*
    ==============================================
    CONTENT
    ==============================================
    */

    warranty:
      product.warranty || '',


    description:
      product.shortDescription || '',

    shortDescription:
      product.shortDescription || '',


    image:
      product.imageUrl || '',

    imageUrl:
      product.imageUrl || '',


    materials:
      parseMaterials(
        product.materials,
      ),


    firmness:
      product.firmness || '',


    /*
    ==============================================
    FILTER DATA
    ==============================================
    */

    needs:
      Array.isArray(
        product.shopByNeed,
      )
        ? product.shopByNeed
        : [],


    userTypes:
      Array.isArray(
        product.shopByUser,
      )
        ? product.shopByUser
        : [],


    tech:
      Array.isArray(
        product.shopByTech,
      )
        ? product.shopByTech
        : [],


    feels:
      Array.isArray(
        product.mattressFeel,
      )
        ? product.mattressFeel
        : [],


    /*
    ==============================================
    FRONTEND DISPLAY
    ==============================================
    */

    eyebrow:
      product.subCategoryName ||
      product.categoryName ||
      '',


    prices:
      mapPrices(product),


    /*
    ==============================================
    KEEP RAW BACKEND FIELDS TOO
    ==============================================
    */

    price4Inch:
      product.price4Inch,

    price5Inch:
      product.price5Inch,

    price6Inch:
      product.price6Inch,

    price8Inch:
      product.price8Inch,

  };
}


/*
==================================================
LIST MAPPERS
==================================================
*/

export function mapProductsFromApi(
  products,
) {

  if (
    !Array.isArray(products)
  ) {
    return [];
  }


  return products
    .map(
      mapProductFromApi,
    )
    .filter(Boolean);
}


export function mapCategoriesFromApi(
  categories,
) {

  if (
    !Array.isArray(categories)
  ) {
    return [];
  }


  return categories
    .map(
      mapCategoryFromApi,
    )
    .filter(Boolean);
}