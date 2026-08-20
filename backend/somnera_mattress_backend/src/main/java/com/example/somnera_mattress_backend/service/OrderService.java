package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.response.OrderResponse;

import java.util.List;


public interface OrderService {


    // ==============================
    // GET LOGGED-IN USER ORDERS
    // ==============================

    List<OrderResponse> getMyOrders(
            String userEmail
    );


    // ==============================
    // GET ONE USER ORDER
    // ==============================

    OrderResponse getMyOrderById(
            Long orderId,
            String userEmail
    );

    List<OrderResponse> getAllOrders();
}