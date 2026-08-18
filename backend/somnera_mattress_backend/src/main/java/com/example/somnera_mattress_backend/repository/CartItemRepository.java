package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.CartItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {


    // ==============================
    // FIND SAME PRODUCT + THICKNESS
    // IN SAME CART
    // ==============================

    Optional<CartItem>
    findByCartIdAndProductIdAndThickness(
            Long cartId,
            Long productId,
            Integer thickness
    );


    // ==============================
    // FIND ITEM BELONGING TO CART
    // ==============================

    Optional<CartItem>
    findByIdAndCartId(
            Long itemId,
            Long cartId
    );
}