package com.fieldsync.entity;

import com.fieldsync.enums.AccountStatus;
import com.fieldsync.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Core user entity shared by all roles (USER, HELPER, ADMIN).
 * Created on first Google OAuth2 sign-in; profile details filled
 * in the post-login verification step.
 */
@Entity
@Table(name = "app_users", indexes = {
        @Index(name = "idx_app_users_email", columnList = "email", unique = true),
        @Index(name = "idx_app_users_google_id", columnList = "googleId", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    private String address;

    /** Google OAuth2 subject identifier — unique per Google account */
    @Column(unique = true)
    private String googleId;

    /** URL to the user's Google profile picture */
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AccountStatus accountStatus = AccountStatus.PENDING;

    /**
     * True once the user has completed the post-login details form.
     * Users can browse immediately; Helpers need Admin verification too.
     */
    @Builder.Default
    private boolean profileComplete = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
