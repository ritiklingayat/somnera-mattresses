package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.request.AddToCartRequest;
import com.example.somnera_mattress_backend.dto.request.UpdateCartItemRequest;
import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.CartResponse;
import com.example.somnera_mattress_backend.service.CartService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {


    private final CartService cartService;


    // ==============================
    // ADD ITEM TO CART
    // ==============================

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(

            @Valid
            @RequestBody
            AddToCartRequest request,

            Authentication authentication
    ) {

        CartResponse cartResponse =
                cartService.addToCart(
                        request,
                        authentication.getName()
                );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Product added to cart successfully",
                        cartResponse
                )
        );
    }


    // ==============================
    // GET LOGGED-IN USER CART
    // ==============================

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            Authentication authentication
    ) {

        CartResponse cartResponse =
                cartService.getCart(
                        authentication.getName()
                );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Cart fetched successfully",
                        cartResponse
                )
        );
    }


    // ==============================
    // UPDATE CART ITEM QUANTITY
    // ==============================

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(

            @PathVariable
            Long itemId,

            @Valid
            @RequestBody
            UpdateCartItemRequest request,

            Authentication authentication
    ) {

        CartResponse cartResponse =
                cartService.updateCartItem(
                        itemId,
                        request,
                        authentication.getName()
                );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Cart item updated successfully",
                        cartResponse
                )
        );
    }


    // ==============================
    // REMOVE ONE CART ITEM
    // ==============================

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeCartItem(

            @PathVariable
            Long itemId,

            Authentication authentication
    ) {

        CartResponse cartResponse =
                cartService.removeCartItem(
                        itemId,
                        authentication.getName()
                );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Cart item removed successfully",
                        cartResponse
                )
        );
    }


    // ==============================
    // CLEAR COMPLETE CART
    // ==============================

    @DeleteMapping
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(
            Authentication authentication
    ) {

        CartResponse cartResponse =
                cartService.clearCart(
                        authentication.getName()
                );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Cart cleared successfully",
                        cartResponse
                )
        );
    }
}