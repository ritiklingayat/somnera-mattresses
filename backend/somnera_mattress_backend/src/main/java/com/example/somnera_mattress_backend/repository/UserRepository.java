package com.example.somnera_mattress_backend.repository;

import com.example.somnera_mattress_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.somnera_mattress_backend.entity.Role;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByMobile(String mobile);

    Optional<User> findByEmail(
            String email
    );

    List<User> findAllByRoleOrderByIdDesc(
            Role role
    );
}
