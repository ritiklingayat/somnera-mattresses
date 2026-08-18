package com.example.somnera_mattress_backend.controller;


import com.example.somnera_mattress_backend.dto.request.ForgotPasswordRequest;
import com.example.somnera_mattress_backend.dto.request.LoginRequest;
import com.example.somnera_mattress_backend.dto.request.RegisterRequest;
import com.example.somnera_mattress_backend.dto.request.ResetPasswordRequest;
import com.example.somnera_mattress_backend.dto.request.SendOtpRequest;
import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.LoginResponse;
import com.example.somnera_mattress_backend.dto.response.UserResponse;
import com.example.somnera_mattress_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService
            authService;

    @PostMapping("/send-registration-otp")
    public ResponseEntity<ApiResponse<Void>>
    sendRegistrationOtp(
            @Valid
            @RequestBody
            SendOtpRequest request
    ) {
        authService.sendRegistrationOtp(
                request
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "OTP sent successfully to your email"
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>>
    register(
            @Valid
            @RequestBody
            RegisterRequest request
    ) {
        UserResponse response =
                authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Registration completed successfully",
                                response
                        )
                );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>>
    login(
            @Valid
            @RequestBody
            LoginRequest request
    ) {
        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        response
                )
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>>
    forgotPassword(
            @Valid
            @RequestBody
            ForgotPasswordRequest request
    ) {

        authService.forgotPassword(
                request
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "If an account exists with this email, a password reset OTP has been sent"
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>>
    resetPassword(
            @Valid
            @RequestBody
            ResetPasswordRequest request
    ) {
        authService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Password reset successfully"
                )
        );
    }
}
