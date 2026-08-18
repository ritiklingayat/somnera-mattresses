import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import AdminModal
  from '../components/AdminModal';

import LoadingSpinner
  from '../../components/LoadingSpinner/LoadingSpinner';

import {
  PRODUCT_SECTION_OPTIONS,
  MATTRESS_NEED_OPTIONS,
  MATTRESS_USER_OPTIONS,
  MATTRESS_TECH_OPTIONS,
  MATTRESS_FEEL_OPTIONS,
  PRODUCT_SECTION_LABELS,
} from '../../config/productSections';

import {
  addAdminProductApi,
  deleteAdminProductApi,
  getAdminProductsApi,
  updateAdminProductApi,
} from '../services/adminProductService';

import {
  getAdminCategoriesApi,
} from '../services/adminCategoryService';


/*
==================================================
CHECKBOX GROUP
==================================================
*/

function CheckboxGroup({
  options,
  selected = [],
  onChange,
}) {

  const toggle =
    (value) => {

      const next =
        selected.includes(
          value,
        )
          ? selected.filter(
              (item) =>
                item !== value,
            )
          : [
              ...selected,
              value,
            ];


      onChange(next);
    };


  return (

    <div
      style={{
        marginBottom: 4,
      }}
    >

      {
        options.map(
          (option) => (

            <label
              key={option}
              style={{
                display:
                  'inline-flex',
                alignItems:
                  'center',
                gap: 5,
                marginRight:
                  12,
                marginBottom:
                  6,
                fontWeight:
                  400,
                fontSize:
                  '0.8rem',
                textTransform:
                  'none',
                letterSpacing:
                  'normal',
                cursor:
                  'pointer',
              }}
            >

              <input
                type="checkbox"
                checked={
                  selected.includes(
                    option,
                  )
                }
                onChange={
                  () =>
                    toggle(
                      option,
                    )
                }
                style={{
                  width: 'auto',
                }}
              />

              {option}

            </label>
          ),
        )
      }

    </div>
  );
}


/*
==================================================
EMPTY PRODUCT
==================================================
*/

const emptyProduct = {

  name: '',

  productSection:
    'MATTRESS',

  categoryId: '',

  subCategoryId: '',

  category: '',

  subcategory: '',

  eyebrow:
    'Premium collection',

  description: '',

  warranty:
    '10 years',

  firmness:
    'Medium firm',

  materials: '',

  needs: [],

  userTypes: [],

  tech: [],

  feels: [],

  price4: '',

  price5: '',

  price6: '',

  price8: '',

  badge:
    'New arrival',

  image: '',
};


/*
==================================================
PRODUCT → FORM MODEL
==================================================
*/

function toFormProduct(
  product,
  categories,
) {

  if (!product) {

    const firstCategory =
      categories[0];


    const firstSub =
      firstCategory
        ?.subCategories?.[0];


    return {

      ...emptyProduct,

      categoryId:
        firstCategory?.id ||
        '',

      subCategoryId:
        firstSub?.id ||
        '',

      category:
        firstCategory?.name ||
        '',

      subcategory:
        firstSub?.subCategoryName ||
        firstCategory
          ?.subcategories?.[0] ||
        '',
    };
  }


  return {

    ...emptyProduct,

    ...product,

    categoryId:
      product.categoryId ||
      '',

    subCategoryId:
      product.subCategoryId ||
      '',

    category:
      product.category ||
      '',

    subcategory:
      product.subcategory ||
      '',

    materials:
      Array.isArray(
        product.materials,
      )
        ? product.materials.join(
            ', ',
          )
        : product.materials ||
          '',

    needs:
      Array.isArray(
        product.needs,
      )
        ? product.needs
        : [],

    userTypes:
      Array.isArray(
        product.userTypes,
      )
        ? product.userTypes
        : [],

    tech:
      Array.isArray(
        product.tech,
      )
        ? product.tech
        : [],

    feels:
      Array.isArray(
        product.feels,
      )
        ? product.feels
        : [],

    price4:
      product.prices?.[4] ??
      product.price4Inch ??
      '',

    price5:
      product.prices?.[5] ??
      product.price5Inch ??
      '',

    price6:
      product.prices?.[6] ??
      product.price6Inch ??
      '',

    price8:
      product.prices?.[8] ??
      product.price8Inch ??
      '',
  };
}


