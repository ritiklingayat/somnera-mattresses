package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.request.ForgotPasswordRequest;
import com.example.somnera_mattress_backend.dto.request.LoginRequest;
import com.example.somnera_mattress_backend.dto.request.RegisterRequest;
import com.example.somnera_mattress_backend.dto.request.ResetPasswordRequest;
import com.example.somnera_mattress_backend.dto.request.SendOtpRequest;
import com.example.somnera_mattress_backend.dto.response.LoginResponse;
import com.example.somnera_mattress_backend.dto.response.UserResponse;

public interface AuthService {

    void sendRegistrationOtp(
            SendOtpRequest request
    );

    UserResponse register(
            RegisterRequest request
    );

    LoginResponse login(
            LoginRequest request
    );

    void forgotPassword(
            ForgotPasswordRequest request
    );

    void resetPassword(
            ResetPasswordRequest request
    );
}
