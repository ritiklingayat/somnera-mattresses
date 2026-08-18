package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
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
        name = "email_otps",
        indexes = {
                @Index(
                        name = "idx_email_otps_email",
                        columnList = "email"
                )
        }
)
public class EmailOtp extends BaseEntity {

    @Column(
            name = "email",
            nullable = false,
            length = 150
    )
    private String email;

    @Column(
            name = "otp_hash",
            nullable = false
    )
    private String otpHash;

    @Column(
            name = "expires_at",
            nullable = false
    )
    private LocalDateTime expiresAt;

    @Column(
            name = "used",
            nullable = false
    )
    private boolean used;

    @Column(
            name = "failed_attempts",
            nullable = false
    )
    private int failedAttempts;
}
