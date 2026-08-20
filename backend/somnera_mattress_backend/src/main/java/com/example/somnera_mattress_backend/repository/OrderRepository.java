package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.Order;
import com.example.somnera_mattress_backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {


    // ==============================
    // FIND BY RAZORPAY ORDER ID
    // ==============================

    Optional<Order> findByRazorpayOrderId(
            String razorpayOrderId
    );


    // ==============================
    // FIND USER ORDERS
    // ==============================

    List<Order> findByUserOrderByCreatedAtDesc(
            User user
    );


    // ==============================
    // FIND SPECIFIC USER ORDER
    // ==============================

    Optional<Order> findByIdAndUser(
            Long orderId,
            User user
    );

    List<Order> findAllByOrderByCreatedAtDesc();
}