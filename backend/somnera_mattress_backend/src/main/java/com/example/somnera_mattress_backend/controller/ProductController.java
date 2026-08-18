package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.request.ProductRequest;
import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.ProductResponse;
import com.example.somnera_mattress_backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService
            productService;


    @PostMapping(
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<
            ApiResponse<ProductResponse>
            >
    addProduct(

            @Valid
            @RequestPart("product")
            ProductRequest request,

            @RequestPart("image")
            MultipartFile image
    ) {

        ProductResponse response =
                productService
                        .addProduct(
                                request,
                                image
                        );

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(
                        ApiResponse.success(
                                "Product added successfully",
                                response
                        )
                );
    }


    @GetMapping
    public ResponseEntity<
            ApiResponse<List<ProductResponse>>
            >
    getAllProducts() {

        List<ProductResponse> response =
                productService
                        .getAllProducts();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Products fetched successfully",
                        response
                )
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<ProductResponse>
            >
    getProductById(
            @PathVariable
            Long id
    ) {

        ProductResponse response =
                productService
                        .getProductById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product fetched successfully",
                        response
                )
        );
    }


    @PutMapping(
            value = "/{id}",
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<
            ApiResponse<ProductResponse>
            >
    updateProduct(

            @PathVariable
            Long id,

            @Valid
            @RequestPart("product")
            ProductRequest request,

            @RequestPart(
                    value = "image",
                    required = false
            )
            MultipartFile image
    ) {

        ProductResponse response =
                productService
                        .updateProduct(
                                id,
                                request,
                                image
                        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product updated successfully",
                        response
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            >
    deleteProduct(
            @PathVariable
            Long id
    ) {

        productService
                .deleteProduct(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Product deleted successfully"
                )
        );
    }
}