/*
==================================================
PRODUCT FORM
==================================================
*/

function ProductForm({
  product,
  categories,
  onSave,
  onClose,
}) {

  const [
    draft,
    setDraft,
  ] = useState(
    () =>
      toFormProduct(
        product,
        categories,
      ),
  );


  const [
    imageFile,
    setImageFile,
  ] = useState(null);


  const [
    imagePreview,
    setImagePreview,
  ] = useState(
    product?.image ||
    '',
  );


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    saveError,
    setSaveError,
  ] = useState('');


  useEffect(() => {

    setDraft(
      toFormProduct(
        product,
        categories,
      ),
    );


    setImageFile(null);


    setImagePreview(
      product?.image ||
      '',
    );

  }, [
    product,
    categories,
  ]);


  const isMattress =
    draft.productSection ===
    'MATTRESS';


  const selectedCategory =
    useMemo(
      () =>
        categories.find(
          (category) =>
            String(
              category.id,
            ) ===
            String(
              draft.categoryId,
            ),
        ),
      [
        categories,
        draft.categoryId,
      ],
    );


  const subCategories =
    selectedCategory
      ?.subCategories ||
    [];


  /*
  ==================================================
  GENERIC FIELD CHANGE
  ==================================================
  */

  const setValue =
    (event) => {

      const {
        name,
        value,
      } =
        event.target;


      setDraft(
        (current) => ({
          ...current,
          [name]: value,
        }),
      );
    };


  /*
  ==================================================
  ARRAY FIELD
  ==================================================
  */

  const setArrayValue =
    (
      field,
      value,
    ) => {

      setDraft(
        (current) => ({
          ...current,
          [field]: value,
        }),
      );
    };


  /*
  ==================================================
  CATEGORY
  ==================================================
  */

  const handleCategoryChange =
    (event) => {

      const categoryId =
        event.target.value;


      const category =
        categories.find(
          (item) =>
            String(item.id) ===
            String(categoryId),
        );


      const firstSub =
        category
          ?.subCategories?.[0];


      setDraft(
        (current) => ({
          ...current,

          categoryId,

          category:
            category?.name ||
            '',

          subCategoryId:
            firstSub?.id ||
            '',

          subcategory:
            firstSub
              ?.subCategoryName ||
            '',
        }),
      );
    };


  /*
  ==================================================
  SUB CATEGORY
  ==================================================
  */

  const handleSubcategoryChange =
    (event) => {

      const subCategoryId =
        event.target.value;


      const sub =
        subCategories.find(
          (item) =>
            String(item.id) ===
            String(
              subCategoryId,
            ),
        );


      setDraft(
        (current) => ({
          ...current,

          subCategoryId,

          subcategory:
            sub
              ?.subCategoryName ||
            '',
        }),
      );
    };


  /*
  ==================================================
  IMAGE
  ==================================================
  */

  const handleImageChange =
    (event) => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      if (
        !file.type.startsWith(
          'image/',
        )
      ) {

        setSaveError(
          'Please select a valid image file.',
        );

        return;
      }


      setImageFile(file);


      const previewUrl =
        URL.createObjectURL(
          file,
        );


      setImagePreview(
        previewUrl,
      );


      setSaveError('');
    };


  /*
  ==================================================
  SUBMIT
  ==================================================
  */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setSaveError('');


      if (
        !draft.name.trim()
      ) {

        setSaveError(
          'Product name is required.',
        );

        return;
      }


      if (
        !draft.categoryId
      ) {

        setSaveError(
          'Category is required.',
        );

        return;
      }


      if (
        !draft.subCategoryId
      ) {

        setSaveError(
          'Sub category is required.',
        );

        return;
      }


      if (
        !product &&
        !imageFile
      ) {

        setSaveError(
          'Product image is required.',
        );

        return;
      }


      try {

        setSaving(true);


        await onSave(
          draft,
          imageFile,
        );


      } catch (error) {

        setSaveError(
          error.message ||
          'Unable to save product.',
        );


      } finally {

        setSaving(false);
      }
    };


  /*
  ==================================================
  UI
  ==================================================
  */

  return (

    <form
      onSubmit={
        handleSubmit
      }
      className="admin-form-stack product-form"
    >

      <div className="product-form-section">

        <h3>
          Product Details
        </h3>


        <label>

          Product Name

          <input
            required
            name="name"
            value={
              draft.name
            }
            onChange={
              setValue
            }
            disabled={
              saving
            }
          />

        </label>


        <label>

          Product Section

          <select
  name="productSection"
  value={draft.productSection}
  onChange={setValue}
  disabled={saving}
>
  {
    PRODUCT_SECTION_OPTIONS.map(
      (option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ),
    )
  }
</select>

        </label>


        <div className="form-two-columns">

          <label>

            Category

            <select
              required
              value={
                draft.categoryId
              }
              onChange={
                handleCategoryChange
              }
              disabled={
                saving
              }
            >

              <option value="">
                Select category
              </option>


              {
                categories.map(
                  (category) => (

                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >

                      {
                        category.name
                      }

                    </option>
                  ),
                )
              }

            </select>

          </label>


          <label>

            Sub Category

            <select
              required
              value={
                draft.subCategoryId
              }
              onChange={
                handleSubcategoryChange
              }
              disabled={
                saving ||
                !draft.categoryId
              }
            >

              <option value="">
                Select sub category
              </option>


              {
                subCategories.map(
                  (sub) => (

                    <option
                      key={
                        sub.id
                      }
                      value={
                        sub.id
                      }
                    >

                      {
                        sub.subCategoryName
                      }

                    </option>
                  ),
                )
              }

            </select>

          </label>

        </div>


        <div className="form-two-columns">

          <label>

            Badge

            <input
              name="badge"
              value={
                draft.badge
              }
              onChange={
                setValue
              }
              disabled={
                saving
              }
            />

          </label>


          <label>

            Warranty

            <input
              name="warranty"
              value={
                draft.warranty
              }
              onChange={
                setValue
              }
              placeholder="10 years"
              disabled={
                saving
              }
            />

          </label>

        </div>


        <label>

          Description

          <textarea
            name="description"
            rows="3"
            value={
              draft.description
            }
            onChange={
              setValue
            }
            disabled={
              saving
            }
          />

        </label>


        <label>

          Materials

          <small>
            Separate each with a comma
          </small>

          <input
            name="materials"
            value={
              draft.materials
            }
            onChange={
              setValue
            }
            placeholder="Natural Latex, HR foam, Knitted fabric"
            disabled={
              saving
            }
          />

        </label>


        <label>

          Product Image

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
            disabled={
              saving
            }
          />

          {
            product && (

              <small>
                Leave empty to keep the current image.
              </small>
            )
          }

        </label>


        {
          imagePreview && (

            <div
              style={{
                marginTop:
                  '10px',
              }}
            >

              <img
                src={
                  imagePreview
                }
                alt="Product preview"
                style={{
                  width:
                    '160px',
                  maxHeight:
                    '120px',
                  objectFit:
                    'cover',
                  borderRadius:
                    '8px',
                }}
              />

            </div>
          )
        }

      </div>


      {
        isMattress && (

          <>

            <div className="product-form-section">

              <h3>
                Mattress Attributes
              </h3>


              <label
                style={{
                  display:
                    'grid',
                  gap: 6,
                }}
              >

                Shop by Need

                <CheckboxGroup
                  options={
                    MATTRESS_NEED_OPTIONS
                  }
                  selected={
                    draft.needs
                  }
                  onChange={
                    (value) =>
                      setArrayValue(
                        'needs',
                        value,
                      )
                  }
                />

              </label>


              <label
                style={{
                  display:
                    'grid',
                  gap: 6,
                }}
              >

                Shop by User

                <CheckboxGroup
                  options={
                    MATTRESS_USER_OPTIONS
                  }
                  selected={
                    draft.userTypes
                  }
                  onChange={
                    (value) =>
                      setArrayValue(
                        'userTypes',
                        value,
                      )
                  }
                />

              </label>


              <label
                style={{
                  display:
                    'grid',
                  gap: 6,
                }}
              >

                Shop by Tech

                <CheckboxGroup
                  options={
                    MATTRESS_TECH_OPTIONS
                  }
                  selected={
                    draft.tech
                  }
                  onChange={
                    (value) =>
                      setArrayValue(
                        'tech',
                        value,
                      )
                  }
                />

              </label>


              <label
                style={{
                  display:
                    'grid',
                  gap: 6,
                }}
              >

                Mattress Feel

                <CheckboxGroup
                  options={
                    MATTRESS_FEEL_OPTIONS
                  }
                  selected={
                    draft.feels
                  }
                  onChange={
                    (value) =>
                      setArrayValue(
                        'feels',
                        value,
                      )
                  }
                />

              </label>


              <label>

                Firmness

                <input
                  name="firmness"
                  value={
                    draft.firmness
                  }
                  onChange={
                    setValue
                  }
                  disabled={
                    saving
                  }
                />

              </label>

            </div>


            <div className="product-form-section">

              <h3>
                Pricing by thickness
              </h3>


              <small>
                Rate per square foot (₹)
              </small>


              <div className="form-four-columns">

                {
                  [
                    4,
                    5,
                    6,
                    8,
                  ].map(
                    (size) => (

                      <label
                        key={
                          size
                        }
                      >

                        {size} inch

                        <input
                          name={
                            `price${size}`
                          }
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            draft[
                              `price${size}`
                            ]
                          }
                          onChange={
                            setValue
                          }
                          disabled={
                            saving
                          }
                        />

                      </label>
                    ),
                  )
                }

              </div>

            </div>

          </>
        )
      }


      {
        saveError && (

          <p
            className="account-form-error"
            role="alert"
          >

            {
              saveError
            }

          </p>
        )
      }


      <div className="product-form-actions">

        <button
          type="button"
          onClick={
            onClose
          }
          disabled={
            saving
          }
        >
          Cancel
        </button>


        <button
          type="submit"
          className="admin-action"
          disabled={
            saving
          }
        >

          {
            saving
              ? (
                <LoadingSpinner
                  label={
                    product
                      ? 'Updating Product...'
                      : 'Adding Product...'
                  }
                  inline
                />
              )
              : 'Save product'
          }

        </button>

      </div>

    </form>
  );
}


