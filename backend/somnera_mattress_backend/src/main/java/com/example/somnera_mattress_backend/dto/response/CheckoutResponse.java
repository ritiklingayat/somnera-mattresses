package com.example.somnera_mattress_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponse {


    // ==============================
    // INTERNAL ORDER
    // ==============================

    private Long orderId;


    // ==============================
    // RAZORPAY
    // ==============================

    private String razorpayOrderId;

    private String razorpayKeyId;


    // ==============================
    // PAYMENT AMOUNT
    // ==============================

    private BigDecimal amount;


    /*
     * Razorpay expects amount in smallest
     * currency unit.
     *
     * Example:
     *
     * ₹525.00
     * becomes
     * 52500 paise
     */
    private Long amountInPaise;


    private String currency;
}