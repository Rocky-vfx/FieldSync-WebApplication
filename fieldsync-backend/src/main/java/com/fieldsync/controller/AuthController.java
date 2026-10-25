package com.fieldsync.controller;

import com.fieldsync.dto.*;
import com.fieldsync.entity.AppUser;
import com.fieldsync.entity.HelperProfile;
import com.fieldsync.entity.SkillCategory;
import com.fieldsync.enums.AccountStatus;
import com.fieldsync.enums.Role;
import com.fieldsync.exception.BadRequestException;
import com.fieldsync.exception.ResourceNotFoundException;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.AppUserRepository;
import com.fieldsync.repository.HelperProfileRepository;
import com.fieldsync.repository.SkillCategoryRepository;
import com.fieldsync.security.CurrentUserProvider;
import com.fieldsync.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * Auth endpoints — profile completion after OAuth2 login, current user info,
 * and a dev-only endpoint for testing without a real Google OAuth flow.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication and profile management")
public class AuthController {

    private final AppUserRepository appUserRepository;
    private final HelperProfileRepository helperProfileRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CurrentUserProvider currentUserProvider;

    /**
     * Get the currently authenticated user's info.
     */
    @GetMapping("/me")
    @Operation(summary = "Get current user info")
    public ResponseEntity<AppUserDTO> getCurrentUser() {
        AppUser user = currentUserProvider.getCurrentUser();
        return ResponseEntity.ok(DtoMapper.toDto(user));
    }

    /**
     * Complete the post-login profile setup.
     * Called after first Google sign-in to fill in details and choose role.
     */
    @PostMapping("/complete-profile")
    @Operation(summary = "Complete profile after first Google sign-in")
    public ResponseEntity<AuthResponse> completeProfile(@Valid @RequestBody CompleteProfileRequest req) {

        AppUser user = currentUserProvider.getCurrentUser();

        // Update common fields
        user.setFullName(req.getFullName());
        user.setPhone(req.getPhone());
        user.setAddress(req.getAddress());

        // Set role
        Role role;
        try {
            role = Role.valueOf(req.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + req.getRole() + ". Must be USER or HELPER.");
        }
        if (role == Role.ADMIN) {
            throw new BadRequestException("Cannot self-assign ADMIN role");
        }
        user.setRole(role);

        // Users are verified immediately; Helpers need Admin approval
        if (role == Role.USER) {
            user.setAccountStatus(AccountStatus.VERIFIED);
        } else {
            user.setAccountStatus(AccountStatus.PENDING);
        }

        user.setProfileComplete(true);
        appUserRepository.save(user);

        // If HELPER, create their professional profile
        if (role == Role.HELPER) {
            validateHelperFields(req);

            SkillCategory skill = skillCategoryRepository.findById(req.getSkillCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "SkillCategory", "id", req.getSkillCategoryId()));

            HelperProfile profile = HelperProfile.builder()
                    .user(user)
                    .skillCategory(skill)
                    .dailyWage(BigDecimal.valueOf(req.getDailyWage()))
                    .latitude(req.getLatitude())
                    .longitude(req.getLongitude())
                    .workLocationName(req.getWorkLocationName())
                    .experienceYears(req.getExperienceYears() != null ? req.getExperienceYears() : 0)
                    .documentUrl(req.getDocumentUrl())
                    .bio(req.getBio())
                    .available(true)
                    .verified(false) // pending Admin verification
                    .build();

            helperProfileRepository.save(profile);
        }

        // Issue a fresh JWT with the updated role
        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(DtoMapper.toDto(user))
                .profileComplete(true)
                .newUser(false)
                .build());
    }

    /**
     * Standard REST login endpoint for FieldSync standalone login page.
     * Authenticates an email and issues a signed JWT token.
     */
    @PostMapping("/login")
    @Operation(summary = "Authenticate user via email and issue JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        Role targetRole = Role.USER;
        if (req.getRole() != null && !req.getRole().isBlank()) {
            try {
                targetRole = Role.valueOf(req.getRole().toUpperCase());
            } catch (IllegalArgumentException ignored) {
                // Fall back to USER
            }
        }

        final Role assignedRole = targetRole;
        AppUser user = appUserRepository.findByEmail(req.getEmail())
                .orElseGet(() -> {
                    String baseName = req.getEmail().contains("@")
                            ? req.getEmail().substring(0, req.getEmail().indexOf('@'))
                            : "FieldSync User";
                    String formattedName = baseName.substring(0, 1).toUpperCase() + 
                            (baseName.length() > 1 ? baseName.substring(1) : "");
                    AppUser newUser = AppUser.builder()
                            .email(req.getEmail())
                            .fullName(formattedName)
                            .role(assignedRole)
                            .accountStatus(AccountStatus.VERIFIED)
                            .profileComplete(true)
                            .build();
                    return appUserRepository.save(newUser);
                });

        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(DtoMapper.toDto(user))
                .profileComplete(user.isProfileComplete())
                .newUser(false)
                .build());
    }

    /**
     * DEV-ONLY: Create a test user and get a JWT without Google OAuth.
     * Remove or restrict this in production.
     */
    @PostMapping("/dev-login")
    @Operation(summary = "[DEV] Create test user and get JWT")
    public ResponseEntity<AuthResponse> devLogin(
            @RequestParam String email,
            @RequestParam(defaultValue = "Test User") String name,
            @RequestParam(defaultValue = "USER") String role) {

        Role userRole;
        try {
            userRole = Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + role);
        }

        AppUser user = appUserRepository.findByEmail(email)
                .orElseGet(() -> {
                    AppUser newUser = AppUser.builder()
                            .email(email)
                            .fullName(name)
                            .role(userRole)
                            .accountStatus(AccountStatus.VERIFIED)
                            .profileComplete(true)
                            .build();
                    return appUserRepository.save(newUser);
                });

        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(DtoMapper.toDto(user))
                .profileComplete(user.isProfileComplete())
                .newUser(false)
                .build());
    }

    private void validateHelperFields(CompleteProfileRequest req) {
        if (req.getSkillCategoryId() == null) {
            throw new BadRequestException("Skill category is required for Helpers");
        }
        if (req.getDailyWage() == null) {
            throw new BadRequestException("Daily wage is required for Helpers");
        }
        if (req.getLatitude() == null || req.getLongitude() == null) {
            throw new BadRequestException("Work location (lat/lng) is required for Helpers");
        }
    }
}
