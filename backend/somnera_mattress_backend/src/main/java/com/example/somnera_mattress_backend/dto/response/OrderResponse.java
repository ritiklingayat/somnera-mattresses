package com.example.somnera_mattress_backend.dto.response;

import com.example.somnera_mattress_backend.entity.OrderStatus;
import com.example.somnera_mattress_backend.entity.PaymentMethod;
import com.example.somnera_mattress_backend.entity.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {


    // ==============================
    // ORDER
    // ==============================

    private Long id;


    // ==============================
    // DELIVERY INFORMATION
    // ==============================

    private String fullName;

    private String mobile;

    private String email;

    private String city;

    private String state;

    private String pincode;

    private String fullAddress;


    // ==============================
    // PAYMENT
    // ==============================

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private String razorpayOrderId;

    private String razorpayPaymentId;


    // ==============================
    // ORDER STATUS
    // ==============================

    private OrderStatus orderStatus;


    // ==============================
    // TOTAL
    // ==============================

    private BigDecimal totalAmount;


    // ==============================
    // ITEMS
    // ==============================

    @Builder.Default
    private List<OrderItemResponse> items =
            new ArrayList<>();


    // ==============================
    // CREATED DATE
    // ==============================

    private LocalDateTime createdAt;
}