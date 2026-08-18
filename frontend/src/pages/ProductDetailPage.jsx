import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import {
  getPrice,
  sizes,
} from '../data/productsData';

import {
  getMinProductPrice,
} from '../utils/productFilterUtils';

import {
  getProductByIdApi,
} from '../services/catalogService';

import {
  mapProductFromApi,
} from '../utils/catalogMapper';

import './ProductDetailPage.css';


export default function ProductDetailPage({
  id: propId,
  products = [],
  addToCart,
}) {

  /*
  ==================================================
  PRODUCT ID
  ==================================================
  */

  const params =
    useParams();


  const targetId =
    propId ||
    params.id;


  /*
  ==================================================
  PRODUCT STATE
  ==================================================
  */

  const [
    product,
    setProduct,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  /*
  ==================================================
  PRODUCT OPTIONS
  ==================================================
  */

  const [
    selectedSize,
    setSelectedSize,
  ] = useState('72x60');


  const [
    selectedThickness,
    setSelectedThickness,
  ] = useState('6');


  /*
  ==================================================
  LOAD PRODUCT DIRECTLY FROM BACKEND
  ==================================================

  Backend:
  GET /api/products/{id}
  */

  useEffect(() => {

    let cancelled = false;


    const loadProduct =
      async () => {

        if (!targetId) {

          setProduct(null);

          setLoading(false);

          return;
        }


        try {

          setLoading(true);

          setError('');


          /*
           * Optional immediate fallback:
           *
           * If the product already exists in the
           * loaded catalog, we can show it while
           * the fresh backend request completes.
           */

          const cachedProduct =
            products.find(
              (item) =>
                String(item.id) ===
                String(targetId),
            );


          if (
            cachedProduct &&
            !cancelled
          ) {

            setProduct(
              cachedProduct,
            );
          }


          /*
           * Always fetch fresh details
           * from Spring Boot.
           */

          const apiProduct =
            await getProductByIdApi(
              targetId,
            );


          if (cancelled) {
            return;
          }


          const mappedProduct =
            mapProductFromApi(
              apiProduct,
            );


          setProduct(
            mappedProduct,
          );


        } catch (err) {

          if (cancelled) {
            return;
          }


          console.error(
            'Unable to load product details:',
            err,
          );


          /*
           * If catalog fallback exists,
           * keep showing it.
           */

          const fallbackProduct =
            products.find(
              (item) =>
                String(item.id) ===
                String(targetId),
            );


          if (fallbackProduct) {

            setProduct(
              fallbackProduct,
            );

            setError('');

          } else {

            setProduct(null);

            setError(
              err.message ||
              'Unable to load product details.',
            );
          }


        } finally {

          if (!cancelled) {

            setLoading(false);
          }
        }
      };


    loadProduct();


    return () => {

      cancelled = true;
    };

  }, [
    targetId,
    products,
  ]);


  /*
  ==================================================
  THICKNESS OPTIONS
  ==================================================
  */

  const thicknessKeys =
    Object.keys(
      product?.prices || {},
    );


  useEffect(() => {

    const keys =
      Object.keys(
        product?.prices || {},
      );


    if (
      keys.length > 0
    ) {

      setSelectedThickness(
        (previous) => {

          if (
            keys.includes(
              String(previous),
            )
          ) {

            return String(
              previous,
            );
          }


          return keys[0];
        },
      );
    }

  }, [product]);


  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (
    loading &&
    !product
  ) {

    return (

      <div
        className="container product-not-found"
      >

        <span
          className="product-not-found-icon"
        >
          🛏️
        </span>


        <h2>
          Loading product...
        </h2>


        <p>
          Please wait while we load
          the latest product details.
        </p>

      </div>
    );
  }


  /*
  ==================================================
  ERROR / PRODUCT NOT FOUND
  ==================================================
  */

  if (!product) {

    return (

      <div
        className="container product-not-found"
      >

        <span
          className="product-not-found-icon"
        >
          🛏️
        </span>


        <h2>
          Product not found
        </h2>


        <p>

          {
            error ||
            'The mattress you are looking for is not currently available.'
          }

        </p>


        <a
          href="#mattresses"
          className="button button-primary"
        >
          Browse All Mattresses →
        </a>

      </div>
    );
  }


  /*
  ==================================================
  PRICE
  ==================================================
  */

  const price =
    getPrice(
      product,
      selectedSize,
      selectedThickness,
    );


  const minimumPrice =
    getMinProductPrice(
      product,
    );


  const displayPrice =
    price > 0
      ? price
      : minimumPrice;


  /*
   * Existing UI uses a display discount.
   *
   * Backend currently does not provide a
   * trusted discountPercent field.
   *
   * Keep current UI behavior for now.
   * Payment amount will come only from backend
   * cart/checkout in later phases.
   */

  const discountPercent =
    product.discountPercent ||
    15;


  const originalPrice =
    Math.round(
      displayPrice *
      (
        1 +
        discountPercent /
        100
      ),
    );


  const materials =
    Array.isArray(
      product.materials,
    )
      ? product.materials
      : [];


  /*
  ==================================================
  UI
  ==================================================
  */

  return (

    <div className="product-detail-page">

      <div className="container">

        <nav
          className="product-breadcrumb"
          aria-label="Breadcrumb"
        >

          <a href="#home">
            Home
          </a>


          <span>
            /
          </span>


          <a href="#mattresses">
            Mattresses
          </a>


          <span>
            /
          </span>


          <span
            className="breadcrumb-current"
          >
            {product.name}
          </span>

        </nav>


        <div className="product-detail-grid">

          {/* =====================================
              IMAGE
          ===================================== */}

          <div className="product-detail-image-col">

            <div className="product-detail-image-wrap">

              <img
                src={product.image}
                alt={product.name}
              />


              {
                product.badge && (

                  <span className="product-detail-badge">
                    {product.badge}
                  </span>
                )
              }

            </div>

          </div>


          {/* =====================================
              PRODUCT INFO
          ===================================== */}

          <div className="product-detail-info-col">

            <span className="product-detail-eyebrow">

              {
                product.category
              }

              {
                product.eyebrow
                  ? ` • ${product.eyebrow}`
                  : ''
              }

            </span>


            <h1 className="product-detail-title">
              {product.name}
            </h1>


            <div className="product-detail-rating">

              <span className="stars">
                ★★★★★
              </span>


              <strong>
                {
                  product.rating ||
                  4.8
                }
              </strong>


              <small>

                (
                {
                  product.reviewCount ||
                  28
                }
                {' '}
                reviews)

              </small>

            </div>


            <p className="product-detail-desc">
              {product.description}
            </p>


            {/* =================================
                SPECS
            ================================= */}

            <div className="product-detail-specs-box">

              <div>

                <strong>
                  Firmness:
                </strong>

                {' '}

                <span>
                  {
                    product.firmness ||
                    'Medium firm'
                  }
                </span>

              </div>


              <div>

                <strong>
                  Warranty:
                </strong>

                {' '}

                <span>
                  {
                    product.warranty ||
                    '10 years'
                  }
                </span>

              </div>

            </div>


            {/* =================================
                MATERIALS
            ================================= */}

            {
              materials.length > 0 && (

                <div className="product-detail-materials">

                  <strong>
                    Key Materials:
                  </strong>


                  <div className="materials-tags">

                    {
                      materials.map(
                        (material) => (

                          <span
                            key={material}
                            className="mat-tag"
                          >
                            {material}
                          </span>
                        ),
                      )
                    }

                  </div>

                </div>
              )
            }


            {/* =================================
                THICKNESS
            ================================= */}

            {
              thicknessKeys.length >
                0 && (

                <div className="quickview-option-row">

                  <label>
                    Thickness:
                  </label>


                  <div className="thickness-pills">

                    {
                      thicknessKeys.map(
                        (thickness) => (

                          <button
                            type="button"
                            key={thickness}
                            className={
                              `thickness-pill ${
                                String(
                                  thickness,
                                ) ===
                                String(
                                  selectedThickness,
                                )
                                  ? 'active'
                                  : ''
                              }`
                            }
                            onClick={
                              () =>
                                setSelectedThickness(
                                  String(
                                    thickness,
                                  ),
                                )
                            }
                            aria-pressed={
                              String(
                                thickness,
                              ) ===
                              String(
                                selectedThickness,
                              )
                            }
                          >

                            {thickness}
                            &quot;

                          </button>
                        ),
                      )
                    }

                  </div>

                </div>
              )
            }


            {/* =================================
                SIZE
            ================================= */}

            <div className="quickview-option-row">

              <label
                htmlFor="detail-size-select"
              >
                Size:
              </label>


              <select
                id="detail-size-select"
                value={selectedSize}
                onChange={
                  (event) =>
                    setSelectedSize(
                      event.target.value,
                    )
                }
              >

                {
                  sizes.map(
                    (size) => (

                      <option
                        key={size}
                        value={size}
                      >

                        {size} in

                      </option>
                    ),
                  )
                }

              </select>

            </div>


            {/* =================================
                PRICE
            ================================= */}

            <div className="product-detail-price-row">

              <div>

                <small>
                  Total Price
                </small>


                <strong className="price-val">

                  ₹
                  {
                    Number(
                      displayPrice || 0,
                    ).toLocaleString(
                      'en-IN',
                    )
                  }

                </strong>


                <del className="original-price">

                  ₹
                  {
                    Number(
                      originalPrice || 0,
                    ).toLocaleString(
                      'en-IN',
                    )
                  }

                </del>


                <span className="discount-tag">

                  (
                  {discountPercent}
                  % OFF)

                </span>

              </div>


              <span className="tax-inclusive-text">
                (Incl. of all taxes)
              </span>

            </div>


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="product-detail-actions">

              <button
                type="button"
                className="button button-primary quickview-add-btn"
                onClick={
                  () =>
                    addToCart({
                      ...product,

                      size:
                        selectedSize,

                      thickness:
                        selectedThickness,

                      price:
                        displayPrice,
                    })
                }
              >
                ADD TO CART
              </button>


              <a
                href="#mattresses"
                className="back-to-mattresses"
              >
                ← Back to Mattresses
              </a>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}