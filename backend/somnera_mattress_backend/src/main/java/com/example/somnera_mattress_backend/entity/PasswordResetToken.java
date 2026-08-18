package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "password_reset_tokens",
        indexes = {
                @Index(
                        name = "idx_password_reset_user",
                        columnList = "user_id"
                )
        }
)
public class PasswordResetToken
        extends BaseEntity {


    // ==============================
    // USER
    // ==============================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;


    // ==============================
    // OTP HASH
    // ==============================

    /*
     * Never store the actual OTP.
     *
     * Example:
     *
     * User receives:
     * 483921
     *
     * Database stores:
     * BCrypt hash of 483921
     */
    @Column(
            name = "otp_hash",
            nullable = false,
            length = 100
    )
    private String otpHash;


    // ==============================
    // EXPIRATION
    // ==============================

    @Column(
            name = "expires_at",
            nullable = false
    )
    private LocalDateTime expiresAt;


    // ==============================
    // USED
    // ==============================

    @Column(
            name = "used",
            nullable = false
    )
    private boolean used;


    // ==============================
    // FAILED OTP ATTEMPTS
    // ==============================

    @Column(
            name = "failed_attempts",
            nullable = false
    )
    private int failedAttempts;
}