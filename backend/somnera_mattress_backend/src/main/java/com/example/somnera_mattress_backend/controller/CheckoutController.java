package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.request.CheckoutRequest;
import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.CheckoutResponse;
import com.example.somnera_mattress_backend.service.CheckoutService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {


    private final CheckoutService checkoutService;


    // ==============================
    // INITIALIZE CHECKOUT
    // ==============================

    @PostMapping
    public ResponseEntity<
            ApiResponse<CheckoutResponse>
            >
    initializeCheckout(

            @Valid
            @RequestBody
            CheckoutRequest request,

            Authentication authentication
    ) {


        CheckoutResponse response =
                checkoutService
                        .initializeCheckout(
                                request,
                                authentication.getName()
                        );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Checkout initialized successfully",
                        response
                )
        );
    }
}