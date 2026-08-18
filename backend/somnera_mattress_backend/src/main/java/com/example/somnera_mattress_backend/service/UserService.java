package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.response.UserResponse;

public interface UserService {

    UserResponse getCurrentUser(
            String email
    );
}
