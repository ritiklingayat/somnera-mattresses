package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.request.DistributorRequestRequest;
import com.example.somnera_mattress_backend.dto.response.DistributorRequestResponse;

import java.util.List;


public interface DistributorRequestService {


    // ==============================
    // SUBMIT DISTRIBUTOR REQUEST
    // ==============================

    DistributorRequestResponse submitRequest(
            DistributorRequestRequest request
    );


    // ==============================
    // GET ALL REQUESTS
    // ==============================

    List<DistributorRequestResponse> getAllRequests();
}