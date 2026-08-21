package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.request.ForgotPasswordRequest;
import com.example.somnera_mattress_backend.util.OtpGenerator;
import com.example.somnera_mattress_backend.dto.request.LoginRequest;
import com.example.somnera_mattress_backend.dto.request.RegisterRequest;
import com.example.somnera_mattress_backend.dto.request.ResetPasswordRequest;
import com.example.somnera_mattress_backend.dto.request.SendOtpRequest;
import com.example.somnera_mattress_backend.dto.response.LoginResponse;
import com.example.somnera_mattress_backend.dto.response.UserResponse;
import com.example.somnera_mattress_backend.entity.PasswordResetToken;
import com.example.somnera_mattress_backend.entity.Role;
import com.example.somnera_mattress_backend.entity.Status;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.UnauthorizedException;
import com.example.somnera_mattress_backend.repository.PasswordResetTokenRepository;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.security.JwtService;
import com.example.somnera_mattress_backend.service.AuthService;
import com.example.somnera_mattress_backend.service.EmailService;
import com.example.somnera_mattress_backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl
        implements AuthService {

    private final UserRepository
            userRepository;

    private final PasswordResetTokenRepository
            passwordResetTokenRepository;

    private final OtpService
            otpService;

    private final EmailService
            emailService;

    private final PasswordEncoder
            passwordEncoder;

    private final AuthenticationManager
            authenticationManager;

    private final JwtService
            jwtService;

    private final OtpGenerator
            otpGenerator;


    @Value("${password-reset.expiration.minutes}")
    private long resetExpirationMinutes;

    @Override
    public void sendRegistrationOtp(
            SendOtpRequest request
    ) {
        otpService.sendRegistrationOtp(
                request.getEmail()
        );
    }

    @Override
    @Transactional
    public UserResponse register(
            RegisterRequest request
    ) {
        validateMatchingPasswords(
                request.getPassword(),
                request.getConfirmPassword()
        );

        String email =
                normalizeEmail(
                        request.getEmail()
                );

        String mobile =
                request.getMobile().trim();

        if (
                userRepository
                        .existsByEmailIgnoreCase(email)
        ) {
            throw new BadRequestException(
                    "An account already exists with this email"
            );
        }

        if (
                userRepository
                        .existsByMobile(mobile)
        ) {
            throw new BadRequestException(
                    "An account already exists with this mobile number"
            );
        }

        otpService.verifyRegistrationOtp(
                email,
                request.getOtp()
        );

        User user =
                User.builder()
                        .firstName(
                                request
                                        .getFirstName()
                                        .trim()
                        )
                        .lastName(
                                request
                                        .getLastName()
                                        .trim()
                        )
                        .email(email)
                        .mobile(mobile)
                        .password(
                                passwordEncoder.encode(
                                        request.getPassword()
                                )
                        )
                        .role(Role.USER)
                        .status(Status.ACTIVE)
                        .emailVerified(true)
                        .build();

        User savedUser =
                userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(
                    savedUser.getEmail(),
                    savedUser.getFirstName()
            );
        } catch (RuntimeException exception) {
            /*
             * Registration must remain successful even if
             * the optional welcome email temporarily fails.
             */
            exception.printStackTrace();
        }

        return mapToUserResponse(savedUser);
    }

   @Override
