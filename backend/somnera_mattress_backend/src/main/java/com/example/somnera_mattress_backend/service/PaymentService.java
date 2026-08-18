package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.request.PaymentVerifyRequest;
import com.example.somnera_mattress_backend.dto.response.PaymentVerifyResponse;


public interface PaymentService {


    // ==============================
    // VERIFY RAZORPAY PAYMENT
    // ==============================

    PaymentVerifyResponse verifyPayment(
            PaymentVerifyRequest request,
            String userEmail
    );
}