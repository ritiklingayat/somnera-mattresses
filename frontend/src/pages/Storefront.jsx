import {
  useState,
} from 'react';

import {
  getPrice,
  sizes,
} from '../data/productsData';

import {
  siteConfig,
} from '../config/siteConfig';

import {
  initializeCheckoutApi,
} from '../services/checkoutService';

import './Storefront.css';

import {
  verifyPaymentApi,
} from '../services/paymentService';


const icons = [
  '✦',
  '◌',
  '⌁',
  '◈',
];


/*
==================================================
INTRO
==================================================
*/

function loadRazorpayScript() {

  return new Promise(
    (resolve) => {

      /*
       * Already loaded
       */

      if (
        window.Razorpay
      ) {

        resolve(true);

        return;
      }


      const existingScript =
        document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
        );


      if (
        existingScript
      ) {

        existingScript.addEventListener(
          'load',
          () =>
            resolve(true),
        );


        existingScript.addEventListener(
          'error',
          () =>
            resolve(false),
        );


        return;
      }


      const script =
        document.createElement(
          'script',
        );


      script.src =
        'https://checkout.razorpay.com/v1/checkout.js';


      script.async =
        true;


      script.onload =
        () =>
          resolve(true);


      script.onerror =
        () =>
          resolve(false);


      document.body.appendChild(
        script,
      );
    },
  );
}

function Intro({
  eyebrow,
  title,
  copy,
  children,
}) {

  return (

    <section className="page-intro">

      <div className="container">

        <span className="section-kicker">
          {eyebrow}
        </span>


        <h1>
          {title}
        </h1>


        <p>
          {copy}
        </p>


        {children}

      </div>

    </section>
  );
}


/*
==================================================
PRODUCT CARD
==================================================
*/

function ProductCard({
  product,
  addToCart,
}) {

  const thicknesses =
    Object.keys(
      product.prices || {},
    );


  const [
    size,
    setSize,
  ] = useState(
    '72x60',
  );


  const [
    thickness,
    setThickness,
  ] = useState(
    thicknesses[0] ||
    '6',
  );


  const price =
    getPrice(
      product,
      size,
      thickness,
    );


  return (

    <article className="product-card">

      <div className="product-image">

        {
          product.badge && (

            <span>
              {product.badge}
            </span>
          )
        }


        <img
          src={product.image}
          alt={product.name}
        />

      </div>


      <div className="product-card-body">

        <p className="product-eyebrow">

          {
            product.category
              ? (
                <strong>
                  {product.category}
                  {' · '}
                </strong>
              )
              : null
          }


          {product.eyebrow}

        </p>


        <h2>
          {product.name}
        </h2>


        <p>
          {product.description}
        </p>


        {
          thicknesses.length >
            0 && (

            <div className="pill-row">

              {
                thicknesses.map(
                  (itemThickness) => (

                    <button
                      type="button"
                      className={
                        itemThickness ===
                        thickness
                          ? 'pill active'
                          : 'pill'
                      }
                      onClick={
                        () =>
                          setThickness(
                            itemThickness,
                          )
                      }
                      key={
                        itemThickness
                      }
                    >

                      {
                        itemThickness
                      }
                      &quot;

                    </button>
                  ),
                )
              }

            </div>
          )
        }


        <select
          aria-label="Mattress size"
          value={size}
          onChange={
            (event) =>
              setSize(
                event.target.value,
              )
          }
        >

          {
            sizes.map(
              (itemSize) => (

                <option
                  key={
                    itemSize
                  }
                  value={
                    itemSize
                  }
                >

                  {
                    itemSize
                  }
                  {' in'}

                </option>
              ),
            )
          }

        </select>


        <div className="card-bottom">

          <div>

            <small>
              From
            </small>


            <strong>

              ₹
              {
                Number(
                  price || 0,
                ).toLocaleString(
                  'en-IN',
                )
              }

            </strong>

          </div>


          <button
            type="button"
            className="add-button"
            onClick={
              () =>
                addToCart({
                  ...product,

                  size,

                  thickness,

                  price,
                })
            }
          >
            Add to cart
          </button>

        </div>

      </div>

    </article>
  );
}


/*
==================================================
PRODUCTS
==================================================
*/

