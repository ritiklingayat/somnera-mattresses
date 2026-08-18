package com.example.somnera_mattress_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistResponse {


    // ==============================
    // ITEMS
    // ==============================

    @Builder.Default
    private List<WishlistItemResponse> items =
            new ArrayList<>();


    // ==============================
    // COUNT
    // ==============================

    private Integer totalItems;
}