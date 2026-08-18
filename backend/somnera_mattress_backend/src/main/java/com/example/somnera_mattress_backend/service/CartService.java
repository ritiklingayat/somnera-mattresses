package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.request.AddToCartRequest;
import com.example.somnera_mattress_backend.dto.request.UpdateCartItemRequest;
import com.example.somnera_mattress_backend.dto.response.CartResponse;


public interface CartService {


    // ==============================
    // ADD ITEM TO CART
    // ==============================

    CartResponse addToCart(
            AddToCartRequest request,
            String userEmail
    );


    // ==============================
    // GET LOGGED-IN USER CART
    // ==============================

    CartResponse getCart(
            String userEmail
    );


    // ==============================
    // UPDATE CART ITEM QUANTITY
    // ==============================

    CartResponse updateCartItem(
            Long itemId,
            UpdateCartItemRequest request,
            String userEmail
    );


    // ==============================
    // REMOVE ONE ITEM FROM CART
    // ==============================

    CartResponse removeCartItem(
            Long itemId,
            String userEmail
    );


    // ==============================
    // CLEAR COMPLETE CART
    // ==============================

    CartResponse clearCart(
            String userEmail
    );
}