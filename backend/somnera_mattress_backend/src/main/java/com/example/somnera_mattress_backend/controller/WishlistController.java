package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.WishlistResponse;
import com.example.somnera_mattress_backend.service.WishlistService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {


    private final WishlistService wishlistService;


    // ==============================
    // GET MY WISHLIST
    // ==============================

    @GetMapping
    public ResponseEntity<ApiResponse<WishlistResponse>>
    getMyWishlist(
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        WishlistResponse response =
                wishlistService.getMyWishlist(
                        email
                );


        return ResponseEntity.ok(

                ApiResponse.<WishlistResponse>builder()

                        .success(true)

                        .message(
                                "Wishlist fetched successfully"
                        )

                        .data(
                                response
                        )

                        .timestamp(
                                LocalDateTime.now()
                        )

                        .build()
        );
    }


    // ==============================
    // ADD PRODUCT TO WISHLIST
    // ==============================

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<WishlistResponse>>
    addToWishlist(
            @PathVariable Long productId,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        WishlistResponse response =
                wishlistService.addToWishlist(
                        email,
                        productId
                );


        return ResponseEntity.ok(

                ApiResponse.<WishlistResponse>builder()

                        .success(true)

                        .message(
                                "Product added to wishlist successfully"
                        )

                        .data(
                                response
                        )

                        .timestamp(
                                LocalDateTime.now()
                        )

                        .build()
        );
    }


    // ==============================
    // REMOVE PRODUCT FROM WISHLIST
    // ==============================

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<WishlistResponse>>
    removeFromWishlist(
            @PathVariable Long productId,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        WishlistResponse response =
                wishlistService.removeFromWishlist(
                        email,
                        productId
                );


        return ResponseEntity.ok(

                ApiResponse.<WishlistResponse>builder()

                        .success(true)

                        .message(
                                "Product removed from wishlist successfully"
                        )

                        .data(
                                response
                        )

                        .timestamp(
                                LocalDateTime.now()
                        )

                        .build()
        );
    }


    // ==============================
    // CHECK PRODUCT IN WISHLIST
    // ==============================

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>>
    checkWishlist(
            @PathVariable Long productId,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        boolean inWishlist =
                wishlistService.isProductInWishlist(
                        email,
                        productId
                );


        return ResponseEntity.ok(

                ApiResponse.<Boolean>builder()

                        .success(true)

                        .message(
                                "Wishlist status fetched successfully"
                        )

                        .data(
                                inWishlist
                        )

                        .timestamp(
                                LocalDateTime.now()
                        )

                        .build()
        );
    }
}