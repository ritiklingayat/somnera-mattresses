package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.Order;
import com.example.somnera_mattress_backend.entity.OrderItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {


    // ==============================
    // FIND ITEMS BY ORDER
    // ==============================

    List<OrderItem> findByOrder(
            Order order
    );
}