function Products({
  products,
  addToCart,
}) {

  const [
    activeCategory,
    setActiveCategory,
  ] = useState(
    'All',
  );


  const categories = [
    'All',

    ...new Set(
      products
        .map(
          (product) =>
            product.category,
        )
        .filter(Boolean),
    ),
  ];


  const filteredProducts =
    activeCategory ===
      'All'
      ? products
      : products.filter(
          (product) =>
            product.category ===
            activeCategory,
        );


  return (

    <>

      <Intro
        eyebrow="The collection"
        title="Find your sleep signature."
        copy="Five considered comfort systems, made with premium materials and support that holds its shape night after night."
      />


      {
        categories.length >
          1 && (

          <div className="category-filters container">

            {
              categories.map(
                (category) => (

                  <button
                    type="button"
                    key={
                      category
                    }
                    className={
                      `filter-pill ${
                        category ===
                        activeCategory
                          ? 'active'
                          : ''
                      }`
                    }
                    onClick={
                      () =>
                        setActiveCategory(
                          category,
                        )
                    }
                  >

                    {
                      category
                    }

                  </button>
                ),
              )
            }

          </div>
        )
      }


      <section className="catalog container">

        {
          filteredProducts.map(
            (product) => (

              <ProductCard
                key={
                  product.id
                }
                product={
                  product
                }
                addToCart={
                  addToCart
                }
              />
            ),
          )
        }

      </section>


      <section className="size-guide">

        <div className="container two-col">

          <div>

            <span className="section-kicker">
              Interactive size guide
            </span>


            <h2>
              Choose the room, then the mattress.
            </h2>


            <p>
              Our size range is designed for every kind of sleeper and every kind of space.
            </p>

          </div>


          <div className="size-grid">

            {
              [
                'Single · 30–36 in',
                'Double · 48 in',
                'Queen · 60–66 in',
                'King · 72 in',
              ].map(
                (
                  item,
                  index,
                ) => (

                  <div
                    key={
                      item
                    }
                  >

                    <b>
                      {
                        icons[index]
                      }
                    </b>

                    {item}

                  </div>
                ),
              )
            }

          </div>

        </div>

      </section>

    </>
  );
}


/*
==================================================
ABOUT
==================================================
*/

function About() {

  return (

    <>

      <Intro
        eyebrow="Our story"
        title="Better sleep, thoughtfully made."
        copy="Somnera is an Indian sleep company bringing considered comfort, honest materials and deeply restorative rest to homes across the country."
      />


      <section className="container story-grid">

        <div>

          <h2>
            Our mission
          </h2>


          <p>
            To make a great night's sleep feel attainable—through mattresses engineered for real bodies, real homes and everyday wellbeing.
          </p>


          <h2>
            Our vision
          </h2>


          <p>
            To become the most trusted name in sleep comfort, where every product is as reliable as the rest it delivers.
          </p>

        </div>


        <div className="story-panel">

          <span>
            01
          </span>


          <h2>
            Manufacturing excellence
          </h2>


          <p>
            From foam formulation to final finish, our experienced craftsmen and precision machinery work under one roof for consistent quality.
          </p>


          <hr />


          <span>
            02
          </span>


          <h2>
            Quality assurance
          </h2>


          <p>
            Every Somnera mattress is tested for comfort, resilience and durability before it finds its way to your bedroom.
          </p>

        </div>

      </section>

    </>
  );
}


/*
==================================================
GALLERY
==================================================
*/

function Gallery({
  products,
}) {

  return (

    <>

      <Intro
        eyebrow="Made to be lived in"
        title="A closer look at Somnera."
        copy="The details, people and spaces that make restorative sleep possible."
      />


      <section className="gallery-grid container">

        {
          products.map(
            (
              product,
              index,
            ) => (

              <figure
                key={
                  product.id
                }
                className={
                  `gallery-item gallery-${index}`
                }
              >

                <img
                  src={
                    product.image
                  }
                  alt={
                    `${product.name} mattress`
                  }
                />


                <figcaption>

                  {
                    index < 2
                      ? 'Product details'
                      : 'Comfort, made here'
                  }

                </figcaption>

              </figure>
            ),
          )
        }


        <div className="gallery-copy">

          <span className="section-kicker">
            From our factory
          </span>


          <h2>
            Crafting comfort with care.
          </h2>


          <p>
            Layer by layer, we make mattresses that perform beautifully for years.
          </p>

        </div>

      </section>

    </>
  );
}


/*
==================================================
WARRANTY
==================================================
*/

