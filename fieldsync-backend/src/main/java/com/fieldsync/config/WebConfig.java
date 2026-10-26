package com.fieldsync.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

/**
 * CORS configuration — allows the React frontend (dev on port 5173,
 * production on a different domain) to call the API.
 *
 * Set the ALLOWED_ORIGINS env var on Render to your Vercel URL, e.g.:
 *   ALLOWED_ORIGINS=https://fieldsync.vercel.app
 * Multiple origins can be comma-separated:
 *   ALLOWED_ORIGINS=https://fieldsync.vercel.app,https://my-preview.vercel.app
 */
@Configuration
public class WebConfig {

    @Value("${ALLOWED_ORIGINS:}")
    private String allowedOriginsEnv;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Always allow local dev origins
        List<String> origins = new ArrayList<>(List.of(
                "http://localhost:5173",
                "http://localhost:3000"
        ));

        // Append any production origins from environment variable
        if (allowedOriginsEnv != null && !allowedOriginsEnv.isBlank()) {
            for (String origin : allowedOriginsEnv.split(",")) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty()) {
                    origins.add(trimmed);
                }
            }
        }

        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
