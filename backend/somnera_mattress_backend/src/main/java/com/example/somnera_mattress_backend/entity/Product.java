package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    // ==============================
    // BASIC DETAILS
    // ==============================

    @Column(
            name = "product_name",
            nullable = false,
            unique = true,
            length = 180
    )
    private String productName;


    @Enumerated(EnumType.STRING)
    @Column(
            name = "product_section",
            nullable = false,
            length = 50
    )
    private ProductSection productSection;


    @Column(
            name = "badge",
            length = 80
    )
    private String badge;


    // ==============================
    // CATEGORY
    // ==============================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "category_id",
            nullable = false
    )
    private Category category;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sub_category_id",
            nullable = false
    )
    private SubCategory subCategory;


    // ==============================
    // PRODUCT INFORMATION
    // ==============================

    @Column(
            name = "warranty",
            length = 100
    )
    private String warranty;


    @Column(
            name = "short_description",
            columnDefinition = "TEXT"
    )
    private String shortDescription;


    @Column(
            name = "image_url",
            columnDefinition = "TEXT"
    )
    private String imageUrl;


    @Column(
            name = "image_public_id",
            length = 255
    )
    private String imagePublicId;


    @Column(
            name = "firmness",
            length = 100
    )
    private String firmness;


    // ==============================
    // MATERIALS
    // ==============================

    @Column(
            name = "materials",
            columnDefinition = "TEXT"
    )
    private String materials;


    // ==============================
    // SHOP BY NEED
    // ==============================

    @ElementCollection
    @CollectionTable(
            name = "product_shop_by_need",
            joinColumns =
            @JoinColumn(name = "product_id")
    )
    @Column(
            name = "need_value",
            length = 120
    )
    @Builder.Default
    private List<String> shopByNeed =
            new ArrayList<>();


    // ==============================
    // SHOP BY USER
    // ==============================

    @ElementCollection
    @CollectionTable(
            name = "product_shop_by_user",
            joinColumns =
            @JoinColumn(name = "product_id")
    )
    @Column(
            name = "user_value",
            length = 120
    )
    @Builder.Default
    private List<String> shopByUser =
            new ArrayList<>();


    // ==============================
    // SHOP BY TECH
    // ==============================

    @ElementCollection
    @CollectionTable(
            name = "product_shop_by_tech",
            joinColumns =
            @JoinColumn(name = "product_id")
    )
    @Column(
            name = "tech_value",
            length = 120
    )
    @Builder.Default
    private List<String> shopByTech =
            new ArrayList<>();


    // ==============================
    // MATTRESS FEEL
    // ==============================

    @ElementCollection
    @CollectionTable(
            name = "product_mattress_feel",
            joinColumns =
            @JoinColumn(name = "product_id")
    )
    @Column(
            name = "feel_value",
            length = 120
    )
    @Builder.Default
    private List<String> mattressFeel =
            new ArrayList<>();


    // ==============================
    // PRICING BY THICKNESS
    // ==============================

    @Column(
            name = "price_4_inch",
            precision = 12,
            scale = 2
    )
    private BigDecimal price4Inch;


    @Column(
            name = "price_5_inch",
            precision = 12,
            scale = 2
    )
    private BigDecimal price5Inch;


    @Column(
            name = "price_6_inch",
            precision = 12,
            scale = 2
    )
    private BigDecimal price6Inch;


    @Column(
            name = "price_8_inch",
            precision = 12,
            scale = 2
    )
    private BigDecimal price8Inch;



}