function Warranty({
  onNavigate,
}) {

  return (

    <>

      <Intro
        eyebrow="The Somnera promise"
        title="Comfort that stays with you."
        copy="Every Somnera mattress is backed by a clear, straightforward warranty and support from people who care."
      />


      <section className="container promise-grid">

        {
          [
            [
              '01',
              'Register your mattress',
              'Keep your purchase invoice and register your mattress after delivery.',
            ],

            [
              '02',
              'Raise a claim',
              'Connect with our support team with your order details and photos.',
            ],

            [
              '03',
              'We take care of it',
              'Our team will assess your claim and guide you to a quick resolution.',
            ],
          ].map(
            ([
              number,
              title,
              copy,
            ]) => (

              <article
                key={
                  number
                }
              >

                <span>
                  {number}
                </span>


                <h2>
                  {title}
                </h2>


                <p>
                  {copy}
                </p>

              </article>
            ),
          )
        }

      </section>


      <section className="warranty-terms">

        <div className="container">

          <h2>
            Warranty terms at a glance
          </h2>


          <div className="terms">

            <p>
              Coverage against manufacturing defects in foam and workmanship.
            </p>

            <p>
              Valid only with a valid purchase invoice and original product label.
            </p>

            <p>
              Normal softening, accidental damage and improper use are not covered.
            </p>

          </div>


          <button
            type="button"
            className="button button-primary"
            onClick={
              () =>
                onNavigate(
                  'contact',
                )
            }
          >
            Start a warranty claim
          </button>

        </div>

      </section>

    </>
  );
}


/*
==================================================
CONTACT
==================================================
*/

function Contact() {

  return (

    <>

      <Intro
        eyebrow="Sleep support, made personal"
        title="Let’s find your perfect comfort."
        copy="Whether you are choosing your first Somnera or need help with an order, our sleep experts are here for you."
      />


      <section className="contact-page container">

        <div className="contact-intro">

          <span className="section-kicker">
            Talk to a sleep expert
          </span>


          <h2>
            Comfort begins with a conversation.
          </h2>


          <p>
            Reach us in the way that feels easiest. We are happy to help you find the right feel, size and support for your home.
          </p>


          <div className="contact-methods">

            <a
              href={
                `tel:${siteConfig.phone}`
              }
            >

              <b>
                ☎
              </b>


              <span>

                <small>
                  Call us
                </small>

                +91
                {' '}
                {
                  siteConfig.phone
                }

              </span>


              <i>
                →
              </i>

            </a>


            <a
              href={
                `mailto:${siteConfig.email}`
              }
            >

              <b>
                ✉
              </b>


              <span>

                <small>
                  Email us
                </small>

                {
                  siteConfig.email
                }

              </span>


              <i>
                →
              </i>

            </a>


            <a
              className="contact-whatsapp"
              target="_blank"
              rel="noreferrer"
              href={
                `https://wa.me/${siteConfig.whatsapp}`
              }
            >

              <b>
                ◌
              </b>


              <span>

                <small>
                  Fastest response
                </small>

                Chat on WhatsApp

              </span>


              <i>
                ↗
              </i>

            </a>

          </div>


          <div className="contact-map">

            <div className="map-pin">
              ✦
            </div>


            <div>

              <strong>
                Somnera Mattress & Foam
              </strong>


              <span>
                India · Serving better sleep nationwide
              </span>

            </div>


            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
            >
              View on map ↗
            </a>

          </div>

        </div>


        <form
          className="contact-form contact-form-premium"
          onSubmit={
            (event) => {

              event.preventDefault();


              alert(
                'Thank you! Our sleep experts will be in touch shortly.',
              );
            }
          }
        >

          <div className="form-heading">

            <span>
              Send a message
            </span>


            <h2>
              How can we help?
            </h2>


            <p>
              Tell us a little about what you need. We usually respond within one business day.
            </p>

          </div>


          <div className="contact-two-fields">

            <label>

              Full name

              <input
                required
                placeholder="Your name"
              />

            </label>


            <label>

              Mobile number

              <input
                required
                type="tel"
                placeholder="+91 00000 00000"
              />

            </label>

          </div>


          <label>

            Email address

            <input
              required
              type="email"
              placeholder="you@example.com"
            />

          </label>


          <label>

            What can we help with?

            <select
              defaultValue=""
            >

              <option
                value=""
                disabled
              >
                Select a topic
              </option>

              <option>
                Choose a mattress
              </option>

              <option>
                Existing order
              </option>

              <option>
                Warranty support
              </option>

              <option>
                Other enquiry
              </option>

            </select>

          </label>


          <label>

            Your message

            <textarea
              required
              rows="4"
              placeholder="Tell us about your sleep needs"
            />

          </label>


          <button className="button button-primary">

            Send enquiry

            {' '}

            <span>
              →
            </span>

          </button>


          <small className="form-note">
            By sending this form, you agree to be contacted by Somnera.
          </small>

        </form>

      </section>


      <section className="contact-reassurance">

        <div className="container">

          <span>
            Made with care
          </span>


          <p>
            Expert guidance · Secure support · Premium comfort
          </p>

        </div>

      </section>

    </>
  );
}


