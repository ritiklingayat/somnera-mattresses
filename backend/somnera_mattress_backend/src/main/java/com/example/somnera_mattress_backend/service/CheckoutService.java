package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.request.CheckoutRequest;
import com.example.somnera_mattress_backend.dto.response.CheckoutResponse;


public interface CheckoutService {


    // ==============================
    // INITIALIZE CHECKOUT
    // ==============================

    CheckoutResponse initializeCheckout(
            CheckoutRequest request,
            String userEmail
    );
}