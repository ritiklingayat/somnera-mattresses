package com.example.somnera_mattress_backend.dto.request;

import com.example.somnera_mattress_backend.entity.ProductSection;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(
            message = "Product name is required"
    )
    @Size(
            max = 180,
            message = "Product name must not exceed 180 characters"
    )
    private String productName;


    @NotNull(
            message = "Product section is required"
    )
    private ProductSection productSection;


    private String badge;


    @NotNull(
            message = "Category is required"
    )
    private Long categoryId;


    @NotNull(
            message = "Sub category is required"
    )
    private Long subCategoryId;


    private String warranty;


    private String shortDescription;


    private String materials;


    private List<String> shopByNeed;


    private List<String> shopByUser;


    private List<String> shopByTech;


    private List<String> mattressFeel;


    private String firmness;


    @DecimalMin(
            value = "0.0",
            message = "4 inch price cannot be negative"
    )
    private BigDecimal price4Inch;


    @DecimalMin(
            value = "0.0",
            message = "5 inch price cannot be negative"
    )
    private BigDecimal price5Inch;


    @DecimalMin(
            value = "0.0",
            message = "6 inch price cannot be negative"
    )
    private BigDecimal price6Inch;


    @DecimalMin(
            value = "0.0",
            message = "8 inch price cannot be negative"
    )
    private BigDecimal price8Inch;


}