/*
==================================================
CART
==================================================
*/

function Cart({
  cart,
  cartTotal,
  cartLoading,
  updateQuantity,
  removeCartItem,
  clearCart,
  onNavigate,
}) {

  return (

    <>

      <Intro
        eyebrow="Your selection"
        title="Your comfort cart."
        copy={
          cart.length
            ? 'A better night is just a few steps away.'
            : 'Your cart is waiting for the mattress made for you.'
        }
      />


      <section className="container cart-layout">

        {
          cartLoading
            ? (

              <div className="empty-cart">

                <h2>
                  Loading your cart...
                </h2>

              </div>
            )

            : cart.length > 0
              ? (

                <div className="cart-items">

                  <div
                    style={{
                      display:
                        'flex',

                      justifyContent:
                        'flex-end',

                      marginBottom:
                        '16px',
                    }}
                  >

                    <button
                      type="button"
                      className="button button-dark"
                      onClick={
                        clearCart
                      }
                    >
                      Clear Cart
                    </button>

                  </div>


                  {
                    cart.map(
                      (item) => (

                        <article
                          className="cart-item"
                          key={
                            item.cartItemId
                          }
                        >

                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                          />


                          <div>

                            <h2>
                              {
                                item.name
                              }
                            </h2>


                            <p>

                              {
                                item.thickness
                              }

                              &quot; thickness

                            </p>


                            {
                              item.category && (

                                <small>

                                  {
                                    item.category
                                  }

                                  {
                                    item.subcategory
                                      ? ` · ${item.subcategory}`
                                      : ''
                                  }

                                </small>
                              )
                            }


                            <strong>

                              ₹
                              {
                                Number(
                                  item.unitPrice ||
                                  0,
                                ).toLocaleString(
                                  'en-IN',
                                )
                              }

                            </strong>


                            <small>

                              Item total:
                              {' '}

                              <strong>

                                ₹
                                {
                                  Number(
                                    item.itemTotal ||
                                    0,
                                  ).toLocaleString(
                                    'en-IN',
                                  )
                                }

                              </strong>

                            </small>

                          </div>


                          <div>

                            <div className="quantity">

                              <button
                                type="button"
                                onClick={
                                  () =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity -
                                        1,
                                    )
                                }
                              >
                                −
                              </button>


                              <b>
                                {
                                  item.quantity
                                }
                              </b>


                              <button
                                type="button"
                                disabled={
                                  item.quantity >=
                                  10
                                }
                                onClick={
                                  () =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity +
                                        1,
                                    )
                                }
                              >
                                +
                              </button>

                            </div>


                            <button
                              type="button"
                              onClick={
                                () =>
                                  removeCartItem(
                                    item.cartItemId,
                                  )
                              }
                              style={{
                                marginTop:
                                  '10px',
                              }}
                            >
                              Remove
                            </button>

                          </div>

                        </article>
                      ),
                    )
                  }

                </div>
              )

              : (

                <div className="empty-cart">

                  <h2>
                    Your cart is empty.
                  </h2>


                  <button
                    type="button"
                    className="button button-dark"
                    onClick={
                      () =>
                        onNavigate(
                          'mattresses',
                        )
                    }
                  >
                    Browse mattresses
                  </button>

                </div>
              )
        }


        <aside className="summary">

          <h2>
            Order summary
          </h2>


          <p>

            Subtotal

            <strong>

              ₹
              {
                Number(
                  cartTotal ||
                  0,
                ).toLocaleString(
                  'en-IN',
                )
              }

            </strong>

          </p>


          <p>

            Delivery

            <strong>
              Free
            </strong>

          </p>


          <hr />


          <h3>

            Total

            <strong>

              ₹
              {
                Number(
                  cartTotal ||
                  0,
                ).toLocaleString(
                  'en-IN',
                )
              }

            </strong>

          </h3>


          <button
            type="button"
            disabled={
              !cart.length ||
              cartLoading
            }
            className="button button-primary"
            onClick={
              () =>
                onNavigate(
                  'checkout',
                )
            }
          >
            Secure checkout
          </button>

        </aside>

      </section>

    </>
  );
}


