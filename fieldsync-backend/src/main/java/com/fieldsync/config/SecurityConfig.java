package com.fieldsync.config;

import com.fieldsync.security.JwtAuthenticationFilter;
import com.fieldsync.security.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

/**
 * Spring Security configuration.
 *
 * - OAuth2 login with Google (first-time auth) — skipped in local profile
 * - JWT session for subsequent API requests (stateless)
 * - Public endpoints: search, skills, swagger, actuator
 * - All other endpoints require authentication
 * - @PreAuthorize at method level for role guards
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired(required = false)
    private OAuth2SuccessHandler oAuth2SuccessHandler;

    @Autowired
    private Environment environment;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for stateless JWT API
            .csrf(AbstractHttpConfigurer::disable)

            // Allow H2 console frames in local profile
            .headers(headers -> headers.frameOptions(fo -> fo.sameOrigin()))

            // CORS — uses the CorsConfigurationSource from WebConfig
            .cors(cors -> {})

            // Stateless sessions — JWT handles auth state
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.GET, "/api/search/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/skill-categories/**", "/api/skill-categories").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/helpers/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/helper/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // Swagger / OpenAPI
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html",
                                 "/api-docs/**", "/v3/api-docs/**").permitAll()

                // Health / actuator
                .requestMatchers("/actuator/**").permitAll()

                // H2 console (local dev only)
                .requestMatchers("/h2-console/**").permitAll()

                // OAuth2 login endpoints
                .requestMatchers("/login/**", "/oauth2/**").permitAll()

                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            // Add JWT filter before the default username/password filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Only configure OAuth2 if NOT in local profile (Google credentials available)
        boolean isLocal = Arrays.asList(environment.getActiveProfiles()).contains("local");
        if (!isLocal && oAuth2SuccessHandler != null) {
            http.oauth2Login(oauth -> oauth
                .successHandler(oAuth2SuccessHandler)
            );
        }

        return http.build();
    }
}
