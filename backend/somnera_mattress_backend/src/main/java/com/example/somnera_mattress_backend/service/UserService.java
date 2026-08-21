package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.response.UserResponse;
import com.example.somnera_mattress_backend.entity.Status;

import java.util.List;


public interface UserService {


    UserResponse getCurrentUser(
            String email
    );


    List<UserResponse>
    getAllCustomers();


    UserResponse updateUserStatus(
            Long userId,
            Status status
    );
}