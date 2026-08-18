package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByMobile(String mobile);
    Optional<User> findByEmail(
            String email
    );
}