/*
==================================================
PRODUCTS PAGE
==================================================
*/

export default function ProductsPage() {

  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    categories,
    setCategories,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    pageError,
    setPageError,
  ] = useState('');


  const [
    deletingId,
    setDeletingId,
  ] = useState(null);


  const [
    editingProduct,
    setEditingProduct,
  ] = useState(null);


  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  /*
  ==================================================
  LOAD DATA
  ==================================================
  */

  const loadData =
    async () => {

      try {

        setLoading(true);

        setPageError('');


        const [
          productsData,
          categoriesData,
        ] =
          await Promise.all([
            getAdminProductsApi(),
            getAdminCategoriesApi(),
          ]);


        setProducts(
          productsData,
        );


        setCategories(
          categoriesData,
        );


      } catch (error) {

        setPageError(
          error.message ||
          'Unable to load products.',
        );


      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    loadData();

  }, []);


  /*
  ==================================================
  MODAL
  ==================================================
  */

  const close =
    () => {

      setIsOpen(false);

      setEditingProduct(
        null,
      );
    };


  /*
  ==================================================
  SAVE PRODUCT
  ==================================================
  */

  const handleSave =
    async (
      draft,
      imageFile,
    ) => {

      if (
        editingProduct
      ) {

        const updated =
          await updateAdminProductApi(
            editingProduct.id,
            draft,
            imageFile,
          );


        setProducts(
          (current) =>
            current.map(
              (product) =>
                product.id ===
                updated.id
                  ? updated
                  : product,
            ),
        );


      } else {

        const created =
          await addAdminProductApi(
            draft,
            imageFile,
          );


        setProducts(
          (current) => [
            ...current,
            created,
          ],
        );
      }


      close();
    };


  /*
  ==================================================
  DELETE PRODUCT
  ==================================================
  */

  const handleDelete =
    async (
      productId,
    ) => {

      const confirmed =
        window.confirm(
          'Are you sure you want to delete this product?',
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(
          productId,
        );

        setPageError('');


        await deleteAdminProductApi(
          productId,
        );


        setProducts(
          (current) =>
            current.filter(
              (product) =>
                product.id !==
                productId,
            ),
        );


      } catch (error) {

        setPageError(
          error.message ||
          'Unable to delete product.',
        );


      } finally {

        setDeletingId(null);
      }
    };


  /*
  ==================================================
  UI
  ==================================================
  */

  return (

    <>

      <div className="admin-title">

        <div>

          <p>
            Catalog
          </p>

          <h1>
            Products
          </h1>

        </div>


        <button
          className="admin-action"
          onClick={
            () =>
              setIsOpen(true)
          }
        >
          + Add product
        </button>

      </div>


      <section className="admin-card product-admin">

        {
          pageError && (

            <p
              className="account-form-error"
              role="alert"
            >
              {
                pageError
              }
            </p>
          )
        }


        {
          loading
            ? (

              <div
                style={{
                  padding:
                    '40px',
                  textAlign:
                    'center',
                }}
              >

                <LoadingSpinner
                  label="Loading Products..."
                />

              </div>
            )

            : products.length ===
              0
              ? (

                <div className="module-empty">

                  <h2>
                    No products found
                  </h2>

                  <p>
                    Add your first product.
                  </p>

                </div>
              )

              : (

                products.map(
                  (product) => {

                    const sectionLabel =
                      PRODUCT_SECTION_LABELS[
                        product.productSection
                      ] ||
                      product.productSection ||
                      '—';


                    const priceValues =
                      Object.values(
                        product.prices ||
                        {},
                      ).filter(
                        (value) =>
                          Number(
                            value,
                          ) >
                          0,
                      );


                    const minPriceDisplay =
                      priceValues.length
                        ? `₹${Math.min(
                            ...priceValues,
                          )}/sq.ft`
                        : '—';


                    return (

                      <div
                        className="admin-product"
                        key={
                          product.id
                        }
                      >

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                        />


                        <span>

                          <b>
                            {
                              product.name
                            }
                          </b>


                          <small>

                            <span
                              style={{
                                background:
                                  '#f3e9d2',
                                color:
                                  '#5e3a00',
                                borderRadius:
                                  4,
                                padding:
                                  '1px 7px',
                                fontWeight:
                                  700,
                                fontSize:
                                  '0.72rem',
                                marginRight:
                                  6,
                              }}
                            >

                              {
                                sectionLabel
                              }

                            </span>


                            {
                              product.category &&
                              (
                                <strong>
                                  {
                                    product.category
                                  }
                                </strong>
                              )
                            }


                            {
                              product.subcategory &&
                              ` · ${product.subcategory}`
                            }


                            {
                              product.firmness &&
                              ` · ${product.firmness}`
                            }


                            {
                              product.warranty &&
                              ` · ${product.warranty} warranty`
                            }

                          </small>


                          <small className="product-description-preview">

                            {
                              product.description
                            }

                          </small>

                        </span>


                        <strong>
                          {
                            minPriceDisplay
                          }
                        </strong>


                        <button
                          className="edit-product"
                          onClick={
                            () => {

                              setEditingProduct(
                                product,
                              );

                              setIsOpen(
                                true,
                              );
                            }
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                        >
                          Edit
                        </button>


                        <button
                          onClick={
                            () =>
                              handleDelete(
                                product.id,
                              )
                          }
                          disabled={
                            deletingId ===
                            product.id
                          }
                        >

                          {
                            deletingId ===
                            product.id
                              ? 'Deleting...'
                              : 'Delete'
                          }

                        </button>

                      </div>
                    );
                  },
                )
              )
        }

      </section>


      {
        isOpen && (

          <AdminModal
            title={
              editingProduct
                ? `Edit ${editingProduct.name}`
                : 'Add a new product'
            }
            onClose={
              close
            }
          >

            <ProductForm
              product={
                editingProduct
              }
              categories={
                categories
              }
              onSave={
                handleSave
              }
              onClose={
                close
              }
            />

          </AdminModal>
        )
      }

    </>
  );
}