package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.request.DistributorRequestRequest;
import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.DistributorRequestResponse;
import com.example.somnera_mattress_backend.service.DistributorRequestService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/distributor-requests")
@RequiredArgsConstructor
public class DistributorRequestController {


    private final DistributorRequestService
            distributorRequestService;


    // ==============================
    // SUBMIT DISTRIBUTOR REQUEST
    // PUBLIC API
    // ==============================

    @PostMapping
    public ResponseEntity<
            ApiResponse<DistributorRequestResponse>
            >
    submitRequest(

            @Valid
            @RequestBody
            DistributorRequestRequest request
    ) {


        DistributorRequestResponse response =
                distributorRequestService
                        .submitRequest(
                                request
                        );


        return ResponseEntity.ok(

                ApiResponse
                        .<DistributorRequestResponse>builder()

                        .success(
                                true
                        )

                        .message(
                                "Distributor request submitted successfully"
                        )

                        .data(
                                response
                        )

                        .timestamp(
                                LocalDateTime.now()
                        )

                        .build()
        );
    }


    // ==============================
    // GET ALL DISTRIBUTOR REQUESTS
    // ADMIN ONLY
    // ==============================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<DistributorRequestResponse>>
            >
    getAllRequests() {


        List<DistributorRequestResponse> response =
                distributorRequestService
                        .getAllRequests();


        return ResponseEntity.ok(

                ApiResponse
                        .<List<DistributorRequestResponse>>builder()

                        .success(
                                true
                        )

                        .message(
                                "Distributor requests fetched successfully"
                        )

                        .data(
                                response
                        )

                        .timestamp(
                                LocalDateTime.now()
                        )

                        .build()
        );
    }
}