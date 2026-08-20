package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.UserResponse;
import com.example.somnera_mattress_backend.service.OrderService;
import com.example.somnera_mattress_backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.somnera_mattress_backend.dto.response.OrderResponse;
import com.example.somnera_mattress_backend.service.OrderService;

import java.util.List;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {


    private final UserService
            userService;

    private final OrderService orderService;


    /*
    ==============================================
    ADMIN DASHBOARD ACCESS TEST
    ==============================================
    */

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>>
    adminDashboard() {


        return ResponseEntity.ok(

                ApiResponse.success(

                        "Admin dashboard access granted",

                        "ADMIN_ACCESS"
                )
        );
    }

    /*
==============================================
GET ALL CUSTOMER ORDERS
==============================================
*/

@GetMapping("/orders")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<
        ApiResponse<List<OrderResponse>>
        >
getAllOrders() {


    List<OrderResponse> orders =
            orderService
                    .getAllOrders();


    return ResponseEntity.ok(

            ApiResponse.success(

                    "Orders fetched successfully",

                    orders
            )
    );
}


    /*
    ==============================================
    GET ALL REGISTERED CUSTOMERS
    ==============================================
    */

    @GetMapping("/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<
            ApiResponse<List<UserResponse>>
            >
    getAllCustomers() {


        List<UserResponse> customers =
                userService
                        .getAllCustomers();


        return ResponseEntity.ok(

                ApiResponse.success(

                        "Customers fetched successfully",

                        customers
                )
        );
    }
}