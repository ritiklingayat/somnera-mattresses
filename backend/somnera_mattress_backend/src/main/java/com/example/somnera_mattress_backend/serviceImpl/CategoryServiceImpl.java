package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.request.CategoryRequest;
import com.example.somnera_mattress_backend.dto.response.CategoryResponse;
import com.example.somnera_mattress_backend.dto.response.SubCategoryResponse;
import com.example.somnera_mattress_backend.entity.Category;
import com.example.somnera_mattress_backend.entity.SubCategory;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.CategoryRepository;
import com.example.somnera_mattress_backend.repository.ProductRepository;
import com.example.somnera_mattress_backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl
        implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CategoryResponse addCategory(CategoryRequest request) {

        String categoryName = request.getCategoryName().trim();

        if (categoryRepository.existsByCategoryNameIgnoreCase(categoryName)
        ) {
            throw new BadRequestException(
                    "Category already exists"
            );
        }

        Category category =
                Category.builder()
                        .categoryName(categoryName)
                        .build();

        List<SubCategory> subCategoryList =
                new ArrayList<>();

        if (request.getSubCategories() != null) {

            for (
                    String subCategoryName :
                    request.getSubCategories()
            ) {

                if (
                        subCategoryName == null
                                || subCategoryName.trim().isEmpty()
                ) {
                    continue;
                }

                SubCategory subCategory =
                        SubCategory.builder()
                                .subCategoryName(
                                        subCategoryName.trim()
                                )
                                .category(category)
                                .build();

                subCategoryList.add(subCategory);
            }
        }

        category.setSubCategories(
                subCategoryList
        );

        Category savedCategory =
                categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse>
    getAllCategories() {

        return categoryRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(
            Long id
    ) {

        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Category not found"
                                        )
                        );

        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(
            Long id,
            CategoryRequest request
    ) {

        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Category not found"
                                        )
                        );

        String categoryName =
                request.getCategoryName().trim();

        categoryRepository
                .findByCategoryNameIgnoreCase(
                        categoryName
                )
                .ifPresent(
                        existingCategory -> {

                            if (
                                    !existingCategory
                                            .getId()
                                            .equals(id)
                            ) {
                                throw new BadRequestException(
                                        "Category already exists"
                                );
                            }
                        }
                );

        category.setCategoryName(
                categoryName
        );

        /*
         * Since your frontend sends the complete
         * subcategory list during edit,
         * we replace the previous collection.
         */

        category
                .getSubCategories()
                .clear();

        if (
                request.getSubCategories()
                        != null
        ) {

            for (
                    String subCategoryName :
                    request.getSubCategories()
            ) {

                if (
                        subCategoryName == null
                                || subCategoryName.trim().isEmpty()
                ) {
                    continue;
                }

                SubCategory subCategory =
                        SubCategory.builder()
                                .subCategoryName(
                                        subCategoryName.trim()
                                )
                                .category(category)
                                .build();

                category
                        .getSubCategories()
                        .add(subCategory);
            }
        }

        Category updatedCategory =
                categoryRepository.save(category);

        return mapToResponse(
                updatedCategory
        );
    }

    @Override
    @Transactional
    public void deleteCategory(
            Long id
    ) {

        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Category not found"
                                        )
                        );


        if (
                productRepository
                        .existsByCategoryId(id)
        ) {

            throw new BadRequestException(
                    "Cannot delete category because products are using it"
            );
        }


        categoryRepository.delete(
                category
        );
    }

    private CategoryResponse mapToResponse(
            Category category
    ) {

        List<SubCategoryResponse>
                subCategoryResponses =
                category
                        .getSubCategories()
                        .stream()
                        .map(
                                subCategory ->
                                        SubCategoryResponse
                                                .builder()
                                                .id(
                                                        subCategory
                                                                .getId()
                                                )
                                                .subCategoryName(
                                                        subCategory
                                                                .getSubCategoryName()
                                                )
                                                .build()
                        )
                        .toList();

        return CategoryResponse
                .builder()
                .id(category.getId())
                .categoryName(
                        category.getCategoryName()
                )
                .subCategories(
                        subCategoryResponses
                )
                .build();
    }
}