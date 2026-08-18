package com.example.somnera_mattress_backend.serviceImpl;


import com.example.somnera_mattress_backend.entity.EmailOtp;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.repository.EmailOtpRepository;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.service.EmailService;
import com.example.somnera_mattress_backend.service.OtpService;
import com.example.somnera_mattress_backend.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl
        implements OtpService {

    private final EmailOtpRepository
            emailOtpRepository;

    private final UserRepository
            userRepository;

    private final EmailService
            emailService;

    private final OtpGenerator
            otpGenerator;

    private final PasswordEncoder
            passwordEncoder;

    @Value("${otp.expiration.minutes}")
    private long otpExpirationMinutes;

    @Value("${otp.resend.cooldown.seconds}")
    private long otpResendCooldownSeconds;

    @Override
    @Transactional
    public void sendRegistrationOtp(
            String rawEmail
    ) {
        String email =
                normalizeEmail(rawEmail);

        if (
                userRepository
                        .existsByEmailIgnoreCase(email)
        ) {
            throw new BadRequestException(
                    "An account already exists with this email"
            );
        }

        emailOtpRepository
                .findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(
                        email
                )
                .ifPresent(this::validateResendCooldown);

        String otp =
                otpGenerator.generateOtp();

        EmailOtp emailOtp =
                EmailOtp.builder()
                        .email(email)
                        .otpHash(
                                passwordEncoder.encode(otp)
                        )
                        .expiresAt(
                                LocalDateTime.now()
                                        .plusMinutes(
                                                otpExpirationMinutes
                                        )
                        )
                        .used(false)
                        .failedAttempts(0)
                        .build();

        emailOtpRepository.save(emailOtp);

        emailService.sendRegistrationOtp(
                email,
                "Customer",
                otp
        );
    }

    @Override
    @Transactional
    public void verifyRegistrationOtp(
            String rawEmail,
            String otp
    ) {
        String email =
                normalizeEmail(rawEmail);

        EmailOtp emailOtp =
                emailOtpRepository
                        .findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(
                                email
                        )
                        .orElseThrow(
                                () -> new BadRequestException(
                                        "Please request an OTP first"
                                )
                        );

        if (
                emailOtp.getExpiresAt()
                        .isBefore(LocalDateTime.now())
        ) {
            throw new BadRequestException(
                    "OTP has expired. Please request a new OTP"
            );
        }

        if (emailOtp.getFailedAttempts() >= 5) {
            throw new BadRequestException(
                    "Too many incorrect attempts. Please request a new OTP"
            );
        }

        if (
                !passwordEncoder.matches(
                        otp,
                        emailOtp.getOtpHash()
                )
        ) {
            emailOtp.setFailedAttempts(
                    emailOtp.getFailedAttempts() + 1
            );

            emailOtpRepository.save(emailOtp);

            throw new BadRequestException(
                    "Invalid OTP"
            );
        }

        emailOtp.setUsed(true);

        emailOtpRepository.save(emailOtp);
    }

    private void validateResendCooldown(
            EmailOtp previousOtp
    ) {
        LocalDateTime createdAt =
                previousOtp.getCreatedAt();

        long passedSeconds =
                ChronoUnit.SECONDS.between(
                        createdAt,
                        LocalDateTime.now()
                );

        if (
                passedSeconds
                        < otpResendCooldownSeconds
        ) {
            long remainingSeconds =
                    otpResendCooldownSeconds
                            - passedSeconds;

            throw new BadRequestException(
                    "Please wait "
                            + remainingSeconds
                            + " seconds before requesting another OTP"
            );
        }

        previousOtp.setUsed(true);

        emailOtpRepository.save(previousOtp);
    }

    private String normalizeEmail(
            String email
    ) {
        return email
                .trim()
                .toLowerCase();
    }
}
