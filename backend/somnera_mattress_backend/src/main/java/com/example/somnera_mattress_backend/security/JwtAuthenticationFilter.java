package com.example.somnera_mattress_backend.security;

import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtService
            jwtService;


    private final CustomUserDetailsService
            customUserDetailsService;


    @Override
    protected void doFilterInternal(

            @NonNull
            HttpServletRequest request,

            @NonNull
            HttpServletResponse response,

            @NonNull
            FilterChain filterChain

    ) throws ServletException, IOException {


        String authorizationHeader =
                request.getHeader(
                        "Authorization"
                );


        /*
        ==============================================
        NO JWT
        ==============================================
        */

        if (
                !StringUtils.hasText(
                        authorizationHeader
                )

                        ||

                !authorizationHeader
                        .startsWith(
                                "Bearer "
                        )
        ) {


            filterChain.doFilter(
                    request,
                    response
            );


            return;
        }


        String jwtToken =
                authorizationHeader
                        .substring(
                                7
                        );


        try {


            String email =
                    jwtService
                            .extractEmail(
                                    jwtToken
                            );


            if (
                    StringUtils.hasText(
                            email
                    )

                            &&

                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            == null
            ) {


                /*
                ======================================
                LOAD CURRENT USER FROM DATABASE
                ======================================

                Important:

                This means account status is checked
                again on authenticated requests.

                If admin blocks the user after JWT
                creation, the latest user state can
                prevent authentication.
                */

                UserDetails userDetails =
                        customUserDetailsService
                                .loadUserByUsername(
                                        email
                                );


                /*
                ======================================
                ACCOUNT CHECK
                ======================================
                */

                boolean accountAllowed =

                        userDetails
                                .isEnabled()

                                &&

                        userDetails
                                .isAccountNonLocked()

                                &&

                        userDetails
                                .isAccountNonExpired()

                                &&

                        userDetails
                                .isCredentialsNonExpired();


                /*
                ======================================
                JWT VALIDATION
                ======================================
                */

                if (
                        accountAllowed

                                &&

                        jwtService
                                .isTokenValid(
                                        jwtToken,
                                        userDetails
                                )
                ) {


                    UsernamePasswordAuthenticationToken
                            authenticationToken =

                            new UsernamePasswordAuthenticationToken(

                                    userDetails,

                                    null,

                                    userDetails
                                            .getAuthorities()
                            );


                    authenticationToken
                            .setDetails(

                                    new WebAuthenticationDetailsSource()
                                            .buildDetails(
                                                    request
                                            )
                            );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authenticationToken
                            );
                }
            }


        } catch (
                JwtException
                | IllegalArgumentException exception
        ) {


            SecurityContextHolder
                    .clearContext();
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}