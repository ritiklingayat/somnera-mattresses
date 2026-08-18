package com.example.somnera_mattress_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DistributorRequestRequest {


    // ==============================
    // FULL NAME
    // ==============================

    @NotBlank(
            message = "Full name is required"
    )
    @Size(
            min = 2,
            max = 150,
            message = "Full name must contain 2 to 150 characters"
    )
    private String fullName;


    // ==============================
    // EMAIL
    // ==============================

    @NotBlank(
            message = "Email is required"
    )
    @Email(
            message = "Please enter a valid email address"
    )
    @Size(
            max = 150,
            message = "Email must not exceed 150 characters"
    )
    private String email;


    // ==============================
    // PHONE NUMBER
    // ==============================

    @NotBlank(
            message = "Phone number is required"
    )
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Please enter a valid 10 digit mobile number"
    )
    private String phoneNumber;


    // ==============================
    // TARGET CITY / LOCATION
    // ==============================

    @NotBlank(
            message = "Target location is required"
    )
    @Size(
            max = 200,
            message = "Target location must not exceed 200 characters"
    )
    private String targetLocation;


    // ==============================
    // INVESTMENT RANGE
    // ==============================

    @NotBlank(
            message = "Investment range is required"
    )
    @Size(
            max = 100,
            message = "Investment range must not exceed 100 characters"
    )
    private String investmentRange;


    // ==============================
    // BUSINESS EXPERIENCE
    // ==============================

    @NotBlank(
            message = "Business experience is required"
    )
    @Size(
            min = 5,
            max = 1000,
            message = "Business experience must contain 5 to 1000 characters"
    )
    private String businessExperience;
}