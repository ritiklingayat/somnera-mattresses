package com.example.somnera_mattress_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_users_email",
                        columnNames = "email"
                ),
                @UniqueConstraint(
                        name = "uk_users_mobile",
                        columnNames = "mobile"
                )
        }
)
public class User extends BaseEntity {

    @Column(
            name = "first_name",
            nullable = false,
            length = 60
    )
    private String firstName;

    @Column(
            name = "last_name",
            nullable = false,
            length = 60
    )
    private String lastName;

    @Column(
            name = "email",
            nullable = false,
            unique = true,
            length = 150
    )
    private String email;

    @Column(
            name = "mobile",
            nullable = false,
            unique = true,
            length = 15
    )
    private String mobile;

    @Column(
            name = "password",
            nullable = false
    )
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "role",
            nullable = false,
            length = 20
    )
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 20
    )
    private Status status;

    @Column(
            name = "email_verified",
            nullable = false
    )
    private boolean emailVerified;
}
