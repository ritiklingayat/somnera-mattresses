package com.example.somnera_mattress_backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String password = "Someraadmin@123";

        String encodedPassword =
                encoder.encode(password);

        System.out.println("increapted password =============" +encodedPassword);
    }
}