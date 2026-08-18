package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.request.PaymentVerifyRequest;
import com.example.somnera_mattress_backend.dto.response.PaymentVerifyResponse;
import com.example.somnera_mattress_backend.entity.Cart;
import com.example.somnera_mattress_backend.entity.Order;
import com.example.somnera_mattress_backend.entity.OrderStatus;
import com.example.somnera_mattress_backend.entity.PaymentStatus;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.CartRepository;
import com.example.somnera_mattress_backend.repository.OrderRepository;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.service.PaymentService;

import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class PaymentServiceImpl
        implements PaymentService {


    private final OrderRepository orderRepository;

    private final UserRepository userRepository;

    private final CartRepository cartRepository;


    // ==============================
    // RAZORPAY SECRET
    // ==============================

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;



    // ==============================
    // VERIFY PAYMENT
    // ==============================

    @Override
    @Transactional
    public PaymentVerifyResponse verifyPayment(
            PaymentVerifyRequest request,
            String userEmail
    ) {


        // ==============================
        // GET LOGGED-IN USER
        // ==============================

        User user =
                getUserByEmail(
                        userEmail
                );


        // ==============================
        // FIND INTERNAL ORDER
        // ==============================

        Order order =
                orderRepository
                        .findByRazorpayOrderId(
                                request.getRazorpayOrderId()
                        )
                        .orElseThrow(

                                () ->
                                        new ResourceNotFoundException(
                                                "Order not found"
                                        )
                        );


        // ==============================
        // VERIFY ORDER OWNERSHIP
        // ==============================

        if (
                order.getUser() == null
                        || !order
                        .getUser()
                        .getId()
                        .equals(
                                user.getId()
                        )
        ) {

            throw new BadRequestException(
                    "You are not authorized to verify this order"
            );
        }



        // ==============================
        // ALREADY PAID CHECK
        // ==============================

        if (
                order.getPaymentStatus()
                        == PaymentStatus.SUCCESS
        ) {

            /*
             * Important for idempotency.
             *
             * If frontend accidentally calls
             * verify twice, don't process the
             * payment twice.
             */

            return PaymentVerifyResponse
                    .builder()

                    .orderId(
                            order.getId()
                    )

                    .razorpayOrderId(
                            order.getRazorpayOrderId()
                    )

                    .razorpayPaymentId(
                            order.getRazorpayPaymentId()
                    )

                    .paymentStatus(
                            order.getPaymentStatus()
                    )

                    .orderStatus(
                            order.getOrderStatus()
                    )

                    .build();
        }



        // ==============================
        // VERIFY RAZORPAY SIGNATURE
        // ==============================

        boolean signatureValid =
                verifySignature(
                        order,
                        request
                );


        if (!signatureValid) {

            order.setPaymentStatus(
                    PaymentStatus.FAILED
            );


            throw new BadRequestException(
                    "Payment verification failed"
            );
        }



        // ==============================
        // PAYMENT SUCCESS
        // ==============================

        order.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );


        order.setRazorpaySignature(
                request.getRazorpaySignature()
        );


        order.setPaymentStatus(
                PaymentStatus.SUCCESS
        );


        order.setOrderStatus(
                OrderStatus.CONFIRMED
        );



        // ==============================
        // CLEAR USER CART
        // ==============================

        clearUserCart(
                user
        );


        /*
         * No explicit save() is necessary here.
         *
         * Order was loaded inside this
         * @Transactional method, therefore it is
         * managed by Hibernate and dirty checking
         * will persist the changes.
         */



        // ==============================
        // RETURN RESPONSE
        // ==============================

        return PaymentVerifyResponse
                .builder()

                .orderId(
                        order.getId()
                )

                .razorpayOrderId(
                        order.getRazorpayOrderId()
                )

                .razorpayPaymentId(
                        order.getRazorpayPaymentId()
                )

                .paymentStatus(
                        order.getPaymentStatus()
                )

                .orderStatus(
                        order.getOrderStatus()
                )

                .build();
    }



    // ==============================
    // VERIFY SIGNATURE
    // ==============================

    private boolean verifySignature(
            Order order,
            PaymentVerifyRequest request
    ) {


        try {


            JSONObject attributes =
                    new JSONObject();


            /*
             * IMPORTANT:
             *
             * Use the Razorpay Order ID stored
             * in OUR database.
             *
             * Don't trust the browser value as
             * the authoritative order ID.
             */
            attributes.put(
                    "razorpay_order_id",
                    order.getRazorpayOrderId()
            );


            attributes.put(
                    "razorpay_payment_id",
                    request.getRazorpayPaymentId()
            );


            attributes.put(
                    "razorpay_signature",
                    request.getRazorpaySignature()
            );


            return Utils
                    .verifyPaymentSignature(
                            attributes,
                            razorpayKeySecret
                    );


        } catch (Exception exception) {


            return false;
        }
    }



    // ==============================
    // CLEAR USER CART
    // ==============================

    private void clearUserCart(
            User user
    ) {


        Cart cart =
                cartRepository
                        .findByUserId(
                                user.getId()
                        )
                        .orElse(null);


        if (cart == null) {

            return;
        }


        /*
         * Cart.java uses:
         *
         * orphanRemoval = true
         *
         * so clearing the collection deletes
         * rows from cart_items.
         *
         * The Cart itself remains.
         */
        cart.getItems().clear();
    }



    // ==============================
    // GET USER
    // ==============================

    private User getUserByEmail(
            String email
    ) {


        if (
                email == null
                        || email.isBlank()
        ) {

            throw new BadRequestException(
                    "Authenticated user is required"
            );
        }


        return userRepository
                .findByEmailIgnoreCase(
                        email
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                );
    }
}