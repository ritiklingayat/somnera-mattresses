package com.example.somnera_mattress_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {


    // ==============================
    // CART ITEM
    // ==============================

    private Long id;


    // ==============================
    // PRODUCT
    // ==============================

    private Long productId;

    private String productName;

    private String imageUrl;


    // ==============================
    // CATEGORY
    // ==============================

    private Long categoryId;

    private String categoryName;

    private Long subCategoryId;

    private String subCategoryName;


    // ==============================
    // SELECTED THICKNESS
    // ==============================

    private Integer thickness;


    // ==============================
    // PRICE
    // ==============================

    private BigDecimal unitPrice;


    // ==============================
    // QUANTITY
    // ==============================

    private Integer quantity;


    // ==============================
    // ITEM TOTAL
    // ==============================

    private BigDecimal itemTotal;
}