/*
==================================================
CHECKOUT
==================================================

Phase 6:
POST /api/checkout

Phase 7:
Open Razorpay + verify payment
==================================================
*/

function Checkout({
  cart,
  cartTotal,
  onNavigate,
  onPaymentSuccess,
}) {

  /*
  ==================================================
  FORM STATE
  ==================================================
  */

  const [
    form,
    setForm,
  ] = useState({

    fullName: '',

    mobile: '',

    email: '',

    city: '',

    state: '',

    pincode: '',

    fullAddress: '',

    paymentMethod:
      'UPI',

  });


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    checkoutError,
    setCheckoutError,
  ] = useState('');


  const [
  paymentProcessing,
  setPaymentProcessing,
] = useState(false);


const [
  paymentSuccess,
  setPaymentSuccess,
] = useState(false);


  /*
  ==================================================
  INPUT CHANGE
  ==================================================
  */

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } =
        event.target;


      setForm(
        (current) => ({
          ...current,

          [name]:
            value,
        }),
      );


      if (checkoutError) {

        setCheckoutError('');
      }
    };


  /*
  ==================================================
  FRONTEND VALIDATION
  ==================================================

  Backend validation remains authoritative.
  This simply gives faster user feedback.
  */

  const validate =
    () => {

      const fullName =
        form.fullName.trim();


      const mobile =
        form.mobile.trim();


      const email =
        form.email.trim();


      const city =
        form.city.trim();


      const state =
        form.state.trim();


      const pincode =
        form.pincode.trim();


      const fullAddress =
        form.fullAddress.trim();


      if (
        fullName.length <
        2
      ) {

        return (
          'Please enter your full name.'
        );
      }


      if (
        !/^[6-9][0-9]{9}$/.test(
          mobile,
        )
      ) {

        return (
          'Please enter a valid 10 digit mobile number.'
        );
      }


      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email,
        )
      ) {

        return (
          'Please enter a valid email address.'
        );
      }


      if (!city) {

        return (
          'Please enter your city.'
        );
      }


      if (!state) {

        return (
          'Please enter your state.'
        );
      }


      if (
        !/^[1-9][0-9]{5}$/.test(
          pincode,
        )
      ) {

        return (
          'Please enter a valid 6 digit pincode.'
        );
      }


      if (
        fullAddress.length <
        5
      ) {

        return (
          'Please enter your complete delivery address.'
        );
      }


      if (
        ![
          'UPI',
          'CARD',
          'NET_BANKING',
          'WALLET',
        ].includes(
          form.paymentMethod,
        )
      ) {

        return (
          'Please select a payment method.'
        );
      }


      return '';
    };


  /*
  ==================================================
  INITIALIZE CHECKOUT
  ==================================================
  */

  const handleCheckout =
  async (event) => {

    event.preventDefault();


    if (
      cart.length ===
      0
    ) {

      setCheckoutError(
        'Your cart is empty.',
      );

      return;
    }


    const validationError =
      validate();


    if (
      validationError
    ) {

      setCheckoutError(
        validationError,
      );

      return;
    }


    try {

      setSubmitting(
        true,
      );


      setCheckoutError('');


      setPaymentSuccess(
        false,
      );


      /*
      ==============================================
      CREATE INTERNAL ORDER + RAZORPAY ORDER
      ==============================================
      */

      const result =
        await initializeCheckoutApi(
          form,
        );


      if (
        !result?.orderId ||
        !result?.razorpayOrderId ||
        !result?.razorpayKeyId ||
        !result?.amountInPaise
      ) {

        throw new Error(
          'Invalid checkout response from server.',
        );
      }


      /*
      ==============================================
      LOAD RAZORPAY SDK
      ==============================================
      */

      const razorpayLoaded =
        await loadRazorpayScript();


      if (
        !razorpayLoaded
      ) {

        throw new Error(
          'Unable to load Razorpay. Please check your internet connection and try again.',
        );
      }


      /*
      ==============================================
      RAZORPAY OPTIONS
      ==============================================
      */

      const options = {

        key:
          result.razorpayKeyId,


        amount:
          result.amountInPaise,


        currency:
          result.currency ||
          'INR',


        name:
          'Somnera Mattresses',


        description:
          `Order #${result.orderId}`,


        order_id:
          result.razorpayOrderId,


        handler:
          async (
            razorpayResponse,
          ) => {

            try {

              setPaymentProcessing(
                true,
              );


              setCheckoutError('');


              const verification =
                await verifyPaymentApi({

                  orderId:
                    result.orderId,

                  razorpayOrderId:
                    razorpayResponse
                      .razorpay_order_id,

                  razorpayPaymentId:
                    razorpayResponse
                      .razorpay_payment_id,

                  razorpaySignature:
                    razorpayResponse
                      .razorpay_signature,
                });


              console.log(
                'Payment verification:',
                verification,
              );


              setPaymentSuccess(
                true,
              );


              await onPaymentSuccess?.();


              window.setTimeout(
                () => {

                  onNavigate?.(
                    'orders',
                  );
                },
                1200,
              );


            } catch (error) {

              console.error(
                'Payment verification failed:',
                error,
              );


              setCheckoutError(
                error.message ||
                'Payment verification failed. Please contact support if the amount was deducted.',
              );


            } finally {

              setPaymentProcessing(
                false,
              );
            }
          },


        prefill: {

          name:
            form.fullName,

          email:
            form.email,

          contact:
            form.mobile,
        },


        notes: {

          internalOrderId:
            String(
              result.orderId,
            ),
        },


        modal: {

          ondismiss:
            () => {

              setCheckoutError(
                'Payment was cancelled. Your order is still pending payment.',
              );
            },
        },
      };


      const razorpay =
        new window.Razorpay(
          options,
        );


      razorpay.on(
        'payment.failed',
        (
          response,
        ) => {

          console.error(
            'Razorpay payment failed:',
            response?.error,
          );


          setCheckoutError(
            response?.error
              ?.description ||
            'Payment failed. Please try again.',
          );
        },
      );


      razorpay.open();


    } catch (error) {

      setCheckoutError(
        error.message ||
        'Unable to initialize payment.',
      );


    } finally {

      /*
       * This only controls checkout initialization.
       *
       * Razorpay verification has its own
       * paymentProcessing state.
       */

      setSubmitting(
        false,
      );
    }
  };




  /*
  ==================================================
  UI
  ==================================================
  */

  return (

    <>

      <Intro
        eyebrow="Secure checkout"
        title="Almost ready for better sleep."
        copy="Your details are protected. We will confirm your order before dispatch."
      />


      <section className="container checkout">

        <form
          onSubmit={
            handleCheckout
          }
        >

          <h2>
            Delivery information
          </h2>


          <div className="form-grid">

            <label>

              Full Name

              <input
                required
                name="fullName"
                value={
                  form.fullName
                }
                onChange={
                  handleChange
                }
                minLength="2"
                maxLength="120"
                autoComplete="name"
                placeholder="Your full name"
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

            </label>


            <label>

              Mobile

              <input
                required
                name="mobile"
                type="tel"
                value={
                  form.mobile
                }
                onChange={
                  (event) => {

                    const value =
                      event.target.value
                        .replace(
                          /\D/g,
                          '',
                        )
                        .slice(
                          0,
                          10,
                        );


                    setForm(
                      (current) => ({
                        ...current,

                        mobile:
                          value,
                      }),
                    );


                    if (
                      checkoutError
                    ) {

                      setCheckoutError('');
                    }
                  }
                }
                inputMode="numeric"
                maxLength="10"
                autoComplete="tel"
                placeholder="10 digit mobile number"
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

            </label>


            <label>

              Email

              <input
                required
                name="email"
                type="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                maxLength="150"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

            </label>


            <label>

              City

              <input
                required
                name="city"
                value={
                  form.city
                }
                onChange={
                  handleChange
                }
                maxLength="100"
                autoComplete="address-level2"
                placeholder="City"
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

            </label>


            <label>

              State

              <input
                required
                name="state"
                value={
                  form.state
                }
                onChange={
                  handleChange
                }
                maxLength="100"
                autoComplete="address-level1"
                placeholder="State"
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

            </label>


            <label>

              Pincode

              <input
                required
                name="pincode"
                value={
                  form.pincode
                }
                onChange={
                  (event) => {

                    const value =
                      event.target.value
                        .replace(
                          /\D/g,
                          '',
                        )
                        .slice(
                          0,
                          6,
                        );


                    setForm(
                      (current) => ({
                        ...current,

                        pincode:
                          value,
                      }),
                    );


                    if (
                      checkoutError
                    ) {

                      setCheckoutError('');
                    }
                  }
                }
                inputMode="numeric"
                maxLength="6"
                autoComplete="postal-code"
                placeholder="6 digit pincode"
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

            </label>

          </div>


          <label>

            Full Address

            <textarea
              required
              name="fullAddress"
              value={
                form.fullAddress
              }
              onChange={
                handleChange
              }
              rows="3"
              minLength="5"
              maxLength="500"
              autoComplete="street-address"
              placeholder="House / Flat, Street, Area, Landmark"
              disabled={
                submitting
              }
            />

          </label>


          <h2>
            Payment Method
          </h2>


          <div className="payment-options">

            <label>

              <input
                name="paymentMethod"
                type="radio"
                value="UPI"
                checked={
                  form.paymentMethod ===
                  'UPI'
                }
                onChange={
                  handleChange
                }
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

              UPI

            </label>


            <label>

              <input
                name="paymentMethod"
                type="radio"
                value="CARD"
                checked={
                  form.paymentMethod ===
                  'CARD'
                }
                onChange={
                  handleChange
                }
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

              Credit / Debit Card

            </label>


            <label>

              <input
                name="paymentMethod"
                type="radio"
                value="NET_BANKING"
                checked={
                  form.paymentMethod ===
                  'NET_BANKING'
                }
                onChange={
                  handleChange
                }
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

              Net Banking

            </label>


            <label>

              <input
                name="paymentMethod"
                type="radio"
                value="WALLET"
                checked={
                  form.paymentMethod ===
                  'WALLET'
                }
                onChange={
                  handleChange
                }
                disabled={
                  submitting ||
                  paymentProcessing
                }
              />

              Wallet

            </label>

          </div>


          <p className="razorpay">
            Secure payments powered by Razorpay
          </p>


          {
            checkoutError && (

              <p
                role="alert"
                style={{
                  color:
                    '#b42318',

                  marginBottom:
                    '16px',
                }}
              >

                {
                  checkoutError
                }

              </p>
            )
          }


          {
            paymentSuccess && (

              <div
                style={{
                  padding:
                    '16px',

                  marginBottom:
                    '18px',

                  border:
                    '1px solid #bbf7d0',

                  borderRadius:
                    '10px',

                  background:
                    '#f0fdf4',
                }}
              >

                <strong>
                  Payment successful!
                </strong>


                <p
                  style={{
                    margin:
                      '6px 0 0',
                  }}
                >
                  Your order has been confirmed.
                </p>

              </div>
            )
          }


          <button
  type="submit"
  className="button button-primary"
  disabled={
    submitting ||
    paymentProcessing ||
    paymentSuccess ||
    !cart.length
  }
>

            {
  paymentProcessing
    ? 'Verifying payment...'

    : submitting
      ? 'Preparing secure payment...'

      : paymentSuccess
        ? 'Payment Successful'

        : (
          <>
            Pay Securely
            {' '}
            ₹
            {
              Number(
                cartTotal ||
                0,
              ).toLocaleString(
                'en-IN',
              )
            }
          </>
        )
}

          </button>

        </form>


        <aside className="summary">

          <h2>
            Your order
          </h2>


          {
            cart.map(
              (item) => (

                <p
                  key={
                    item.cartItemId
                  }
                >

                  <span>

                    {
                      item.name
                    }

                    {' × '}

                    {
                      item.quantity
                    }


                    {
                      item.thickness && (

                        <small
                          style={{
                            display:
                              'block',
                          }}
                        >

                          {
                            item.thickness
                          }

                          &quot; thickness

                        </small>
                      )
                    }

                  </span>


                  <strong>

                    ₹
                    {
                      Number(
                        item.itemTotal ||
                        0,
                      ).toLocaleString(
                        'en-IN',
                      )
                    }

                  </strong>

                </p>
              ),
            )
          }


          <hr />


          <h3>

            Total

            <strong>

              ₹
              {
                Number(
                  cartTotal ||
                  0,
                ).toLocaleString(
                  'en-IN',
                )
              }

            </strong>

          </h3>


          <small>
            Final payment amount is verified and calculated by the Somnera server.
          </small>

        </aside>

      </section>

    </>
  );
}


