package com.example.somnera_mattress_backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {


    // ==============================
    // PRODUCT
    // ==============================

    @NotNull(
            message = "Product ID is required"
    )
    private Long productId;


    // ==============================
    // MATTRESS THICKNESS
    // ==============================

    @NotNull(
            message = "Thickness is required"
    )
    private Integer thickness;


    // ==============================
    // QUANTITY
    // ==============================

    @NotNull(
            message = "Quantity is required"
    )
    @Min(
            value = 1,
            message = "Quantity must be at least 1"
    )
    @Max(
            value = 10,
            message = "Quantity cannot be greater than 10"
    )
    private Integer quantity;
}