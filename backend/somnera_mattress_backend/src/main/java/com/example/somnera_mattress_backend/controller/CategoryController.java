package com.example.somnera_mattress_backend.controller;

import com.example.somnera_mattress_backend.dto.request.CategoryRequest;
import com.example.somnera_mattress_backend.dto.response.ApiResponse;
import com.example.somnera_mattress_backend.dto.response.CategoryResponse;
import com.example.somnera_mattress_backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<
            ApiResponse<CategoryResponse>
            >
    addCategory(
            @Valid
            @RequestBody
            CategoryRequest request
    ) {

        CategoryResponse response =
                categoryService.addCategory(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Category added successfully",
                                response
                        )
                );
    }

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<CategoryResponse>>
            >
    getAllCategories() {

        List<CategoryResponse> response =
                categoryService
                        .getAllCategories();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Categories fetched successfully",
                        response
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<CategoryResponse>
            >
    getCategoryById(
            @PathVariable
            Long id
    ) {

        CategoryResponse response =
                categoryService
                        .getCategoryById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Category fetched successfully",
                        response
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<CategoryResponse>
            >
    updateCategory(
            @PathVariable
            Long id,

            @Valid
            @RequestBody
            CategoryRequest request
    ) {

        CategoryResponse response =
                categoryService
                        .updateCategory(
                                id,
                                request
                        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Category updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<
            ApiResponse<Void>
            >
    deleteCategory(
            @PathVariable
            Long id
    ) {

        categoryService
                .deleteCategory(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Category deleted successfully"
                )
        );
    }
}