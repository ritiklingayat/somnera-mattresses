package com.example.somnera_mattress_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {


    // ==============================
    // CART
    // ==============================

    private Long cartId;


    // ==============================
    // CART ITEMS
    // ==============================

    @Builder.Default
    private List<CartItemResponse> items =
            new ArrayList<>();


    // ==============================
    // TOTAL QUANTITY
    // ==============================

    private Integer totalItems;


    // ==============================
    // CART TOTAL
    // ==============================

    private BigDecimal cartTotal;
}