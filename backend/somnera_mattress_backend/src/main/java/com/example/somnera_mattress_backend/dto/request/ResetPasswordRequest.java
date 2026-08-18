package com.example.somnera_mattress_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ResetPasswordRequest {


    // ==============================
    // EMAIL
    // ==============================

    @NotBlank(
            message = "Email is required"
    )
    @Email(
            message = "Please enter a valid email address"
    )
    private String email;


    // ==============================
    // OTP
    // ==============================

    @NotBlank(
            message = "OTP is required"
    )
    @Pattern(
            regexp = "^[0-9]{6}$",
            message = "OTP must be exactly 6 digits"
    )
    private String otp;


    // ==============================
    // NEW PASSWORD
    // ==============================

    @NotBlank(
            message = "New password is required"
    )
    @Size(
            min = 8,
            max = 100,
            message = "Password must contain at least 8 characters"
    )
    private String newPassword;


    // ==============================
    // CONFIRM PASSWORD
    // ==============================

    @NotBlank(
            message = "Confirm password is required"
    )
    private String confirmPassword;
}