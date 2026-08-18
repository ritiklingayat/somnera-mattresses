package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.request.DistributorRequestRequest;
import com.example.somnera_mattress_backend.dto.response.DistributorRequestResponse;
import com.example.somnera_mattress_backend.entity.DistributorRequest;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.repository.DistributorRequestRepository;
import com.example.somnera_mattress_backend.service.EmailService;
import com.example.somnera_mattress_backend.service.DistributorRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class DistributorRequestServiceImpl
        implements DistributorRequestService {


    private final DistributorRequestRepository
            distributorRequestRepository;


    private final EmailService
            emailService;


    // ==============================
    // SUBMIT DISTRIBUTOR REQUEST
    // ==============================

    @Override
    @Transactional
    public DistributorRequestResponse submitRequest(
            DistributorRequestRequest request
    ) {


        String fullName =
                clean(
                        request.getFullName()
                );


        String email =
                clean(
                        request.getEmail()
                );


        String phoneNumber =
                clean(
                        request.getPhoneNumber()
                );


        String targetLocation =
                clean(
                        request.getTargetLocation()
                );


        String investmentRange =
                clean(
                        request.getInvestmentRange()
                );


        String businessExperience =
                clean(
                        request.getBusinessExperience()
                );


        // ==============================
        // OPTIONAL DUPLICATE CHECK
        // ==============================

//        boolean alreadySubmitted =
//                distributorRequestRepository
//                        .existsByEmailIgnoreCaseAndPhoneNumber(
//                                email,
//                                phoneNumber
//                        );
//
//
//        if (alreadySubmitted) {
//
//            throw new BadRequestException(
//                    "A distributor request has already been submitted with this email and phone number"
//            );
//        }


        // ==============================
        // CREATE ENTITY
        // ==============================

        DistributorRequest distributorRequest =
                DistributorRequest
                        .builder()

                        .fullName(
                                fullName
                        )

                        .email(
                                email
                        )

                        .phoneNumber(
                                phoneNumber
                        )

                        .targetLocation(
                                targetLocation
                        )

                        .investmentRange(
                                investmentRange
                        )

                        .businessExperience(
                                businessExperience
                        )

                        .build();


        // ==============================
        // SAVE TO POSTGRESQL
        // ==============================

        DistributorRequest savedRequest =
                distributorRequestRepository
                        .saveAndFlush(
                                distributorRequest
                        );


        // ==============================
        // SEND BREVO NOTIFICATION
        // ==============================

        try {

            emailService
                    .sendDistributorRequestNotification(

                            savedRequest.getFullName(),

                            savedRequest.getEmail(),

                            savedRequest.getPhoneNumber(),

                            savedRequest.getTargetLocation(),

                            savedRequest.getInvestmentRange(),

                            savedRequest.getBusinessExperience()
                    );

        } catch (Exception exception) {

            /*
             * IMPORTANT:
             *
             * We do not want to lose a valuable
             * distributor lead simply because
             * Brevo temporarily fails.
             *
             * The database request remains saved.
             */

            System.err.println(
                    "Distributor request saved, but notification email failed: "
                            + exception.getMessage()
            );
        }


        return mapToResponse(
                savedRequest
        );
    }


    // ==============================
    // GET ALL REQUESTS
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public List<DistributorRequestResponse>
    getAllRequests() {


        return distributorRequestRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }


    // ==============================
    // MAP RESPONSE
    // ==============================

    private DistributorRequestResponse mapToResponse(
            DistributorRequest distributorRequest
    ) {


        return DistributorRequestResponse
                .builder()

                .id(
                        distributorRequest.getId()
                )

                .fullName(
                        distributorRequest.getFullName()
                )

                .email(
                        distributorRequest.getEmail()
                )

                .phoneNumber(
                        distributorRequest.getPhoneNumber()
                )

                .targetLocation(
                        distributorRequest.getTargetLocation()
                )

                .investmentRange(
                        distributorRequest.getInvestmentRange()
                )

                .businessExperience(
                        distributorRequest.getBusinessExperience()
                )

                .createdAt(
                        distributorRequest.getCreatedAt()
                )

                .build();
    }


    // ==============================
    // CLEAN STRING
    // ==============================

    private String clean(
            String value
    ) {


        if (value == null) {

            return null;
        }


        String trimmed =
                value.trim();


        return trimmed.isEmpty()
                ? null
                : trimmed;
    }
}