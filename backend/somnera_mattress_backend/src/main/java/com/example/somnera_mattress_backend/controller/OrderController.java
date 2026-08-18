package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.OrderResponse;
import com.example.somnera_mattress_backend.service.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {


    private final OrderService orderService;


    // ==============================
    // GET MY ORDERS
    // ==============================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<OrderResponse>>
            >
    getMyOrders(
            Authentication authentication
    ) {


        List<OrderResponse> response =
                orderService
                        .getMyOrders(
                                authentication.getName()
                        );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Orders fetched successfully",
                        response
                )
        );
    }


    // ==============================
    // GET MY ORDER BY ID
    // ==============================

    @GetMapping("/{orderId}")
    public ResponseEntity<
            ApiResponse<OrderResponse>
            >
    getMyOrderById(

            @PathVariable
            Long orderId,

            Authentication authentication
    ) {


        OrderResponse response =
                orderService
                        .getMyOrderById(
                                orderId,
                                authentication.getName()
                        );


        return ResponseEntity.ok(

                ApiResponse.success(
                        "Order fetched successfully",
                        response
                )
        );
    }
}