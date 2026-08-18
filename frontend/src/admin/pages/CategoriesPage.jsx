import {
  useEffect,
  useState,
} from 'react';

import AdminModal
  from '../components/AdminModal';

import LoadingSpinner
  from '../../components/LoadingSpinner/LoadingSpinner';

import {
  addAdminCategoryApi,
  deleteAdminCategoryApi,
  getAdminCategoriesApi,
  updateAdminCategoryApi,
} from '../services/adminCategoryService';


function CategoryForm({
  category,
  onSave,
  onClose,
}) {

  const [
    name,
    setName,
  ] = useState(
    category?.name || '',
  );


  const [
    subcategories,
    setSubcategories,
  ] = useState(
    category?.subcategories ||
    [],
  );


  const [
    newSubInput,
    setNewSubInput,
  ] = useState('');


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState('');


  const addSubcategory =
    () => {

      const trimmed =
        newSubInput.trim();


      if (!trimmed) {
        return;
      }


      if (
        subcategories.some(
          (sub) =>
            sub
              .toLowerCase() ===
            trimmed
              .toLowerCase(),
        )
      ) {

        setError(
          'This subcategory already exists.',
        );

        return;
      }


      setSubcategories(
        (current) => [
          ...current,
          trimmed,
        ],
      );


      setNewSubInput('');

      setError('');
    };


  const handleSubInputKeyDown =
    (event) => {

      if (
        event.key ===
        'Enter'
      ) {

        event.preventDefault();

        addSubcategory();
      }
    };


  const removeSubcategory =
    (indexToRemove) => {

      setSubcategories(
        (current) =>
          current.filter(
            (_, index) =>
              index !==
              indexToRemove,
          ),
      );
    };


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError('');


      const trimmedName =
        name.trim();


      if (
        trimmedName.length <
        2
      ) {

        setError(
          'Category name must contain at least 2 characters.',
        );

        return;
      }


      try {

        setSaving(true);


        await onSave({
          id:
            category?.id,

          name:
            trimmedName,

          subcategories,
        });


      } catch (err) {

        setError(
          err.message ||
          'Unable to save category.',
        );


      } finally {

        setSaving(false);
      }
    };


  return (

    <form
      className="category-form admin-form-stack"
      onSubmit={
        handleSubmit
      }
    >

      <label>

        Category Name

        <input
          required
          autoFocus
          value={name}
          onChange={
            (event) =>
              setName(
                event.target.value,
              )
          }
          placeholder="e.g. Orthopaedic Collection"
          disabled={saving}
        />

      </label>


      <div className="subcategories-manager">

        <label>
          Sub Category
        </label>


        <div className="subcategory-input-row">

          <input
            value={
              newSubInput
            }
            onChange={
              (event) =>
                setNewSubInput(
                  event.target.value,
                )
            }
            onKeyDown={
              handleSubInputKeyDown
            }
            placeholder="Type a sub category (e.g. Firm Support)"
            disabled={saving}
          />


          <button
            type="button"
            className="admin-action subcategory-add-btn"
            onClick={
              addSubcategory
            }
            disabled={saving}
          >
            + Sub Category
          </button>

        </div>


        <div className="subcategory-tags-list">

          {
            subcategories.length >
            0
              ? (

                subcategories.map(
                  (
                    sub,
                    index,
                  ) => (

                    <span
                      key={
                        `${sub}-${index}`
                      }
                      className="subcategory-chip"
                    >

                      {sub}


                      <button
                        type="button"
                        className="chip-remove"
                        onClick={
                          () =>
                            removeSubcategory(
                              index,
                            )
                        }
                        title="Remove subcategory"
                        disabled={saving}
                      >
                        ×
                      </button>

                    </span>
                  ),
                )
              )
              : (

                <small className="subcategory-empty-text">

                  No subcategories added yet.
                  Type above and click
                  "+ Sub Category".

                </small>
              )
          }

        </div>

      </div>


      {
        error && (

          <p
            className="account-form-error"
            role="alert"
          >
            {error}
          </p>
        )
      }


      <div
        className="product-form-actions"
        style={{
          marginTop: '20px',
        }}
      >

        <button
          type="button"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>


        <button
          type="submit"
          className="admin-action"
          disabled={saving}
        >

          {
            saving
              ? (
                <LoadingSpinner
                  label={
                    category
                      ? 'Updating Category...'
                      : 'Adding Category...'
                  }
                  inline
                />
              )
              : 'Save Category'
          }

        </button>

      </div>

    </form>
  );
}