public LoginResponse login(
        LoginRequest request
) {

    String email =
            normalizeEmail(
                    request.getEmail()
            );


    /*
    ==============================================
    FIND USER FIRST
    ==============================================
    */

    User user =
            userRepository
                    .findByEmailIgnoreCase(
                            email
                    )
                    .orElseThrow(

                            () ->
                                    new UnauthorizedException(
                                            "Invalid email or password"
                                    )
                    );


    /*
    ==============================================
    ACCOUNT STATUS
    ==============================================
    */

    if (
            user.getStatus()
                    == Status.BLOCKED
    ) {

        throw new UnauthorizedException(
                "Your account has been blocked. Please contact support."
        );
    }


    if (
            user.getStatus()
                    == Status.INACTIVE
    ) {

        throw new UnauthorizedException(
                "Your account is inactive. Please contact support."
        );
    }


    if (
            user.getStatus()
                    != Status.ACTIVE
    ) {

        throw new UnauthorizedException(
                "Your account is not active."
        );
    }


    /*
    ==============================================
    EMAIL VERIFICATION
    ==============================================
    */

    if (
            !user.isEmailVerified()
    ) {

        throw new UnauthorizedException(
                "Please verify your email before logging in"
        );
    }


    /*
    ==============================================
    PASSWORD AUTHENTICATION
    ==============================================
    */

    try {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        email,

                        request.getPassword()
                )
        );


    } catch (
            AuthenticationException exception
    ) {

        throw new UnauthorizedException(
                "Invalid email or password"
        );
    }


    /*
    ==============================================
    JWT
    ==============================================
    */

    String token =
            jwtService
                    .generateToken(
                            user
                    );


    return LoginResponse
            .builder()

            .token(
                    token
            )

            .tokenType(
                    "Bearer"
            )

            .userId(
                    user.getId()
            )

            .firstName(
                    user.getFirstName()
            )

            .lastName(
                    user.getLastName()
            )

            .email(
                    user.getEmail()
            )

            .role(
                    user.getRole()
            )

            .build();
}

    @Override
    @Transactional
    public void forgotPassword(
            ForgotPasswordRequest request
    ) {

        String email =
                normalizeEmail(
                        request.getEmail()
                );


        Optional<User> optionalUser =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        );


        /*
         * Don't reveal whether an email
         * is registered.
         */
        if (optionalUser.isEmpty()) {
            return;
        }


        User user =
                optionalUser.get();


        // ==============================
        // INVALIDATE PREVIOUS OTP
        // ==============================

        passwordResetTokenRepository
                .findTopByUserAndUsedFalseOrderByCreatedAtDesc(
                        user
                )
                .ifPresent(
                        previousOtp -> {

                            previousOtp.setUsed(
                                    true
                            );

                            passwordResetTokenRepository
                                    .save(
                                            previousOtp
                                    );
                        }
                );


        // ==============================
        // GENERATE 6-DIGIT OTP
        // ==============================

        String otp =
                otpGenerator
                        .generateOtp();


        // ==============================
        // STORE HASHED OTP
        // ==============================

        PasswordResetToken resetOtp =
                PasswordResetToken
                        .builder()

                        .user(
                                user
                        )

                        .otpHash(
                                passwordEncoder
                                        .encode(
                                                otp
                                        )
                        )

                        .expiresAt(
                                LocalDateTime
                                        .now()
                                        .plusMinutes(
                                                resetExpirationMinutes
                                        )
                        )

                        .used(
                                false
                        )

                        .failedAttempts(
                                0
                        )

                        .build();


        passwordResetTokenRepository
                .save(
                        resetOtp
                );


        // ==============================
        // SEND OTP THROUGH BREVO
        // ==============================

        emailService
                .sendPasswordResetOtp(
                        user.getEmail(),
                        user.getFirstName(),
                        otp
                );
    }

    @Override
    @Transactional
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        // ==============================
        // CHECK PASSWORDS
        // ==============================

        validateMatchingPasswords(
                request.getNewPassword(),
                request.getConfirmPassword()
        );


        // ==============================
        // NORMALIZE EMAIL
        // ==============================

        String email =
                normalizeEmail(
                        request.getEmail()
                );


        // ==============================
        // FIND USER
        // ==============================

        User user =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                "Invalid OTP or email"
                                        )
                        );


        // ==============================
        // GET LATEST UNUSED RESET OTP
        // ==============================

        PasswordResetToken resetOtp =
                passwordResetTokenRepository
                        .findTopByUserAndUsedFalseOrderByCreatedAtDesc(
                                user
                        )
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                "Please request a password reset OTP first"
                                        )
                        );


        // ==============================
        // CHECK EXPIRATION
        // ==============================

        if (
                resetOtp
                        .getExpiresAt()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            resetOtp.setUsed(
                    true
            );

            passwordResetTokenRepository
                    .save(
                            resetOtp
                    );


            throw new BadRequestException(
                    "OTP has expired. Please request a new OTP"
            );
        }


        // ==============================
        // CHECK FAILED ATTEMPTS
        // ==============================

        if (
                resetOtp.getFailedAttempts()
                        >= 5
        ) {

            resetOtp.setUsed(
                    true
            );

            passwordResetTokenRepository
                    .save(
                            resetOtp
                    );


            throw new BadRequestException(
                    "Too many incorrect OTP attempts. Please request a new OTP"
            );
        }


        // ==============================
        // VERIFY OTP
        // ==============================

        if (
                !passwordEncoder.matches(
                        request.getOtp(),
                        resetOtp.getOtpHash()
                )
        ) {

            int failedAttempts =
                    resetOtp.getFailedAttempts()
                            + 1;


            resetOtp.setFailedAttempts(
                    failedAttempts
            );


            /*
             * Make OTP unusable after
             * the fifth incorrect attempt.
             */
            if (failedAttempts >= 5) {

                resetOtp.setUsed(
                        true
                );
            }


            passwordResetTokenRepository
                    .save(
                            resetOtp
                    );


            if (failedAttempts >= 5) {

                throw new BadRequestException(
                        "Too many incorrect OTP attempts. Please request a new OTP"
                );
            }


            throw new BadRequestException(
                    "Invalid OTP"
            );
        }


        // ==============================
        // CHANGE PASSWORD
        // ==============================

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        userRepository.save(
                user
        );


        // ==============================
        // MARK OTP USED
        // ==============================

        resetOtp.setUsed(
                true
        );


        passwordResetTokenRepository
                .save(
                        resetOtp
                );


        // ==============================
        // PASSWORD CHANGED EMAIL
        // ==============================

        try {

            emailService
                    .sendPasswordChangedEmail(
                            user.getEmail(),
                            user.getFirstName()
                    );

        } catch (RuntimeException exception) {

            /*
             * Password reset has already
             * succeeded. Email failure should
             * not undo the password change.
             */

            exception.printStackTrace();
        }
    }

    private void validateMatchingPasswords(
            String password,
            String confirmPassword
    ) {
        if (!password.equals(confirmPassword)) {
            throw new BadRequestException(
                    "Password and confirm password do not match"
            );
        }
    }

    private String normalizeEmail(
            String email
    ) {
        return email
                .trim()
                .toLowerCase();
    }

    private UserResponse mapToUserResponse(
            User user
    ) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(
                        user.isEmailVerified()
                )
                .build();
    }
}
