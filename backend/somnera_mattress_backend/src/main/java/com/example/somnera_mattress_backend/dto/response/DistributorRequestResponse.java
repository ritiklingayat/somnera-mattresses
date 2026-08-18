package com.example.somnera_mattress_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributorRequestResponse {


    // ==============================
    // ID
    // ==============================

    private Long id;


    // ==============================
    // APPLICANT DETAILS
    // ==============================

    private String fullName;

    private String email;

    private String phoneNumber;


    // ==============================
    // DISTRIBUTOR DETAILS
    // ==============================

    private String targetLocation;

    private String investmentRange;

    private String businessExperience;


    // ==============================
    // CREATED AT
    // ==============================

    private LocalDateTime createdAt;
}