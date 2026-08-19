import {
  apiRequest,
} from './api';


/*
==================================================
VERIFY RAZORPAY PAYMENT
==================================================

Backend:
POST /api/payments/verify

Request:

{
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}
==================================================
*/

export async function verifyPaymentApi({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {

  const response =
    await apiRequest(
      '/api/payments/verify',
      'POST',
      {
        orderId:
          Number(orderId),

        razorpayOrderId,

        razorpayPaymentId,

        razorpaySignature,
      },
    );


  return response?.data;
}