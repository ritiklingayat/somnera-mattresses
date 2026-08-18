package com.example.somnera_mattress_backend.security;

import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(
            String email
    ) throws UsernameNotFoundException {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new UsernameNotFoundException(
                                "Account not found"
                        )
                );

        return org.springframework.security.core.userdetails
                .User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(
                        !user.isEmailVerified()
                                || user.getStatus()
                                != com.example.somnera_mattress_backend.entity.Status.ACTIVE
                )
                .build();
    }
}
