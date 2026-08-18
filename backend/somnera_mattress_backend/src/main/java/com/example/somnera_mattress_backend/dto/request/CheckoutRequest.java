package com.example.somnera_mattress_backend.dto.request;

import com.example.somnera_mattress_backend.entity.PaymentMethod;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CheckoutRequest {


    // ==============================
    // FULL NAME
    // ==============================

    @NotBlank(
            message = "Full name is required"
    )
    @Size(
            min = 2,
            max = 120,
            message = "Full name must contain 2 to 120 characters"
    )
    private String fullName;


    // ==============================
    // MOBILE
    // ==============================

    @NotBlank(
            message = "Mobile number is required"
    )
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Please enter a valid 10 digit mobile number"
    )
    private String mobile;


    // ==============================
    // EMAIL
    // ==============================

    @NotBlank(
            message = "Email address is required"
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
    // CITY
    // ==============================

    @NotBlank(
            message = "City is required"
    )
    @Size(
            max = 100,
            message = "City must not exceed 100 characters"
    )
    private String city;


    // ==============================
    // STATE
    // ==============================

    @NotBlank(
            message = "State is required"
    )
    @Size(
            max = 100,
            message = "State must not exceed 100 characters"
    )
    private String state;


    // ==============================
    // PINCODE
    // ==============================

    @NotBlank(
            message = "Pincode is required"
    )
    @Pattern(
            regexp = "^[1-9][0-9]{5}$",
            message = "Please enter a valid 6 digit pincode"
    )
    private String pincode;


    // ==============================
    // FULL ADDRESS
    // ==============================

    @NotBlank(
            message = "Full address is required"
    )
    @Size(
            min = 5,
            max = 500,
            message = "Full address must contain 5 to 500 characters"
    )
    private String fullAddress;


    // ==============================
    // PAYMENT METHOD
    // ==============================

    @NotNull(
            message = "Payment method is required"
    )
    private PaymentMethod paymentMethod;
}