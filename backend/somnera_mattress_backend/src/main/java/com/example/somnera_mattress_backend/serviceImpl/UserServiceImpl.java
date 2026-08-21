package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.response.UserResponse;
import com.example.somnera_mattress_backend.entity.Role;
import com.example.somnera_mattress_backend.entity.Status;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UserServiceImpl
        implements UserService {


    private final UserRepository
            userRepository;


    /*
    ==============================================
    ADMIN - UPDATE CUSTOMER STATUS
    ==============================================
    */

    @Override
    @Transactional
    public UserResponse updateUserStatus(
            Long userId,
            Status status
    ) {


        User user =
                userRepository
                        .findById(
                                userId
                        )
                        .orElseThrow(

                                () ->
                                        new ResourceNotFoundException(
                                                "User not found"
                                        )
                        );


        /*
         * Customer management must never
         * modify an ADMIN account.
         */

        if (
                user.getRole()
                        == Role.ADMIN
        ) {

            throw new BadRequestException(
                    "Admin status cannot be changed"
            );
        }


        user.setStatus(
                status
        );


        User savedUser =
                userRepository
                        .save(
                                user
                        );


        return mapToResponse(
                savedUser
        );
    }


    /*
    ==============================================
    CURRENT LOGGED-IN USER
    ==============================================
    */

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(
            String email
    ) {


        User user =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .orElseThrow(

                                () ->
                                        new ResourceNotFoundException(
                                                "User account not found"
                                        )
                        );


        return mapToResponse(
                user
        );
    }


    /*
    ==============================================
    ADMIN - GET ALL CUSTOMERS
    ==============================================
    */

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse>
    getAllCustomers() {


        return userRepository
                .findAllByRoleOrderByIdDesc(
                        Role.USER
                )
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }


    /*
    ==============================================
    MAP USER -> USER RESPONSE
    ==============================================
    */

    private UserResponse mapToResponse(
            User user
    ) {


        return UserResponse
                .builder()

                .id(
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

                .mobile(
                        user.getMobile()
                )

                .role(
                        user.getRole()
                )

                .status(
                        user.getStatus()
                )

                .emailVerified(
                        user.isEmailVerified()
                )

                .build();
    }
}