import { useEffect, useState } from 'react';
import AdminModal from '../components/AdminModal';
import {
  getCategories,
  addCategory as addCatService,
  updateCategory as updateCatService,
  deleteCategory as deleteCatService,
} from '../services/categoriesService';

function CategoryForm({ category, onSave, onClose }) {
  const [name, setName] = useState(category?.name || '');
  const [subcategories, setSubcategories] = useState(category?.subcategories || []);
  const [newSubInput, setNewSubInput] = useState('');

  const addSubcategory = () => {
    const trimmed = newSubInput.trim();
    if (!trimmed) return;
    if (subcategories.some((sub) => sub.toLowerCase() === trimmed.toLowerCase())) {
      alert('This subcategory already exists.');
      return;
    }
    setSubcategories((curr) => [...curr, trimmed]);
    setNewSubInput('');
  };

  const handleSubInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubcategory();
    }
  };

  const removeSubcategory = (indexToRemove) => {
    setSubcategories((curr) => curr.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }
    onSave({
      id:
        category?.id ||
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      subcategories,
    });
  };

  return (
    <form className="category-form admin-form-stack" onSubmit={handleSubmit}>
      <label>
        Category Name
        <input
          required
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Orthopaedic Collection"
        />
      </label>

      {/* Sub Category Section */}
      <div className="subcategories-manager">
        <label>Sub Category</label>
        <div className="subcategory-input-row">
          <input
            value={newSubInput}
            onChange={(e) => setNewSubInput(e.target.value)}
            onKeyDown={handleSubInputKeyDown}
            placeholder="Type a sub category (e.g. Firm Support)"
          />
          <button type="button" className="admin-action subcategory-add-btn" onClick={addSubcategory}>
            + Sub Category
          </button>
        </div>
        <div className="subcategory-tags-list">
          {subcategories.length > 0 ? (
            subcategories.map((sub, idx) => (
              <span key={`${sub}-${idx}`} className="subcategory-chip">
                {sub}
                <button
                  type="button"
                  className="chip-remove"
                  onClick={() => removeSubcategory(idx)}
                  title="Remove subcategory"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <small className="subcategory-empty-text">
              No subcategories added yet. Type above and click "+ Sub Category".
            </small>
          )}
        </div>
      </div>

      <div className="product-form-actions" style={{ marginTop: '20px' }}>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="admin-action">Save Category</button>
      </div>
    </form>
  );
}

export default function CategoriesPage({
  categories: propCategories,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [internalCategories, setInternalCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const categories = propCategories || internalCategories;

  useEffect(() => {
    if (!propCategories) {
      setInternalCategories(getCategories());
    }
  }, [propCategories]);

  const close = () => {
    setIsOpen(false);
    setEditingCategory(null);
  };

  const handleSave = (categoryData) => {
    if (editingCategory) {
      if (onUpdate) {
        onUpdate(categoryData);
      } else {
        updateCatService(editingCategory.id, categoryData);
        setInternalCategories(getCategories());
      }
    } else {
      if (onAdd) {
        onAdd(categoryData);
      } else {
        addCatService(categoryData);
        setInternalCategories(getCategories());
      }
    }
    close();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      if (onDelete) {
        onDelete(id);
      } else {
        deleteCatService(id);
        setInternalCategories(getCategories());
      }
    }
  };

  return (
    <>
      <div className="admin-title">
        <div>
          <p>Catalog</p>
          <h1>Categories</h1>
        </div>
        <button className="admin-action" onClick={() => setIsOpen(true)}>
          + Add Category
        </button>
      </div>

      <section className="admin-card category-admin">
        {categories.length > 0 ? (
          <div className="order-table category-table">
            <header className="table-head category-table-head">
              <span>Category Name</span>
              <span>Sub Categories</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </header>
            {categories.map((cat) => (
              <article key={cat.id || cat.name} className="table-row category-table-row">
                <div className="category-name-cell">
                  <b>{cat.name}</b>
                  <small className="subcategory-count">
                    {cat.subcategories?.length || 0} Subcategories
                  </small>
                </div>
                <div className="category-subcategories-cell">
                  {cat.subcategories && cat.subcategories.length > 0 ? (
                    cat.subcategories.map((sub, idx) => (
                      <span className="subcategory-pill" key={`${sub}-${idx}`}>
                        {sub}
                      </span>
                    ))
                  ) : (
                    <small className="no-subcategories">No subcategories</small>
                  )}
                </div>
                <div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                  <button
                    className="edit-category"
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="module-empty">
            <span>✦</span>
            <h2>No categories found</h2>
            <p>Click the button below to add your first category and subcategories.</p>
            <button onClick={() => setIsOpen(true)}>+ Add Category</button>
          </div>
        )}
      </section>

      {isOpen && (
        <AdminModal
          title={editingCategory ? `Edit ${editingCategory.name}` : 'Add a new category'}
          onClose={close}
        >
          <CategoryForm category={editingCategory} onSave={handleSave} onClose={close} />
        </AdminModal>
      )}
    </>
  );
}
