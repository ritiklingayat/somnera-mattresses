package com.example.somnera_mattress_backend.dto.response;

import com.example.somnera_mattress_backend.entity.Role;
import com.example.somnera_mattress_backend.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String mobile;

    private Role role;

    private Status status;

    private boolean emailVerified;
}
