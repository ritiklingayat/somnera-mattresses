import {
  apiRequest,
} from '../../services/api';


/*
==================================================
MAP BACKEND CATEGORY → ADMIN UI CATEGORY
==================================================

Backend:

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

Admin UI:

{
  id,
  name,
  subcategories: [
    "Back Support",
    "Premium"
  ]
}
*/

export function mapAdminCategory(
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
        ? category.subCategories
            .map(
              (sub) =>
                sub.subCategoryName,
            )
            .filter(Boolean)
        : [],

    subCategories:
      category.subCategories || [],

  };
}


/*
==================================================
GET ALL CATEGORIES
==================================================
*/

export async function getAdminCategoriesApi() {

  const response =
    await apiRequest(
      '/api/categories',
      'GET',
    );


  const categories =
    Array.isArray(
      response?.data,
    )
      ? response.data
      : [];


  return categories
    .map(mapAdminCategory)
    .filter(Boolean);
}


/*
==================================================
ADD CATEGORY
==================================================

Backend request:

{
  categoryName,
  subCategories
}
*/

export async function addAdminCategoryApi(
  category,
) {

  const response =
    await apiRequest(
      '/api/categories',
      'POST',
      {
        categoryName:
          category.name.trim(),

        subCategories:
          Array.isArray(
            category.subcategories,
          )
            ? category.subcategories
            : [],
      },
    );


  return mapAdminCategory(
    response?.data,
  );
}


/*
==================================================
UPDATE CATEGORY
==================================================
*/

export async function updateAdminCategoryApi(
  id,
  category,
) {

  const response =
    await apiRequest(
      `/api/categories/${id}`,
      'PUT',
      {
        categoryName:
          category.name.trim(),

        subCategories:
          Array.isArray(
            category.subcategories,
          )
            ? category.subcategories
            : [],
      },
    );


  return mapAdminCategory(
    response?.data,
  );
}


/*
==================================================
DELETE CATEGORY
==================================================
*/

export async function deleteAdminCategoryApi(
  id,
) {

  return apiRequest(
    `/api/categories/${id}`,
    'DELETE',
  );
}