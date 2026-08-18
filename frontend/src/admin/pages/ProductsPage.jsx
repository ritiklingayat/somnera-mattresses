import { useEffect, useState } from 'react';
import AdminModal from '../components/AdminModal';
import { getActiveCategories } from '../services/categoriesService';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import {
  PRODUCT_SECTION_OPTIONS,
  MATTRESS_NEED_OPTIONS,
  MATTRESS_USER_OPTIONS,
  MATTRESS_TECH_OPTIONS,
  MATTRESS_MATERIAL_OPTIONS,
  MATTRESS_FEEL_OPTIONS,
  PRODUCT_SECTION_LABELS,
} from '../../config/productSections';

// ─────────────────────────────────────────────────────────────
// Helper: checkbox multi-select group for admin form
// ─────────────────────────────────────────────────────────────
function CheckboxGroup({ label, options, selected = [], onChange }) {
  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  };
  return (
    <div style={{ marginBottom: 4 }}>
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            marginRight: 12,
            marginBottom: 6,
            fontWeight: 400,
            fontSize: '0.8rem',
            textTransform: 'none',
            letterSpacing: 'normal',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            style={{ width: 'auto' }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Default empty product template
// ─────────────────────────────────────────────────────────────
const emptyProduct = {
  name: '',
  productSection: 'MATTRESS',
  category: '',
  subcategory: '',
  eyebrow: 'Premium collection',
  description: '',
  warranty: '10 years',
  firmness: 'Medium firm',
  materials: '',
  needs: [],
  userTypes: [],
  tech: [],
  feels: [],
  price4: '',
  price5: '',
  price6: '',
  price8: '',
  price: '',   // flat price for non-mattress products
  badge: 'New arrival',
  image: '',
};

const toFormProduct = (product, categories = []) => {
  const baseCategory = product?.category || categories[0]?.name || '';
  const foundCat = categories.find((c) => c.name === baseCategory);
  const baseSubcategory = product?.subcategory || foundCat?.subcategories?.[0] || '';

  const rawMaterials = Array.isArray(product?.materials)
    ? product.materials.join(', ')
    : product?.materials || '';

  return {
    ...emptyProduct,
    ...product,
    productSection: product?.productSection || 'MATTRESS',
    category: baseCategory,
    subcategory: baseSubcategory,
    materials: rawMaterials,
    needs: Array.isArray(product?.needs) ? product.needs : [],
    userTypes: Array.isArray(product?.userTypes) ? product.userTypes : [],
    tech: Array.isArray(product?.tech) ? product.tech : [],
    feels: Array.isArray(product?.feels) ? product.feels : [],
    price4: product?.prices?.[4] || '',
    price5: product?.prices?.[5] || '',
    price6: product?.prices?.[6] || '',
    price8: product?.prices?.[8] || '',
    price: product?.price || '',
  };
};

// ─────────────────────────────────────────────────────────────
// ProductForm component
// ─────────────────────────────────────────────────────────────
function ProductForm({ product, categories: propCategories = [], onSave, onClose }) {
  const [categories, setCategories] = useState(propCategories);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
    } else {
      const active = getActiveCategories();
      if (active && active.length > 0) {
        setCategories(active);
      }
    }
  }, [propCategories]);

  const [draft, setDraft] = useState(() => toFormProduct(product, categories));

  useEffect(() => {
    setDraft(toFormProduct(product, categories));
  }, [product, categories]);

  const isMattress = draft.productSection === 'MATTRESS';

  const setValue = (event) =>
    setDraft((current) => ({ ...current, [event.target.name]: event.target.value }));

  const setArrayValue = (field, value) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const handleCategoryChange = (event) => {
    const selectedCatName = event.target.value;
    const catObj = categories.find((c) => c.name === selectedCatName);
    const firstSub = catObj?.subcategories?.[0] || '';
    setDraft((current) => ({
      ...current,
      category: selectedCatName,
      subcategory: firstSub,
    }));
  };

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!draft.image) {
      alert('Please upload a product image.');
      return;
    }
    if (!draft.productSection) {
      alert('Please select a product section.');
      return;
    }

    let prices = {};
    if (isMattress) {
      prices = Object.fromEntries(
        [4, 5, 6, 8]
          .filter((size) => Number(draft[`price${size}`]) > 0)
          .map((size) => [size, Number(draft[`price${size}`])])
      );
      if (!Object.keys(prices).length) {
        alert('Add at least one thickness price.');
        return;
      }
    }

    const selectedCategoryObj = categories.find((c) => c.name === draft.category);
    const categoryName = draft.category || selectedCategoryObj?.name || 'General';
    const subcategoryName = draft.subcategory || '';
    const eyebrow = subcategoryName ? `${categoryName} · ${subcategoryName}` : categoryName;

    const saved = {
      ...draft,
      id:
        product?.id ||
        draft.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-'),
      category: categoryName,
      subcategory: subcategoryName,
      eyebrow,
      materials: draft.materials
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean),
    };

    if (isMattress) {
      saved.prices = prices;
    } else {
      const flatPrice = Number(draft.price);
      if (flatPrice > 0) saved.price = flatPrice;
      // Remove mattress-only keys for non-mattress products
      delete saved.price4;
      delete saved.price5;
      delete saved.price6;
      delete saved.price8;
      delete saved.needs;
      delete saved.userTypes;
      delete saved.tech;
      delete saved.feels;
    }

    setSaveError('');
    setSaving(true);
    try {
      await onSave(saved);
    } catch (error) {
      setSaveError(error.message || 'Unable to save the product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const currentCategoryObj = categories.find((c) => c.name === draft.category);
  const availableSubcategories = currentCategoryObj?.subcategories || [];

  return (
    <form className="product-form" onSubmit={submit}>
      {/* ── Image Upload ── */}
      <div className="product-form-section image-upload">
        <div>
          {draft.image ? (
            <img src={draft.image} alt="Product preview" />
          ) : (
            <span>Product image preview</span>
          )}
        </div>
        <label className="upload-control">
          Upload product image
          <input type="file" accept="image/*" onChange={uploadImage} />
          <small>JPG, PNG or WEBP · recommended 1200 × 900 px</small>
        </label>
      </div>

      {/* ── Product Classification ── */}
      <div className="product-form-section">
        <h3>Product Classification</h3>
        <div className="form-two-columns">
          <label>
            Product Section <span style={{ color: '#c0392b' }}>*</span>
            <select
              name="productSection"
              value={draft.productSection}
              onChange={setValue}
              required
            >
              <option value="" disabled>
                Select a section
              </option>
              {PRODUCT_SECTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Badge
            <input name="badge" value={draft.badge} onChange={setValue} placeholder="Best seller" />
          </label>
        </div>
      </div>

      {/* ── Basic Product Details ── */}
      <div className="product-form-section">
        <h3>Product Details</h3>
        <div className="form-two-columns">
          <label>
            Product name
            <input
              required
              autoFocus
              name="name"
              value={draft.name}
              onChange={setValue}
              placeholder="e.g. OG-Ortho Luxe"
            />
          </label>
          <label>
            Category
            {categories.length > 0 ? (
              <select
                name="category"
                value={draft.category}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="category"
                value={draft.category}
                onChange={setValue}
                placeholder="Category name"
              />
            )}
          </label>
        </div>

        <div className="form-two-columns">
          <label>
            Sub Category
            {availableSubcategories.length > 0 ? (
              <select name="subcategory" value={draft.subcategory} onChange={setValue}>
                <option value="">No Subcategory</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="subcategory"
                value={draft.subcategory}
                onChange={setValue}
                placeholder="Subcategory (optional)"
              />
            )}
          </label>
          <label>
            Warranty
            <input
              name="warranty"
              value={draft.warranty}
              onChange={setValue}
              placeholder="10 years"
            />
          </label>
        </div>

        <label>
          Short description
          <textarea
            required
            name="description"
            rows="3"
            value={draft.description}
            onChange={setValue}
            placeholder="Describe the comfort, support and ideal sleeper."
          />
        </label>

        <label>
          Materials <small>Separate each with a comma</small>
          <input
            name="materials"
            value={draft.materials}
            onChange={setValue}
            placeholder="Natural Latex, HR foam, Knitted fabric"
          />
        </label>
      </div>

      {/* ── Mattress-specific Attributes ── */}
      {isMattress && (
        <>
          <div className="product-form-section">
            <h3>Mattress Attributes</h3>

            <label style={{ display: 'grid', gap: 6 }}>
              Shop by Need <small>Select all that apply</small>
              <CheckboxGroup
                options={MATTRESS_NEED_OPTIONS}
                selected={draft.needs}
                onChange={(v) => setArrayValue('needs', v)}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Shop by User <small>Select all that apply</small>
              <CheckboxGroup
                options={MATTRESS_USER_OPTIONS}
                selected={draft.userTypes}
                onChange={(v) => setArrayValue('userTypes', v)}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Shop by Tech <small>Select all that apply</small>
              <CheckboxGroup
                options={MATTRESS_TECH_OPTIONS}
                selected={draft.tech}
                onChange={(v) => setArrayValue('tech', v)}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Mattress Feel <small>Select all that apply</small>
              <CheckboxGroup
                options={MATTRESS_FEEL_OPTIONS}
                selected={draft.feels}
                onChange={(v) => setArrayValue('feels', v)}
              />
            </label>

            <label>
              Firmness <small>Free-text label shown on card</small>
              <input
                name="firmness"
                value={draft.firmness}
                onChange={setValue}
                placeholder="Medium firm"
              />
            </label>
          </div>

          {/* ── Mattress Pricing by thickness ── */}
          <div className="product-form-section">
            <h3>
              Pricing by thickness <small>Rate per square foot (₹)</small>
            </h3>
            <div className="form-four-columns">
              {[4, 5, 6, 8].map((size) => (
                <label key={size}>
                  {size} inch
                  <input
                    name={`price${size}`}
                    type="number"
                    min="1"
                    value={draft[`price${size}`]}
                    onChange={setValue}
                    placeholder="0"
                  />
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Non-mattress flat price ── */}
      {!isMattress && (
        <div className="product-form-section">
          <h3>Pricing</h3>
          <label>
            Price (₹) <small>Fixed retail price</small>
            <input
              name="price"
              type="number"
              min="1"
              value={draft.price}
              onChange={setValue}
              placeholder="e.g. 1499"
            />
          </label>
        </div>
      )}

      <div className="product-form-actions">
        {saveError && <p className="account-form-error" role="alert">{saveError}</p>}
        <button type="button" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button className="admin-action" disabled={saving}>
          {saving ? <LoadingSpinner label={product ? 'Updating Product...' : 'Adding Product...'} inline /> : 'Save product'}
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// ProductsPage (admin list view + modal)
// ─────────────────────────────────────────────────────────────
export default function ProductsPage({ products, categories = [], onAdd, onUpdate, onDelete }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const close = () => {
    setIsOpen(false);
    setEditingProduct(null);
  };
  const save = async (product) => {
    if (editingProduct) await onUpdate(product);
    else await onAdd(product);
    close();
  };

  return (
    <>
      <div className="admin-title">
        <div>
          <p>Catalog</p>
          <h1>Products</h1>
        </div>
        <button className="admin-action" onClick={() => setIsOpen(true)}>
          + Add product
        </button>
      </div>

      <section className="admin-card product-admin">
        {products.map((product) => {
          const sectionLabel =
            PRODUCT_SECTION_LABELS[product.productSection] || product.productSection || '—';
          const minPriceDisplay = product.prices
            ? `₹${Math.min(...Object.values(product.prices))}/sq.ft`
            : product.price
            ? `₹${product.price}`
            : '—';

          return (
            <div className="admin-product" key={product.id}>
              <img src={product.image} alt="" />
              <span>
                <b>{product.name}</b>
                <small>
                  <span
                    style={{
                      background: '#f3e9d2',
                      color: '#5e3a00',
                      borderRadius: 4,
                      padding: '1px 7px',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      marginRight: 6,
                    }}
                  >
                    {sectionLabel}
                  </span>
                  {product.category && <strong>{product.category}</strong>}
                  {product.subcategory && ` · ${product.subcategory}`}
                  {product.firmness && ` · ${product.firmness}`}
                  {product.warranty && ` · ${product.warranty} warranty`}
                </small>
                <small className="product-description-preview">{product.description}</small>
              </span>
              <strong>{minPriceDisplay}</strong>
              <button
                className="edit-product"
                onClick={() => {
                  setEditingProduct(product);
                  setIsOpen(true);
                }}
              >
                Edit
              </button>
              <button onClick={() => onDelete(product.id)}>Delete</button>
            </div>
          );
        })}
      </section>

      {isOpen && (
        <AdminModal
          title={editingProduct ? `Edit ${editingProduct.name}` : 'Add a new product'}
          onClose={close}
        >
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSave={save}
            onClose={close}
          />
        </AdminModal>
      )}
    </>
  );
}
