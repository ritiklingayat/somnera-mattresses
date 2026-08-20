package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.response.OrderItemResponse;
import com.example.somnera_mattress_backend.dto.response.OrderResponse;
import com.example.somnera_mattress_backend.entity.Order;
import com.example.somnera_mattress_backend.entity.OrderItem;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.OrderRepository;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.service.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrderServiceImpl
        implements OrderService {


    private final OrderRepository orderRepository;

    private final UserRepository userRepository;



    // ==============================
    // GET LOGGED-IN USER ORDERS
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(
            String userEmail
    ) {


        User user =
                getUserByEmail(
                        userEmail
                );


        List<Order> orders =
                orderRepository
                        .findByUserOrderByCreatedAtDesc(
                                user
                        );


        List<OrderResponse> responses =
                new ArrayList<>();


        for (
                Order order :
                orders
        ) {

            responses.add(
                    mapToOrderResponse(
                            order
                    )
            );
        }


        return responses;
    }



    // ==============================
    // GET ONE USER ORDER
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getMyOrderById(
            Long orderId,
            String userEmail
    ) {


        User user =
                getUserByEmail(
                        userEmail
                );


        Order order =
                orderRepository
                        .findByIdAndUser(
                                orderId,
                                user
                        )
                        .orElseThrow(

                                () ->
                                        new ResourceNotFoundException(
                                                "Order not found"
                                        )
                        );


        return mapToOrderResponse(
                order
        );
    }


    /*
==============================================
ADMIN - GET ALL CUSTOMER ORDERS
==============================================
*/

@Override
@Transactional(readOnly = true)
public List<OrderResponse> getAllOrders() {


    List<Order> orders =
            orderRepository
                    .findAllByOrderByCreatedAtDesc();


    List<OrderResponse> responses =
            new ArrayList<>();


    for (
            Order order :
            orders
    ) {

        responses.add(
                mapToOrderResponse(
                        order
                )
        );
    }


    return responses;
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
    // MAP ORDER RESPONSE
    // ==============================

    private OrderResponse mapToOrderResponse(
            Order order
    ) {


        List<OrderItemResponse> itemResponses =
                new ArrayList<>();


        for (
                OrderItem item :
                order.getItems()
        ) {

            itemResponses.add(
                    mapToOrderItemResponse(
                            item
                    )
            );
        }


        return OrderResponse
                .builder()

                .id(
                        order.getId()
                )

                .fullName(
                        order.getFullName()
                )

                .mobile(
                        order.getMobile()
                )

                .email(
                        order.getEmail()
                )

                .city(
                        order.getCity()
                )

                .state(
                        order.getState()
                )

                .pincode(
                        order.getPincode()
                )

                .fullAddress(
                        order.getFullAddress()
                )

                .paymentMethod(
                        order.getPaymentMethod()
                )

                .paymentStatus(
                        order.getPaymentStatus()
                )

                .razorpayOrderId(
                        order.getRazorpayOrderId()
                )

                .razorpayPaymentId(
                        order.getRazorpayPaymentId()
                )

                .orderStatus(
                        order.getOrderStatus()
                )

                .totalAmount(
                        order.getTotalAmount()
                )

                .items(
                        itemResponses
                )

                .createdAt(
                        order.getCreatedAt()
                )

                .build();
    }



    // ==============================
    // MAP ORDER ITEM RESPONSE
    // ==============================

    private OrderItemResponse mapToOrderItemResponse(
            OrderItem item
    ) {


        Long productId = null;


        /*
         * Product reference is nullable because
         * historical orders should still work even
         * if a product is removed later.
         */
        if (
                item.getProduct() != null
        ) {

            productId =
                    item
                            .getProduct()
                            .getId();
        }


        return OrderItemResponse
                .builder()

                .id(
                        item.getId()
                )

                .productId(
                        productId
                )

                .productName(
                        item.getProductName()
                )

                .imageUrl(
                        item.getImageUrl()
                )

                .categoryName(
                        item.getCategoryName()
                )

                .subCategoryName(
                        item.getSubCategoryName()
                )

                .thickness(
                        item.getThickness()
                )

                .unitPrice(
                        item.getUnitPrice()
                )

                .quantity(
                        item.getQuantity()
                )

                .itemTotal(
                        item.getItemTotal()
                )

                .build();
    }
}