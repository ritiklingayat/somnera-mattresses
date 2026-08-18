package com.example.somnera_mattress_backend.serviceImpl;

import com.example.somnera_mattress_backend.dto.request.AddToCartRequest;
import com.example.somnera_mattress_backend.dto.request.UpdateCartItemRequest;
import com.example.somnera_mattress_backend.dto.response.CartItemResponse;
import com.example.somnera_mattress_backend.dto.response.CartResponse;
import com.example.somnera_mattress_backend.entity.Cart;
import com.example.somnera_mattress_backend.entity.CartItem;
import com.example.somnera_mattress_backend.entity.Product;
import com.example.somnera_mattress_backend.entity.User;
import com.example.somnera_mattress_backend.exception.BadRequestException;
import com.example.somnera_mattress_backend.exception.ResourceNotFoundException;
import com.example.somnera_mattress_backend.repository.CartItemRepository;
import com.example.somnera_mattress_backend.repository.CartRepository;
import com.example.somnera_mattress_backend.repository.ProductRepository;
import com.example.somnera_mattress_backend.repository.UserRepository;
import com.example.somnera_mattress_backend.service.CartService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CartServiceImpl
        implements CartService {


    private static final int MAX_QUANTITY = 10;


    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;


    // ==============================
    // ADD TO CART
    // ==============================

    @Override
    @Transactional
    public CartResponse addToCart(
            AddToCartRequest request,
            String userEmail
    ) {

        User user =
                getUserByEmail(
                        userEmail
                );


        Product product =
                getProduct(
                        request.getProductId()
                );


        validateThickness(
                request.getThickness()
        );


        /*
         * Also verifies that the selected
         * thickness actually has a price.
         */
        getPriceByThickness(
                product,
                request.getThickness()
        );


        Cart cart =
                getOrCreateCart(
                        user
                );


        CartItem existingItem =
                cartItemRepository
                        .findByCartIdAndProductIdAndThickness(
                                cart.getId(),
                                product.getId(),
                                request.getThickness()
                        )
                        .orElse(null);


        if (existingItem != null) {

            int newQuantity =
                    existingItem.getQuantity()
                            + request.getQuantity();


            if (newQuantity > MAX_QUANTITY) {

                throw new BadRequestException(
                        "Maximum quantity allowed for this cart item is "
                                + MAX_QUANTITY
                );
            }


            existingItem.setQuantity(
                    newQuantity
            );


            /*
             * existingItem is managed inside this
             * transaction, so Hibernate dirty checking
             * will update it automatically.
             */

        } else {

            CartItem cartItem =
                    CartItem.builder()

                            .cart(
                                    cart
                            )

                            .product(
                                    product
                            )

                            .thickness(
                                    request.getThickness()
                            )

                            .quantity(
                                    request.getQuantity()
                            )

                            .build();


            cartItemRepository.save(
                    cartItem
            );


            /*
             * Keep the in-memory Cart object synchronized
             * so mapToCartResponse() can immediately
             * include the newly added item.
             */
            cart.getItems().add(
                    cartItem
            );
        }


        return mapToCartResponse(
                cart
        );
    }


    // ==============================
    // GET CART
    // ==============================

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(
            String userEmail
    ) {

        User user =
                getUserByEmail(
                        userEmail
                );


        Cart cart =
                cartRepository
                        .findByUserId(
                                user.getId()
                        )
                        .orElse(null);


        /*
         * A new user may not have a cart yet.
         * Return an empty cart response instead
         * of throwing an error.
         */
        if (cart == null) {

            return emptyCartResponse();
        }


        return mapToCartResponse(
                cart
        );
    }


    // ==============================
    // UPDATE CART ITEM QUANTITY
    // ==============================

    @Override
    @Transactional
    public CartResponse updateCartItem(
            Long itemId,
            UpdateCartItemRequest request,
            String userEmail
    ) {

        User user =
                getUserByEmail(
                        userEmail
                );


        Cart cart =
                getExistingCart(
                        user
                );


        CartItem cartItem =
                getCartItem(
                        itemId,
                        cart.getId()
                );


        cartItem.setQuantity(
                request.getQuantity()
        );


        /*
         * No save() required.
         * cartItem is already managed by Hibernate
         * inside this transaction.
         */


        return mapToCartResponse(
                cart
        );
    }


    // ==============================
    // REMOVE ONE CART ITEM
    // ==============================

    @Override
    @Transactional
    public CartResponse removeCartItem(
            Long itemId,
            String userEmail
    ) {

        User user =
                getUserByEmail(
                        userEmail
                );


        Cart cart =
                getExistingCart(
                        user
                );


        CartItem cartItem =
                getCartItem(
                        itemId,
                        cart.getId()
                );


        /*
         * Cart.java has:
         *
         * orphanRemoval = true
         *
         * so removing the item from the collection
         * will also delete the corresponding row
         * from cart_items.
         */
        cart.getItems().remove(
                cartItem
        );


        return mapToCartResponse(
                cart
        );
    }


    // ==============================
    // CLEAR COMPLETE CART
    // ==============================

    @Override
    @Transactional
    public CartResponse clearCart(
            String userEmail
    ) {

        User user =
                getUserByEmail(
                        userEmail
                );


        Cart cart =
                cartRepository
                        .findByUserId(
                                user.getId()
                        )
                        .orElse(null);


        /*
         * If the user has never added anything,
         * clearing the cart can safely return
         * an empty response.
         */
        if (cart == null) {

            return emptyCartResponse();
        }


        /*
         * Because Cart.items uses:
         *
         * orphanRemoval = true
         *
         * Hibernate deletes the CartItem rows.
         * The Cart itself remains in the database.
         */
        cart.getItems().clear();


        return mapToCartResponse(
                cart
        );
    }


    // ==============================
    // GET USER BY EMAIL
    // ==============================

    private User getUserByEmail(
            String email
    ) {

        if (
                email == null
                        || email.isBlank()
        ) {

            throw new BadRequestException(
                    "Authenticated user email is required"
            );
        }


        return userRepository
                .findByEmail(
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
    // GET OR CREATE CART
    // ==============================

    private Cart getOrCreateCart(
            User user
    ) {

        return cartRepository
                .findByUserId(
                        user.getId()
                )
                .orElseGet(
                        () -> {

                            Cart cart =
                                    Cart.builder()

                                            .user(
                                                    user
                                            )

                                            .items(
                                                    new ArrayList<>()
                                            )

                                            .build();


                            return cartRepository.save(
                                    cart
                            );
                        }
                );
    }


    // ==============================
    // GET EXISTING CART
    // ==============================

    private Cart getExistingCart(
            User user
    ) {

        return cartRepository
                .findByUserId(
                        user.getId()
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "Cart not found"
                                )
                );
    }


    // ==============================
    // GET CART ITEM
    // ==============================

    private CartItem getCartItem(
            Long itemId,
            Long cartId
    ) {

        return cartItemRepository
                .findByIdAndCartId(
                        itemId,
                        cartId
                )
                .orElseThrow(

                        () ->
                                new ResourceNotFoundException(
                                        "Cart item not found"
                                )
                );
    }


    // ==============================
    // VALIDATE THICKNESS
    // ==============================

    private void validateThickness(
            Integer thickness
    ) {

        if (thickness == null) {

            throw new BadRequestException(
                    "Thickness is required"
            );
        }


        if (
                thickness != 4
                        && thickness != 5
                        && thickness != 6
                        && thickness != 8
        ) {

            throw new BadRequestException(
                    "Invalid mattress thickness. Allowed values are 4, 5, 6 and 8 inches"
            );
        }
    }


    // ==============================
    // GET PRICE BY THICKNESS
    // ==============================

    private BigDecimal getPriceByThickness(
            Product product,
            Integer thickness
    ) {

        validateThickness(
                thickness
        );


        BigDecimal price;


        switch (thickness) {

            case 4 ->

                    price =
                            product.getPrice4Inch();


            case 5 ->

                    price =
                            product.getPrice5Inch();


            case 6 ->

                    price =
                            product.getPrice6Inch();


            case 8 ->

                    price =
                            product.getPrice8Inch();


            default ->

                    throw new BadRequestException(
                            "Invalid mattress thickness"
                    );
        }


        if (price == null) {

            throw new BadRequestException(
                    thickness
                            + " inch thickness is not available for this product"
            );
        }


        if (
                price.compareTo(
                        BigDecimal.ZERO
                ) <= 0
        ) {

            throw new BadRequestException(
                    "Invalid price configured for "
                            + thickness
                            + " inch thickness"
            );
        }


        return price;
    }


    // ==============================
    // MAP CART ITEM RESPONSE
    // ==============================

    private CartItemResponse mapToCartItemResponse(
            CartItem cartItem
    ) {

        Product product =
                cartItem.getProduct();


        BigDecimal unitPrice =
                getPriceByThickness(
                        product,
                        cartItem.getThickness()
                );


        BigDecimal itemTotal =
                unitPrice.multiply(
                        BigDecimal.valueOf(
                                cartItem.getQuantity()
                        )
                );


        return CartItemResponse
                .builder()

                .id(
                        cartItem.getId()
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

                .thickness(
                        cartItem.getThickness()
                )

                .unitPrice(
                        unitPrice
                )

                .quantity(
                        cartItem.getQuantity()
                )

                .itemTotal(
                        itemTotal
                )

                .build();
    }


    // ==============================
    // MAP CART RESPONSE
    // ==============================

    private CartResponse mapToCartResponse(
            Cart cart
    ) {

        List<CartItemResponse> itemResponses =
                new ArrayList<>();


        int totalItems = 0;


        BigDecimal cartTotal =
                BigDecimal.ZERO;


        for (
                CartItem cartItem :
                cart.getItems()
        ) {

            CartItemResponse itemResponse =
                    mapToCartItemResponse(
                            cartItem
                    );


            itemResponses.add(
                    itemResponse
            );


            totalItems +=
                    cartItem.getQuantity();


            cartTotal =
                    cartTotal.add(
                            itemResponse.getItemTotal()
                    );
        }


        return CartResponse
                .builder()

                .cartId(
                        cart.getId()
                )

                .items(
                        itemResponses
                )

                .totalItems(
                        totalItems
                )

                .cartTotal(
                        cartTotal
                )

                .build();
    }


    // ==============================
    // EMPTY CART RESPONSE
    // ==============================

    private CartResponse emptyCartResponse() {

        return CartResponse
                .builder()

                .cartId(
                        null
                )

                .items(
                        new ArrayList<>()
                )

                .totalItems(
                        0
                )

                .cartTotal(
                        BigDecimal.ZERO
                )

                .build();
    }
}