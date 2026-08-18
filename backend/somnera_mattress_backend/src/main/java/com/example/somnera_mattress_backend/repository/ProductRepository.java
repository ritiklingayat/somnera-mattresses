package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.Category;
import com.example.somnera_mattress_backend.entity.Product;
import com.example.somnera_mattress_backend.entity.ProductSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    boolean existsByProductNameIgnoreCase(
            String productName
    );

    Optional<Product>
    findByProductNameIgnoreCase(
            String productName
    );

    List<Product> findByCategory(
            Category category
    );

    List<Product> findByProductSection(
            ProductSection productSection
    );



    boolean existsByCategoryId(
            Long categoryId
    );

    boolean existsBySubCategoryId(
            Long subCategoryId
    );
}