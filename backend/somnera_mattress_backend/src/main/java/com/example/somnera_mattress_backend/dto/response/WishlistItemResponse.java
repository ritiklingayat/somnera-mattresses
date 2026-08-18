package com.example.somnera_mattress_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItemResponse {


    // ==============================
    // WISHLIST ITEM
    // ==============================

    private Long wishlistId;


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
    // PRODUCT DETAILS
    // ==============================

    private String badge;

    private String warranty;

    private String firmness;

    private String shortDescription;

    private String materials;


    // ==============================
    // PRICES
    // ==============================

    private BigDecimal price4Inch;

    private BigDecimal price5Inch;

    private BigDecimal price6Inch;

    private BigDecimal price8Inch;


    // ==============================
    // WISHLIST CREATED DATE
    // ==============================

    private LocalDateTime addedAt;
}