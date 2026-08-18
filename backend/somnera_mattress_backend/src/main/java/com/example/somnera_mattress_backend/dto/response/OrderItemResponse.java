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
public class OrderItemResponse {


    private Long id;


    // ==============================
    // PRODUCT SNAPSHOT
    // ==============================

    private Long productId;

    private String productName;

    private String imageUrl;

    private String categoryName;

    private String subCategoryName;


    // ==============================
    // PURCHASE DETAILS
    // ==============================

    private Integer thickness;

    private BigDecimal unitPrice;

    private Integer quantity;

    private BigDecimal itemTotal;
}