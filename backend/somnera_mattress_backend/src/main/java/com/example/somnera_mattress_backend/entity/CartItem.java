package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(
        name = "cart_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_cart_product_thickness",
                        columnNames = {
                                "cart_id",
                                "product_id",
                                "thickness"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {


    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    // ==============================
    // CART
    // ==============================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "cart_id",
            nullable = false
    )
    private Cart cart;


    // ==============================
    // PRODUCT
    // ==============================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "product_id",
            nullable = false
    )
    private Product product;


    // ==============================
    // MATTRESS THICKNESS
    // ==============================

    @Column(
            name = "thickness",
            nullable = false
    )
    private Integer thickness;


    // ==============================
    // QUANTITY
    // ==============================

    @Column(
            name = "quantity",
            nullable = false
    )
    private Integer quantity;
}