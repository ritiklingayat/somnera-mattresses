package com.example.somnera_mattress_backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {

    Map<String, String> uploadProductImage(
            MultipartFile file
    );

    void deleteImage(
            String publicId
    );
}