package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

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
}
