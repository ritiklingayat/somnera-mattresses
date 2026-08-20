package com.example.somnera_mattress_backend.config;

import com.example.somnera_mattress_backend.security.CustomUserDetailsService;
import com.example.somnera_mattress_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomUserDetailsService customUserDetailsService;

    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
                customUserDetailsService
        );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource
                        )
                )

                .csrf(csrf ->
                        csrf.disable()
                )

                .httpBasic(httpBasic ->
                        httpBasic.disable()
                )

                .formLogin(formLogin ->
                        formLogin.disable()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth ->
                        auth
                                .requestMatchers(
                                        "/health",
                                        "/api/auth/**",
                                        "/error"
                                )
                                .permitAll()


                                .requestMatchers(
                                        "/api/admin/**"
                                )
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        "/api/users/**"
                                )
                                .hasAnyRole(
                                        "USER",
                                        "ADMIN"
                                )

                                // CART - LOGIN REQUIRED
                                .requestMatchers(
                                        "/api/cart/**"
                                )
                                .hasRole("USER")

                                //distributor
                                .requestMatchers(
                                        org.springframework.http.HttpMethod.POST,
                                        "/api/distributor-requests"
                                        ).permitAll()

                                .requestMatchers(
                                                org.springframework.http.HttpMethod.GET,
                                                "/api/distributor-requests"
                                                        ).hasRole("ADMIN")

                                //wishlist
                                .requestMatchers(
                                        "/api/wishlist/**"
                                )
                                .hasRole("USER")


                                // CHECKOUT
                                .requestMatchers(
                                        "/api/checkout/**"
                                )
                                .hasRole("USER")

                                // PAYMENT

                                .requestMatchers(
                                        "/api/payments/**"
                                )
                                .hasRole("USER")

                                // ORDERS

                                .requestMatchers(
                                        "/api/orders/**"
                                )
                                .hasRole("USER")

                                //product
                                .requestMatchers(
                                        org.springframework.http.HttpMethod.GET,
                                        "/api/products/**"
                                )
                                .permitAll()

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.POST,
                                        "/api/products/**"
                                )
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.PUT,
                                        "/api/products/**"
                                )
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.DELETE,
                                        "/api/products/**"
                                )
                                .hasRole("ADMIN")

                                //categories
                                .requestMatchers(
                                        org.springframework.http.HttpMethod.GET,
                                        "/api/categories/**"
                                )
                                .permitAll()

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.POST,
                                        "/api/categories/**"
                                )
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.PUT,
                                        "/api/categories/**"
                                )
                                .hasRole("ADMIN")

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.DELETE,
                                        "/api/categories/**"
                                )
                                .hasRole("ADMIN")




                                .anyRequest()
                                .authenticated()
                )

                .authenticationProvider(
                        authenticationProvider()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}