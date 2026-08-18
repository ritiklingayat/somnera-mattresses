package com.example.somnera_mattress_backend.service;

public interface OtpService {

    void sendRegistrationOtp(String email);

    void verifyRegistrationOtp(
            String email,
            String otp
    );
}
