package com.example.somnera_mattress_backend.service;

import com.example.somnera_mattress_backend.dto.request.CategoryRequest;
import com.example.somnera_mattress_backend.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse addCategory(
            CategoryRequest request
    );

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(
            Long id
    );

    CategoryResponse updateCategory(
            Long id,
            CategoryRequest request
    );

    void deleteCategory(
            Long id
    );
}