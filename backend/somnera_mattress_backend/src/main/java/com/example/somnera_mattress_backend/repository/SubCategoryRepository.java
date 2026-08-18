package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.Category;
import com.example.somnera_mattress_backend.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryRepository
        extends JpaRepository<SubCategory, Long> {

    List<SubCategory> findByCategory(
            Category category
    );

    boolean existsBySubCategoryNameIgnoreCaseAndCategory(
            String subCategoryName,
            Category category
    );
}