package com.fieldsync.dto;

import lombok.*;

/**
 * Wrapper for JWT token response after authentication.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private AppUserDTO user;
    private boolean profileComplete;
    private boolean newUser;
}
