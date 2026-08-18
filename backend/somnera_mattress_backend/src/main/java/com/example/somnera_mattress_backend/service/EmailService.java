package com.example.somnera_mattress_backend.service;

public interface EmailService {

    void sendRegistrationOtp(
            String recipientEmail,
            String recipientName,
            String otp
    );

    void sendWelcomeEmail(
            String recipientEmail,
            String recipientName
    );

    void sendPasswordResetOtp(
            String recipientEmail,
            String recipientName,
            String otp
    );

    void sendPasswordChangedEmail(
            String recipientEmail,
            String recipientName
    );

    void sendDistributorRequestNotification(
            String fullName,
            String email,
            String phoneNumber,
            String targetLocation,
            String investmentRange,
            String businessExperience
    );
}