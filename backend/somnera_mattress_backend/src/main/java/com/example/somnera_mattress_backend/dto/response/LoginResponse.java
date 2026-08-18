package com.example.somnera_mattress_backend.dto.response;

import com.example.somnera_mattress_backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private String tokenType;

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private Role role;
}
