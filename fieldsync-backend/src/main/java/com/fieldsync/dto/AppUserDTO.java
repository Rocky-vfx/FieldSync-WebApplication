package com.fieldsync.dto;

import com.fieldsync.enums.AccountStatus;
import com.fieldsync.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO returned for user profile / auth endpoints.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String avatarUrl;
    private Role role;
    private AccountStatus accountStatus;
    private boolean profileComplete;
    private LocalDateTime createdAt;
}
