package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.response.WishlistResponse;


public interface WishlistService {


    // ==============================
    // GET LOGGED-IN USER WISHLIST
    // ==============================

    WishlistResponse getMyWishlist(
            String email
    );


    // ==============================
    // ADD PRODUCT TO WISHLIST
    // ==============================

    WishlistResponse addToWishlist(
            String email,
            Long productId
    );


    // ==============================
    // REMOVE PRODUCT FROM WISHLIST
    // ==============================

    WishlistResponse removeFromWishlist(
            String email,
            Long productId
    );


    // ==============================
    // CHECK PRODUCT IN WISHLIST
    // ==============================

    boolean isProductInWishlist(
            String email,
            Long productId
    );
}