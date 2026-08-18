package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.request.ProductRequest;
import com.example.somnera_mattress_backend.dto.response.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    ProductResponse addProduct(
            ProductRequest request,
            MultipartFile image
    );

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(
            Long id
    );

    ProductResponse updateProduct(
            Long id,
            ProductRequest request,
            MultipartFile image
    );

    void deleteProduct(
            Long id
    );
}