package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.Wishlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface WishlistRepository
        extends JpaRepository<Wishlist, Long> {


    // ==============================
    // GET USER WISHLIST
    // ==============================

    List<Wishlist> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );


    // ==============================
    // FIND ONE WISHLIST ITEM
    // ==============================

    Optional<Wishlist> findByUserIdAndProductId(
            Long userId,
            Long productId
    );


    // ==============================
    // CHECK PRODUCT IN WISHLIST
    // ==============================

    boolean existsByUserIdAndProductId(
            Long userId,
            Long productId
    );


    // ==============================
    // DELETE PRODUCT FROM WISHLIST
    // ==============================

    void deleteByUserIdAndProductId(
            Long userId,
            Long productId
    );


    // ==============================
    // COUNT USER WISHLIST
    // ==============================

    long countByUserId(
            Long userId
    );
}