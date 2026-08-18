package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.PasswordResetToken;
import com.example.somnera_mattress_backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {


    // ==============================
    // GET LATEST ACTIVE OTP
    // ==============================

    Optional<PasswordResetToken>
    findTopByUserAndUsedFalseOrderByCreatedAtDesc(
            User user
    );
}