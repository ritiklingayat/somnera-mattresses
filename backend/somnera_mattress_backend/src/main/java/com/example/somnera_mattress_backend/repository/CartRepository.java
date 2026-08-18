package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.Cart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CartRepository
        extends JpaRepository<Cart, Long> {


    // ==============================
    // FIND CART BY USER ID
    // ==============================

    Optional<Cart> findByUserId(
            Long userId
    );
}