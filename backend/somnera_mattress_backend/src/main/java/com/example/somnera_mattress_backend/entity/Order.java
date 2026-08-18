package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {


    // ==============================
    // USER
    // ==============================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;


    // ==============================
    // DELIVERY INFORMATION
    // ==============================

    @Column(
            name = "full_name",
            nullable = false,
            length = 120
    )
    private String fullName;


    @Column(
            name = "mobile",
            nullable = false,
            length = 15
    )
    private String mobile;


    @Column(
            name = "email",
            nullable = false,
            length = 150
    )
    private String email;


    @Column(
            name = "city",
            nullable = false,
            length = 100
    )
    private String city;


    @Column(
            name = "state",
            nullable = false,
            length = 100
    )
    private String state;


    @Column(
            name = "pincode",
            nullable = false,
            length = 10
    )
    private String pincode;


    @Column(
            name = "full_address",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String fullAddress;


    // ==============================
    // PAYMENT METHOD
    // ==============================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "payment_method",
            nullable = false,
            length = 30
    )
    private PaymentMethod paymentMethod;


    // ==============================
    // PAYMENT STATUS
    // ==============================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "payment_status",
            nullable = false,
            length = 30
    )
    private PaymentStatus paymentStatus;


    // ==============================
    // ORDER STATUS
    // ==============================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "order_status",
            nullable = false,
            length = 30
    )
    private OrderStatus orderStatus;


    // ==============================
    // TOTAL AMOUNT
    // ==============================

    @Column(
            name = "total_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal totalAmount;


    // ==============================
    // RAZORPAY DETAILS
    // ==============================

    @Column(
            name = "razorpay_order_id",
            unique = true,
            length = 120
    )
    private String razorpayOrderId;


    @Column(
            name = "razorpay_payment_id",
            length = 120
    )
    private String razorpayPaymentId;


    @Column(
            name = "razorpay_signature",
            columnDefinition = "TEXT"
    )
    private String razorpaySignature;


    // ==============================
    // ORDER ITEMS
    // ==============================

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<OrderItem> items =
            new ArrayList<>();
}