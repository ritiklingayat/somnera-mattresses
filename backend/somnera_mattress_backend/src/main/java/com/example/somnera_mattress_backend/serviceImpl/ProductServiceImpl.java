package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.request.ProductRequest;
import com.example.somnera_mattress_backend.dto.response.ProductResponse;
import com.example.somnera_mattress_backend.entity.Category;
import com.example.somnera_mattress_backend.entity.Product;
import com.example.somnera_mattress_backend.entity.SubCategory;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.CategoryRepository;
import com.example.somnera_mattress_backend.repository.ProductRepository;
import com.example.somnera_mattress_backend.repository.SubCategoryRepository;
import com.example.somnera_mattress_backend.service.CloudinaryService;
import com.example.somnera_mattress_backend.service.ProductService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl
        implements ProductService {


    private final ProductRepository
            productRepository;


    private final CategoryRepository
            categoryRepository;


    private final SubCategoryRepository
            subCategoryRepository;


    private final CloudinaryService
            cloudinaryService;



    // ==============================
    // ADD PRODUCT
    // ==============================

    @Override
    @Transactional
    public ProductResponse addProduct(
            ProductRequest request,
            MultipartFile image
    ) {


        String productName =
                request
                        .getProductName()
                        .trim();


        if (
                productRepository
                        .existsByProductNameIgnoreCase(
                                productName
                        )
        ) {

            throw new BadRequestException(
                    "Product already exists"
            );
        }



        Category category =
                getCategory(
                        request.getCategoryId()
                );


        SubCategory subCategory =
                getSubCategory(
                        request.getSubCategoryId()
                );


        validateSubCategory(
                category,
                subCategory
        );



        Map<String, String> imageData =
                cloudinaryService
                        .uploadProductImage(
                                image
                        );



        Product product =
                Product.builder()

                        .productName(
                                productName
                        )

                        .productSection(
                                request.getProductSection()
                        )

                        .badge(
                                clean(
                                        request.getBadge()
                                )
                        )

                        .category(
                                category
                        )

                        .subCategory(
                                subCategory
                        )

                        .warranty(
                                clean(
                                        request.getWarranty()
                                )
                        )

                        .shortDescription(
                                clean(
                                        request
                                                .getShortDescription()
                                )
                        )

                        .imageUrl(
                                imageData.get(
                                        "url"
                                )
                        )

                        .imagePublicId(
                                imageData.get(
                                        "publicId"
                                )
                        )

                        .materials(
                                clean(
                                        request.getMaterials()
                                )
                        )

                        .shopByNeed(
                                cleanList(
                                        request.getShopByNeed()
                                )
                        )

                        .shopByUser(
                                cleanList(
                                        request.getShopByUser()
                                )
                        )

                        .shopByTech(
                                cleanList(
                                        request.getShopByTech()
                                )
                        )

                        .mattressFeel(
                                cleanList(
                                        request.getMattressFeel()
                                )
                        )

                        .firmness(
                                clean(
                                        request.getFirmness()
                                )
                        )

                        .price4Inch(
                                request.getPrice4Inch()
                        )

                        .price5Inch(
                                request.getPrice5Inch()
                        )

                        .price6Inch(
                                request.getPrice6Inch()
                        )

                        .price8Inch(
                                request.getPrice8Inch()
                        )

                        .build();



        Product savedProduct =
                productRepository.save(
                        product
                );


        return mapToResponse(
                savedProduct
        );
    }



    // ==============================
    // GET ALL PRODUCTS
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse>
    getAllProducts() {


        return productRepository
                .findAll()
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }



    // ==============================
    // GET PRODUCT BY ID
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(
            Long id
    ) {


        Product product =
                getProduct(
                        id
                );


        return mapToResponse(
                product
        );
    }



    // ==============================
    // UPDATE PRODUCT
    // ==============================

    @Override
    @Transactional
    public ProductResponse updateProduct(
            Long id,
            ProductRequest request,
            MultipartFile image
    ) {


        Product product =
                getProduct(
                        id
                );



        String productName =
                request
                        .getProductName()
                        .trim();



        productRepository
                .findByProductNameIgnoreCase(
                        productName
                )
                .ifPresent(

                        existingProduct -> {

                            if (
                                    !existingProduct
                                            .getId()
                                            .equals(
                                                    id
                                            )
                            ) {

                                throw new BadRequestException(
                                        "Product already exists"
                                );
                            }
                        }
                );



        Category category =
                getCategory(
                        request.getCategoryId()
                );


        SubCategory subCategory =
                getSubCategory(
                        request.getSubCategoryId()
                );


        validateSubCategory(
                category,
                subCategory
        );



        // ==============================
        // BASIC DETAILS
        // ==============================

        product.setProductName(
                productName
        );


        product.setProductSection(
                request.getProductSection()
        );


        product.setBadge(
                clean(
                        request.getBadge()
                )
        );


        product.setCategory(
                category
        );


        product.setSubCategory(
                subCategory
        );


        product.setWarranty(
                clean(
                        request.getWarranty()
                )
        );


        product.setShortDescription(
                clean(
                        request.getShortDescription()
                )
        );


        product.setMaterials(
                clean(
                        request.getMaterials()
                )
        );



        // ==============================
        // UPDATE LIST FIELDS
        // IMPORTANT:
        // Don't replace Hibernate collections
        // with immutable lists.
        // ==============================


        product
                .getShopByNeed()
                .clear();


        product
                .getShopByNeed()
                .addAll(
                        cleanList(
                                request.getShopByNeed()
                        )
                );



        product
                .getShopByUser()
                .clear();


        product
                .getShopByUser()
                .addAll(
                        cleanList(
                                request.getShopByUser()
                        )
                );



        product
                .getShopByTech()
                .clear();


        product
                .getShopByTech()
                .addAll(
                        cleanList(
                                request.getShopByTech()
                        )
                );



        product
                .getMattressFeel()
                .clear();


        product
                .getMattressFeel()
                .addAll(
                        cleanList(
                                request.getMattressFeel()
                        )
                );



        // ==============================
        // FIRMNESS
        // ==============================


        product.setFirmness(
                clean(
                        request.getFirmness()
                )
        );



        // ==============================
        // PRICES
        // ==============================


        product.setPrice4Inch(
                request.getPrice4Inch()
        );


        product.setPrice5Inch(
                request.getPrice5Inch()
        );


        product.setPrice6Inch(
                request.getPrice6Inch()
        );


        product.setPrice8Inch(
                request.getPrice8Inch()
        );



        // ==============================
        // IMAGE UPDATE
        // ==============================


        if (
                image != null
                        && !image.isEmpty()
        ) {


            Map<String, String> newImageData =
                    cloudinaryService
                            .uploadProductImage(
                                    image
                            );


            String oldPublicId =
                    product
                            .getImagePublicId();



            product.setImageUrl(
                    newImageData.get(
                            "url"
                    )
            );


            product.setImagePublicId(
                    newImageData.get(
                            "publicId"
                    )
            );



            if (
                    oldPublicId != null
                            && !oldPublicId.isBlank()
            ) {

                try {

                    cloudinaryService
                            .deleteImage(
                                    oldPublicId
                            );

                } catch (
                        RuntimeException ignored
                ) {

                }
            }
        }



        /*
         * IMPORTANT:
         *
         * product is already managed by Hibernate
         * because getProduct(id) was called inside
         * this @Transactional method.
         *
         * So we don't need:
         *
         * productRepository.save(product);
         *
         * Hibernate dirty checking automatically
         * updates the database.
         */


        return mapToResponse(
                product
        );
    }



    // ==============================
    // DELETE PRODUCT
    // ==============================

    @Override
    @Transactional
    public void deleteProduct(
            Long id
    ) {


        Product product =
                getProduct(
                        id
                );


        String imagePublicId =
                product
                        .getImagePublicId();



        productRepository.delete(
                product
        );



        if (
                imagePublicId != null
                        && !imagePublicId.isBlank()
        ) {

            try {

                cloudinaryService
                        .deleteImage(
                                imagePublicId
                        );

            } catch (
                    RuntimeException ignored
            ) {

            }
        }
    }



    // ==============================
    // GET PRODUCT
    // ==============================

    private Product getProduct(
            Long id
    ) {


        return productRepository
                .findById(
                        id
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                );
    }



    // ==============================
    // GET CATEGORY
    // ==============================

    private Category getCategory(
            Long categoryId
    ) {


        return categoryRepository
                .findById(
                        categoryId
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                );
    }



    // ==============================
    // GET SUB CATEGORY
    // ==============================

    private SubCategory getSubCategory(
            Long subCategoryId
    ) {


        return subCategoryRepository
                .findById(
                        subCategoryId
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "Sub category not found"
                                )
                );
    }



    // ==============================
    // VALIDATE CATEGORY
    // ==============================

    private void validateSubCategory(
            Category category,
            SubCategory subCategory
    ) {


        if (
                !subCategory
                        .getCategory()
                        .getId()
                        .equals(
                                category.getId()
                        )
        ) {


            throw new BadRequestException(
                    "Selected sub category does not belong to selected category"
            );
        }
    }



    // ==============================
    // CLEAN STRING
    // ==============================

    private String clean(
            String value
    ) {


        if (
                value == null
        ) {

            return null;
        }


        String trimmed =
                value.trim();


        return trimmed.isEmpty()
                ? null
                : trimmed;
    }



    // ==============================
    // CLEAN LIST
    // ==============================

    private List<String> cleanList(
            List<String> values
    ) {


        if (
                values == null
        ) {

            return new ArrayList<>();
        }


        List<String> cleanedValues =
                new ArrayList<>();


        for (
                String value :
                values
        ) {


            if (
                    value == null
            ) {

                continue;
            }


            String cleanedValue =
                    value.trim();


            if (
                    cleanedValue.isEmpty()
            ) {

                continue;
            }


            if (
                    !cleanedValues.contains(
                            cleanedValue
                    )
            ) {

                cleanedValues.add(
                        cleanedValue
                );
            }
        }


        return cleanedValues;
    }



    // ==============================
    // ENTITY TO RESPONSE
    // ==============================

    private ProductResponse mapToResponse(
            Product product
    ) {


        return ProductResponse
                .builder()

                .id(
                        product.getId()
                )

                .productName(
                        product.getProductName()
                )

                .productSection(
                        product.getProductSection()
                )

                .badge(
                        product.getBadge()
                )

                .categoryId(
                        product
                                .getCategory()
                                .getId()
                )

                .categoryName(
                        product
                                .getCategory()
                                .getCategoryName()
                )

                .subCategoryId(
                        product
                                .getSubCategory()
                                .getId()
                )

                .subCategoryName(
                        product
                                .getSubCategory()
                                .getSubCategoryName()
                )

                .warranty(
                        product.getWarranty()
                )

                .shortDescription(
                        product
                                .getShortDescription()
                )

                .imageUrl(
                        product.getImageUrl()
                )

                .materials(
                        product.getMaterials()
                )

                .shopByNeed(
                        new ArrayList<>(
                                product.getShopByNeed()
                        )
                )

                .shopByUser(
                        new ArrayList<>(
                                product.getShopByUser()
                        )
                )

                .shopByTech(
                        new ArrayList<>(
                                product.getShopByTech()
                        )
                )

                .mattressFeel(
                        new ArrayList<>(
                                product.getMattressFeel()
                        )
                )

                .firmness(
                        product.getFirmness()
                )

                .price4Inch(
                        product.getPrice4Inch()
                )

                .price5Inch(
                        product.getPrice5Inch()
                )

                .price6Inch(
                        product.getPrice6Inch()
                )

                .price8Inch(
                        product.getPrice8Inch()
                )

                .build();
    }
}