export default function CategoriesPage() {

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
    editingCategory,
    setEditingCategory,
  ] = useState(null);


  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  /*
  ==================================================
  LOAD CATEGORIES
  ==================================================
  */

  const loadCategories =
    async () => {

      try {

        setLoading(true);

        setPageError('');


        const data =
          await getAdminCategoriesApi();


        setCategories(
          data,
        );


      } catch (error) {

        console.error(
          'Unable to load admin categories:',
          error,
        );


        setCategories([]);


        setPageError(
          error.message ||
          'Unable to load categories.',
        );


      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    loadCategories();

  }, []);


  /*
  ==================================================
  MODAL
  ==================================================
  */

  const close =
    () => {

      setIsOpen(false);

      setEditingCategory(
        null,
      );
    };


  /*
  ==================================================
  ADD / UPDATE
  ==================================================
  */

  const handleSave =
    async (
      categoryData,
    ) => {

      if (
        editingCategory
      ) {

        const updated =
          await updateAdminCategoryApi(
            editingCategory.id,
            categoryData,
          );


        setCategories(
          (current) =>
            current.map(
              (category) =>
                category.id ===
                updated.id
                  ? updated
                  : category,
            ),
        );


      } else {

        const created =
          await addAdminCategoryApi(
            categoryData,
          );


        setCategories(
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
  DELETE
  ==================================================
  */

  const handleDelete =
    async (id) => {

      const confirmed =
        window.confirm(
          'Are you sure you want to delete this category?',
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeletingId(id);

        setPageError('');


        await deleteAdminCategoryApi(
          id,
        );


        setCategories(
          (current) =>
            current.filter(
              (category) =>
                category.id !==
                id,
            ),
        );


      } catch (error) {

        setPageError(
          error.message ||
          'Unable to delete category.',
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
            Categories
          </h1>

        </div>


        <button
          className="admin-action"
          onClick={
            () =>
              setIsOpen(true)
          }
        >
          + Add Category
        </button>

      </div>


      <section className="admin-card category-admin">

        {
          pageError && (

            <p
              className="account-form-error"
              role="alert"
            >
              {pageError}
            </p>
          )
        }


        {
          loading
            ? (

              <div
                style={{
                  padding: '40px',
                  textAlign:
                    'center',
                }}
              >

                <LoadingSpinner
                  label="Loading Categories..."
                />

              </div>
            )

            : categories.length >
              0
              ? (

                <div className="order-table category-table">

                  <header className="table-head category-table-head">

                    <span>
                      Category Name
                    </span>

                    <span>
                      Sub Categories
                    </span>

                    <span
                      style={{
                        textAlign:
                          'right',
                      }}
                    >
                      Actions
                    </span>

                  </header>


                  {
                    categories.map(
                      (category) => (

                        <article
                          key={
                            category.id
                          }
                          className="table-row category-table-row"
                        >

                          <div className="category-name-cell">

                            <b>
                              {
                                category.name
                              }
                            </b>


                            <small className="subcategory-count">

                              {
                                category
                                  .subcategories
                                  ?.length ||
                                0
                              }

                              {' '}
                              Subcategories

                            </small>

                          </div>


                          <div className="category-subcategories-cell">

                            {
                              category
                                .subcategories
                                ?.length >
                              0
                                ? (

                                  category
                                    .subcategories
                                    .map(
                                      (
                                        sub,
                                        index,
                                      ) => (

                                        <span
                                          className="subcategory-pill"
                                          key={
                                            `${category.id}-${sub}-${index}`
                                          }
                                        >
                                          {sub}
                                        </span>
                                      ),
                                    )
                                )
                                : (

                                  <small className="no-subcategories">
                                    No subcategories
                                  </small>
                                )
                            }

                          </div>


                          <div
                            className="row-actions"
                            style={{
                              justifyContent:
                                'flex-end',
                            }}
                          >

                            <button
                              className="edit-category"
                              onClick={
                                () => {

                                  setEditingCategory(
                                    category,
                                  );

                                  setIsOpen(
                                    true,
                                  );
                                }
                              }
                              disabled={
                                deletingId ===
                                category.id
                              }
                            >
                              Edit
                            </button>


                            <button
                              onClick={
                                () =>
                                  handleDelete(
                                    category.id,
                                  )
                              }
                              disabled={
                                deletingId ===
                                category.id
                              }
                            >

                              {
                                deletingId ===
                                category.id
                                  ? 'Deleting...'
                                  : 'Delete'
                              }

                            </button>

                          </div>

                        </article>
                      ),
                    )
                  }

                </div>
              )

              : (

                <div className="module-empty">

                  <span>
                    ✦
                  </span>

                  <h2>
                    No categories found
                  </h2>

                  <p>
                    Click the button below to add your first category and subcategories.
                  </p>

                  <button
                    onClick={
                      () =>
                        setIsOpen(
                          true,
                        )
                    }
                  >
                    + Add Category
                  </button>

                </div>
              )
        }

      </section>


      {
        isOpen && (

          <AdminModal
            title={
              editingCategory
                ? `Edit ${editingCategory.name}`
                : 'Add a new category'
            }
            onClose={close}
          >

            <CategoryForm
              category={
                editingCategory
              }
              onSave={
                handleSave
              }
              onClose={close}
            />

          </AdminModal>
        )
      }

    </>
  );
}