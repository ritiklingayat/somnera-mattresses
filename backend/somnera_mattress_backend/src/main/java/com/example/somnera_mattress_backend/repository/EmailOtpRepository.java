package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository
        extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp>
    findTopByEmailIgnoreCaseAndUsedFalseOrderByCreatedAtDesc(
            String email
    );
}
