package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.response.UserResponse;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl
        implements UserService {

    private final UserRepository
            userRepository;

    @Override
    public UserResponse getCurrentUser(
            String email
    ) {
        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User account not found"
                                )
                        );

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