/*
==================================================
OLD STOREFRONT ADMIN
==================================================
*/

function Admin({
  products,
  setProducts,
}) {

  const [
    name,
    setName,
  ] = useState('');


  const [
    editing,
    setEditing,
  ] = useState(null);


  const save =
    () => {

      if (
        !name.trim()
      ) {
        return;
      }


      if (
        editing !==
        null
      ) {

        setProducts(
          products.map(
            (
              product,
              index,
            ) =>
              index ===
              editing
                ? {
                    ...product,
                    name,
                  }
                : product,
          ),
        );

      } else {

        setProducts([
          ...products,

          {
            ...products[0],

            id:
              name
                .toLowerCase()
                .replaceAll(
                  ' ',
                  '-',
                ),

            name,

            badge:
              'New arrival',
          },
        ]);
      }


      setName('');

      setEditing(null);
    };


  return (

    <>

      <Intro
        eyebrow="Store control"
        title="Product management."
        copy="Manage your catalog, prices and offers from one simple workspace."
      />


      <section className="admin container">

        <div className="admin-form">

          <h2>

            {
              editing === null
                ? 'Add a product'
                : 'Edit product'
            }

          </h2>


          <input
            value={name}
            onChange={
              (event) =>
                setName(
                  event.target.value,
                )
            }
            placeholder="Product name"
          />


          <button
            type="button"
            className="button button-primary"
            onClick={save}
          >

            {
              editing === null
                ? 'Add product'
                : 'Save changes'
            }

          </button>


          <p>
            Pricing and offers are managed per variant in the product catalog.
          </p>

        </div>


        <div className="admin-table">

          {
            products.map(
              (
                product,
                index,
              ) => (

                <div
                  key={
                    `${product.id}-${index}`
                  }
                >

                  <img
                    src={
                      product.image
                    }
                    alt=""
                  />


                  <span>

                    <b>
                      {
                        product.name
                      }
                    </b>


                    <small>

                      {
                        product.eyebrow
                      }

                      {' · '}

                      {
                        product.warranty
                      }

                      {' warranty'}

                    </small>

                  </span>


                  <button
                    type="button"
                    onClick={
                      () => {

                        setEditing(
                          index,
                        );

                        setName(
                          product.name,
                        );
                      }
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="danger"
                    onClick={
                      () =>
                        setProducts(
                          products.filter(
                            (
                              _,
                              productIndex,
                            ) =>
                              productIndex !==
                              index,
                          ),
                        )
                    }
                  >
                    Delete
                  </button>

                </div>
              ),
            )
          }

        </div>

      </section>

    </>
  );
}


/*
==================================================
STOREFRONT
==================================================
*/

export default function Storefront({
  view,

  products = [],

  addToCart,

  cart = [],

  cartTotal = 0,

  cartLoading = false,

  updateQuantity,

  removeCartItem,

  clearCart,

  onNavigate,

  onPaymentSuccess,

  setProducts,
}) {

  if (
    view ===
    'products'
  ) {

    return (

      <Products
        products={
          products
        }
        addToCart={
          addToCart
        }
      />
    );
  }


  if (
    view ===
    'about'
  ) {

    return (
      <About />
    );
  }


  if (
    view ===
    'gallery'
  ) {

    return (

      <Gallery
        products={
          products
        }
      />
    );
  }


  if (
    view ===
    'warranty'
  ) {

    return (

      <Warranty
        onNavigate={
          onNavigate
        }
      />
    );
  }


  if (
    view ===
    'contact'
  ) {

    return (
      <Contact />
    );
  }


  if (
    view ===
    'cart'
  ) {

    return (

      <Cart
        cart={
          cart
        }

        cartTotal={
          cartTotal
        }

        cartLoading={
          cartLoading
        }

        updateQuantity={
          updateQuantity
        }

        removeCartItem={
          removeCartItem
        }

        clearCart={
          clearCart
        }

        onNavigate={
          onNavigate
        }
      />
    );
  }


  if (
    view ===
    'checkout'
  ) {

    return (

      <Checkout
        cart={
          cart
        }

        cartTotal={
          cartTotal
        }

        onPaymentSuccess={
          onPaymentSuccess
        }

        onNavigate={
          onNavigate
        }
      />
    );
  }


  return (

    <Admin
      products={
        products
      }
      setProducts={
        setProducts
      }
    />
  );
}