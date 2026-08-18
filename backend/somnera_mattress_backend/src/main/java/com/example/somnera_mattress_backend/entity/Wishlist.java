package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(
        name = "wishlists",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_wishlist_user_product",
                        columnNames = {
                                "user_id",
                                "product_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {


    // ==============================
    // ID
    // ==============================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    // ==============================
    // USER
    // ==============================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;


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
    // CREATED AT
    // ==============================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    // ==============================
    // BEFORE INSERT
    // ==============================

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt =
                    LocalDateTime.now();
        }
    }
}