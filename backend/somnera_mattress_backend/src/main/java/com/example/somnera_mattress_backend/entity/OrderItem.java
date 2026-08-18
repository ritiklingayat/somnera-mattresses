package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;


@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem extends BaseEntity {


    // ==============================
    // ORDER
    // ==============================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "order_id",
            nullable = false
    )
    private Order order;


    // ==============================
    // ORIGINAL PRODUCT REFERENCE
    // ==============================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "product_id"
    )
    private Product product;


    // ==============================
    // PRODUCT SNAPSHOT
    // ==============================

    @Column(
            name = "product_name",
            nullable = false,
            length = 180
    )
    private String productName;


    @Column(
            name = "image_url",
            columnDefinition = "TEXT"
    )
    private String imageUrl;


    @Column(
            name = "category_name",
            length = 120
    )
    private String categoryName;


    @Column(
            name = "sub_category_name",
            length = 120
    )
    private String subCategoryName;


    // ==============================
    // SELECTED THICKNESS
    // ==============================

    @Column(
            name = "thickness",
            nullable = false
    )
    private Integer thickness;


    // ==============================
    // PRICE SNAPSHOT
    // ==============================

    @Column(
            name = "unit_price",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal unitPrice;


    // ==============================
    // QUANTITY
    // ==============================

    @Column(
            name = "quantity",
            nullable = false
    )
    private Integer quantity;


    // ==============================
    // ITEM TOTAL
    // ==============================

    @Column(
            name = "item_total",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal itemTotal;
}