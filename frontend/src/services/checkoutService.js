import {
  apiRequest,
} from './api';


/*
==================================================
INITIALIZE CHECKOUT
==================================================

Backend:
POST /api/checkout

Backend calculates the trusted cart amount.

Frontend must NOT send:
- cart total
- item price
- Razorpay amount
==================================================
*/

export async function initializeCheckoutApi(
  checkoutData,
) {

  const response =
    await apiRequest(
      '/api/checkout',
      'POST',
      {
        fullName:
          checkoutData.fullName
            .trim(),

        mobile:
          checkoutData.mobile
            .trim(),

        email:
          checkoutData.email
            .trim(),

        city:
          checkoutData.city
            .trim(),

        state:
          checkoutData.state
            .trim(),

        pincode:
          checkoutData.pincode
            .trim(),

        fullAddress:
          checkoutData.fullAddress
            .trim(),

        paymentMethod:
          checkoutData.paymentMethod,
      },
    );


  /*
   * apiRequest returns the backend ApiResponse:
   *
   * {
   *   success,
   *   message,
   *   data: {
   *      orderId,
   *      razorpayOrderId,
   *      razorpayKeyId,
   *      amount,
   *      amountInPaise,
   *      currency
   *   }
   * }
   */

  return response?.data;
}