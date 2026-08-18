package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.request.PaymentVerifyRequest;
import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.PaymentVerifyResponse;
import com.example.somnera_mattress_backend.service.PaymentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {


    private final PaymentService paymentService;


    // ==============================
    // VERIFY RAZORPAY PAYMENT
    // ==============================

    @PostMapping("/verify")
    public ResponseEntity<
            ApiResponse<PaymentVerifyResponse>
            >
    verifyPayment(

            @Valid
            @RequestBody
            PaymentVerifyRequest request,

            Authentication authentication
    ) {


        PaymentVerifyResponse response =
                paymentService
                        .verifyPayment(
                                request,
                                authentication.getName()
                        );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Payment verified successfully",
                        response
                )
        );
    }
}