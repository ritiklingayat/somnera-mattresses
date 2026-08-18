package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.response.WishlistItemResponse;
import com.example.somnera_mattress_backend.dto.response.WishlistResponse;
import com.example.somnera_mattress_backend.entity.Product;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.entity.Wishlist;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.ProductRepository;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.repository.WishlistRepository;
import com.example.somnera_mattress_backend.service.WishlistService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class WishlistServiceImpl
        implements WishlistService {


    private final WishlistRepository wishlistRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;


    // ==============================
    // GET MY WISHLIST
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getMyWishlist(
            String email
    ) {

        User user =
                getUserByEmail(
                        email
                );


        List<Wishlist> wishlistItems =
                wishlistRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );


        return mapToWishlistResponse(
                wishlistItems
        );
    }


    // ==============================
    // ADD TO WISHLIST
    // ==============================

    @Override
    @Transactional
    public WishlistResponse addToWishlist(
            String email,
            Long productId
    ) {

        User user =
                getUserByEmail(
                        email
                );


        Product product =
                getProduct(
                        productId
                );


        boolean alreadyExists =
                wishlistRepository
                        .existsByUserIdAndProductId(
                                user.getId(),
                                product.getId()
                        );


        if (alreadyExists) {

            throw new BadRequestException(
                    "Product is already in wishlist"
            );
        }


        Wishlist wishlist =
                Wishlist.builder()

                        .user(
                                user
                        )

                        .product(
                                product
                        )

                        .build();


        wishlistRepository.save(
                wishlist
        );


        List<Wishlist> updatedWishlist =
                wishlistRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );


        return mapToWishlistResponse(
                updatedWishlist
        );
    }


    // ==============================
    // REMOVE FROM WISHLIST
    // ==============================

    @Override
    @Transactional
    public WishlistResponse removeFromWishlist(
            String email,
            Long productId
    ) {

        User user =
                getUserByEmail(
                        email
                );


        Wishlist wishlist =
                wishlistRepository
                        .findByUserIdAndProductId(
                                user.getId(),
                                productId
                        )
                        .orElseThrow(

                                () ->
                                        new ResourceNotFoundException(
                                                "Product not found in wishlist"
                                        )
                        );


        wishlistRepository.delete(
                wishlist
        );


        List<Wishlist> updatedWishlist =
                wishlistRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );


        return mapToWishlistResponse(
                updatedWishlist
        );
    }


    // ==============================
    // CHECK PRODUCT IN WISHLIST
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public boolean isProductInWishlist(
            String email,
            Long productId
    ) {

        User user =
                getUserByEmail(
                        email
                );


        /*
         * Also validate that the product exists.
         */
        getProduct(
                productId
        );


        return wishlistRepository
                .existsByUserIdAndProductId(
                        user.getId(),
                        productId
                );
    }


    // ==============================
    // GET USER
    // ==============================

    private User getUserByEmail(
            String email
    ) {

        if (
                email == null
                        || email.isBlank()
        ) {

            throw new BadRequestException(
                    "Authenticated user is required"
            );
        }


        return userRepository
                .findByEmailIgnoreCase(
                        email
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "User not found"
                                )
                );
    }


    // ==============================
    // GET PRODUCT
    // ==============================

    private Product getProduct(
            Long productId
    ) {

        if (productId == null) {

            throw new BadRequestException(
                    "Product ID is required"
            );
        }


        return productRepository
                .findById(
                        productId
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                );
    }


    // ==============================
    // MAP WISHLIST RESPONSE
    // ==============================

    private WishlistResponse mapToWishlistResponse(
            List<Wishlist> wishlistItems
    ) {

        List<WishlistItemResponse> items =
                new ArrayList<>();


        for (
                Wishlist wishlist :
                wishlistItems
        ) {

            items.add(
                    mapToWishlistItemResponse(
                            wishlist
                    )
            );
        }


        return WishlistResponse
                .builder()

                .items(
                        items
                )

                .totalItems(
                        items.size()
                )

                .build();
    }


    // ==============================
    // MAP WISHLIST ITEM RESPONSE
    // ==============================

    private WishlistItemResponse mapToWishlistItemResponse(
            Wishlist wishlist
    ) {

        Product product =
                wishlist.getProduct();


        return WishlistItemResponse
                .builder()

                .wishlistId(
                        wishlist.getId()
                )

                .productId(
                        product.getId()
                )

                .productName(
                        product.getProductName()
                )

                .imageUrl(
                        product.getImageUrl()
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

                .badge(
                        product.getBadge()
                )

                .warranty(
                        product.getWarranty()
                )

                .firmness(
                        product.getFirmness()
                )

                .shortDescription(
                        product.getShortDescription()
                )

                .materials(
                        product.getMaterials()
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

                .addedAt(
                        wishlist.getCreatedAt()
                )

                .build();
    }
}