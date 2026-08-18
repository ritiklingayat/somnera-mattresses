package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.request.CheckoutRequest;
import com.example.somnera_mattress_backend.dto.response.CheckoutResponse;
import com.example.somnera_mattress_backend.entity.Cart;
import com.example.somnera_mattress_backend.entity.CartItem;
import com.example.somnera_mattress_backend.entity.Order;
import com.example.somnera_mattress_backend.entity.OrderItem;
import com.example.somnera_mattress_backend.entity.OrderStatus;
import com.example.somnera_mattress_backend.entity.PaymentStatus;
import com.example.somnera_mattress_backend.entity.Product;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.CartRepository;
import com.example.somnera_mattress_backend.repository.OrderRepository;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.service.CheckoutService;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl
        implements CheckoutService {


    private final UserRepository userRepository;

    private final CartRepository cartRepository;

    private final OrderRepository orderRepository;

    private final RazorpayClient razorpayClient;


    // ==============================
    // RAZORPAY CONFIG
    // ==============================

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;


    @Value("${razorpay.currency}")
    private String currency;



    // ==============================
    // INITIALIZE CHECKOUT
    // ==============================

    @Override
    @Transactional
    public CheckoutResponse initializeCheckout(
            CheckoutRequest request,
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
        // GET USER CART
        // ==============================

        Cart cart =
                cartRepository
                        .findByUserId(
                                user.getId()
                        )
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                "Your cart is empty"
                                        )
                        );


        // ==============================
        // VALIDATE CART
        // ==============================

        if (
                cart.getItems() == null
                        || cart.getItems().isEmpty()
        ) {

            throw new BadRequestException(
                    "Your cart is empty"
            );
        }



        // ==============================
        // CALCULATE TOTAL FROM DATABASE
        // ==============================

        BigDecimal totalAmount =
                calculateCartTotal(
                        cart
                );


        if (
                totalAmount.compareTo(
                        BigDecimal.ZERO
                ) <= 0
        ) {

            throw new BadRequestException(
                    "Invalid cart total"
            );
        }



        // ==============================
        // CREATE INTERNAL ORDER
        // ==============================

        Order order =
                Order.builder()

                        .user(
                                user
                        )

                        .fullName(
                                clean(
                                        request.getFullName()
                                )
                        )

                        .mobile(
                                clean(
                                        request.getMobile()
                                )
                        )

                        .email(
                                clean(
                                        request.getEmail()
                                )
                        )

                        .city(
                                clean(
                                        request.getCity()
                                )
                        )

                        .state(
                                clean(
                                        request.getState()
                                )
                        )

                        .pincode(
                                clean(
                                        request.getPincode()
                                )
                        )

                        .fullAddress(
                                clean(
                                        request.getFullAddress()
                                )
                        )

                        .paymentMethod(
                                request.getPaymentMethod()
                        )

                        .paymentStatus(
                                PaymentStatus.PENDING
                        )

                        .orderStatus(
                                OrderStatus.PENDING_PAYMENT
                        )

                        .totalAmount(
                                totalAmount
                        )

                        .items(
                                new ArrayList<>()
                        )

                        .build();



        // ==============================
        // CREATE ORDER ITEM SNAPSHOTS
        // ==============================

        List<OrderItem> orderItems =
                createOrderItems(
                        cart,
                        order
                );


        order.getItems().addAll(
                orderItems
        );



        // ==============================
        // SAVE INTERNAL ORDER
        // ==============================

        Order savedOrder =
                orderRepository.save(
                        order
                );



        // ==============================
        // CONVERT RUPEES TO PAISE
        // ==============================

        long amountInPaise =
                convertToPaise(
                        totalAmount
                );



        // ==============================
        // CREATE RAZORPAY ORDER
        // ==============================

        String razorpayOrderId =
                createRazorpayOrder(
                        savedOrder,
                        amountInPaise
                );



        // ==============================
        // SAVE RAZORPAY ORDER ID
        // ==============================

        savedOrder.setRazorpayOrderId(
                razorpayOrderId
        );


        /*
         * savedOrder is managed by Hibernate inside
         * this @Transactional method.
         *
         * No second save() is required.
         * Hibernate dirty checking will persist the
         * razorpayOrderId automatically.
         */



        // ==============================
        // RETURN CHECKOUT RESPONSE
        // ==============================

        return CheckoutResponse
                .builder()

                .orderId(
                        savedOrder.getId()
                )

                .razorpayOrderId(
                        razorpayOrderId
                )

                .razorpayKeyId(
                        razorpayKeyId
                )

                .amount(
                        totalAmount
                )

                .amountInPaise(
                        amountInPaise
                )

                .currency(
                        currency
                )

                .build();
    }



    // ==============================
    // CREATE ORDER ITEMS
    // ==============================

    private List<OrderItem> createOrderItems(
            Cart cart,
            Order order
    ) {


        List<OrderItem> orderItems =
                new ArrayList<>();


        for (
                CartItem cartItem :
                cart.getItems()
        ) {


            Product product =
                    cartItem.getProduct();


            BigDecimal unitPrice =
                    getPriceByThickness(
                            product,
                            cartItem.getThickness()
                    );


            BigDecimal itemTotal =
                    unitPrice.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            OrderItem orderItem =
                    OrderItem.builder()

                            .order(
                                    order
                            )

                            // Keep original product reference
                            .product(
                                    product
                            )

                            // Product snapshot
                            .productName(
                                    product.getProductName()
                            )

                            .imageUrl(
                                    product.getImageUrl()
                            )

                            .categoryName(
                                    product
                                            .getCategory()
                                            .getCategoryName()
                            )

                            .subCategoryName(
                                    product
                                            .getSubCategory()
                                            .getSubCategoryName()
                            )

                            // Purchase snapshot
                            .thickness(
                                    cartItem.getThickness()
                            )

                            .unitPrice(
                                    unitPrice
                            )

                            .quantity(
                                    cartItem.getQuantity()
                            )

                            .itemTotal(
                                    itemTotal
                            )

                            .build();


            orderItems.add(
                    orderItem
            );
        }


        return orderItems;
    }



    // ==============================
    // CALCULATE CART TOTAL
    // ==============================

    private BigDecimal calculateCartTotal(
            Cart cart
    ) {


        BigDecimal total =
                BigDecimal.ZERO;


        for (
                CartItem cartItem :
                cart.getItems()
        ) {


            Product product =
                    cartItem.getProduct();


            BigDecimal unitPrice =
                    getPriceByThickness(
                            product,
                            cartItem.getThickness()
                    );


            BigDecimal itemTotal =
                    unitPrice.multiply(
                            BigDecimal.valueOf(
                                    cartItem.getQuantity()
                            )
                    );


            total =
                    total.add(
                            itemTotal
                    );
        }


        return total;
    }



    // ==============================
    // GET PRICE BY THICKNESS
    // ==============================

    private BigDecimal getPriceByThickness(
            Product product,
            Integer thickness
    ) {


        if (thickness == null) {

            throw new BadRequestException(
                    "Mattress thickness is required"
            );
        }


        BigDecimal price;


        switch (thickness) {


            case 4 ->

                    price =
                            product.getPrice4Inch();


            case 5 ->

                    price =
                            product.getPrice5Inch();


            case 6 ->

                    price =
                            product.getPrice6Inch();


            case 8 ->

                    price =
                            product.getPrice8Inch();


            default ->

                    throw new BadRequestException(
                            "Invalid mattress thickness"
                    );
        }


        if (price == null) {

            throw new BadRequestException(
                    thickness
                            + " inch thickness is not available for product "
                            + product.getProductName()
            );
        }


        if (
                price.compareTo(
                        BigDecimal.ZERO
                ) <= 0
        ) {

            throw new BadRequestException(
                    "Invalid product price"
            );
        }


        return price;
    }



    // ==============================
    // CREATE RAZORPAY ORDER
    // ==============================

    private String createRazorpayOrder(
            Order order,
            long amountInPaise
    ) {


        try {


            JSONObject orderRequest =
                    new JSONObject();


            // Razorpay expects amount in paise
            orderRequest.put(
                    "amount",
                    amountInPaise
            );


            orderRequest.put(
                    "currency",
                    currency
            );


            /*
             * Razorpay receipt must be unique.
             * Internal order ID makes it easy
             * to trace later.
             */
            orderRequest.put(
                    "receipt",
                    "somnera_order_"
                            + order.getId()
            );



            // ==============================
            // OPTIONAL NOTES
            // ==============================

            JSONObject notes =
                    new JSONObject();


            notes.put(
                    "internal_order_id",
                    order.getId()
            );


            notes.put(
                    "customer_email",
                    order.getEmail()
            );


            orderRequest.put(
                    "notes",
                    notes
            );



            // ==============================
            // CALL RAZORPAY
            // ==============================

            com.razorpay.Order razorpayOrder =
                    razorpayClient
                            .orders
                            .create(
                                    orderRequest
                            );



            String razorpayOrderId =
                    razorpayOrder.get(
                            "id"
                    );


            if (
                    razorpayOrderId == null
                            || razorpayOrderId.isBlank()
            ) {

                throw new BadRequestException(
                        "Razorpay order creation failed"
                );
            }


            return razorpayOrderId;


        } catch (RazorpayException exception) {

            System.out.println(
                    "RAZORPAY ERROR: " + exception.getMessage()
            );

            exception.printStackTrace();

            throw new BadRequestException(
                    "Razorpay error: " + exception.getMessage()
            );
        }
    }



    // ==============================
    // CONVERT ₹ TO PAISE
    // ==============================

    private long convertToPaise(
            BigDecimal amount
    ) {


        try {


            return amount
                    .multiply(
                            new BigDecimal(
                                    "100"
                            )
                    )
                    .longValueExact();


        } catch (
                ArithmeticException exception
        ) {


            throw new BadRequestException(
                    "Invalid payment amount"
            );
        }
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



    // ==============================
    // CLEAN STRING
    // ==============================

    private String clean(
            String value
    ) {


        if (value == null) {

            return null;
        }


        String trimmed =
                value.trim();


        return trimmed.isEmpty()
                ? null
                : trimmed;
    }
}