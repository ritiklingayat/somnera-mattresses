package com.example.somnera_mattress_backend.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerifyRequest {


    // ==============================
    // RAZORPAY ORDER ID
    // ==============================

    @NotBlank(
            message = "Razorpay order ID is required"
    )
    private String razorpayOrderId;


    // ==============================
    // RAZORPAY PAYMENT ID
    // ==============================

    @NotBlank(
            message = "Razorpay payment ID is required"
    )
    private String razorpayPaymentId;


    // ==============================
    // RAZORPAY SIGNATURE
    // ==============================

    @NotBlank(
            message = "Razorpay signature is required"
    )
    private String razorpaySignature;
}