package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "distributor_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistributorRequest {


    // ==============================
    // ID
    // ==============================

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    // ==============================
    // FULL NAME
    // ==============================

    @Column(
            name = "full_name",
            nullable = false,
            length = 150
    )
    private String fullName;


    // ==============================
    // EMAIL
    // ==============================

    @Column(
            name = "email",
            nullable = false,
            length = 150
    )
    private String email;


    // ==============================
    // PHONE NUMBER
    // ==============================

    @Column(
            name = "phone_number",
            nullable = false,
            length = 20
    )
    private String phoneNumber;


    // ==============================
    // TARGET CITY / LOCATION
    // ==============================

    @Column(
            name = "target_location",
            nullable = false,
            length = 200
    )
    private String targetLocation;


    // ==============================
    // INVESTMENT RANGE
    // ==============================

    @Column(
            name = "investment_range",
            nullable = false,
            length = 100
    )
    private String investmentRange;


    // ==============================
    // BUSINESS EXPERIENCE
    // ==============================

    @Column(
            name = "business_experience",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String businessExperience;


    // ==============================
    // CREATED AT
    // ==============================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    // ==============================
    // UPDATED AT
    // ==============================

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;


    // ==============================
    // BEFORE INSERT
    // ==============================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;

        updatedAt = now;
    }


    // ==============================
    // BEFORE UPDATE
    // ==============================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }
}