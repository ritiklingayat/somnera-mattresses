package com.example.somnera_mattress_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(
            min = 2,
            max = 120,
            message = "Category name must contain 2 to 120 characters"
    )
    private String categoryName;

    private List<String> subCategories;
}