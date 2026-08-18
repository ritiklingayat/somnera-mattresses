package com.example.somnera_mattress_backend.util;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

@Component
public class TokenGenerator {

    private final SecureRandom secureRandom =
            new SecureRandom();

    public String generateToken() {

        byte[] tokenBytes = new byte[32];

        secureRandom.nextBytes(tokenBytes);

        return HexFormat
                .of()
                .formatHex(tokenBytes);
    }

    public String hashToken(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hashedBytes =
                    digest.digest(
                            token.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat
                    .of()
                    .formatHex(hashedBytes);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "Unable to hash reset token",
                    exception
            );
        }
    }
}
