package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.DistributorRequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DistributorRequestRepository
        extends JpaRepository<DistributorRequest, Long> {


    // ==============================
    // GET LATEST REQUESTS FIRST
    // ==============================

    List<DistributorRequest>
    findAllByOrderByCreatedAtDesc();


    // ==============================
    // OPTIONAL:
    // CHECK DUPLICATE EMAIL + PHONE
    // ==============================

    boolean existsByEmailIgnoreCaseAndPhoneNumber(
            String email,
            String phoneNumber
    );
}