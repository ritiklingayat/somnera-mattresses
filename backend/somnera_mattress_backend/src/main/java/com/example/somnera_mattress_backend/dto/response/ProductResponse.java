package com.example.somnera_mattress_backend.dto.response;

import com.example.somnera_mattress_backend.entity.ProductSection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;

    private String productName;

    private ProductSection productSection;

    private String badge;

    private Long categoryId;

    private String categoryName;

    private Long subCategoryId;

    private String subCategoryName;

    private String warranty;

    private String shortDescription;

    private String imageUrl;

    private String materials;

    private List<String> shopByNeed;

    private List<String> shopByUser;

    private List<String> shopByTech;

    private List<String> mattressFeel;

    private String firmness;

    private BigDecimal price4Inch;

    private BigDecimal price5Inch;

    private BigDecimal price6Inch;

    private BigDecimal price8Inch;

}