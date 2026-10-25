package com.fieldsync.controller;

import com.fieldsync.dto.HelperProfileDTO;
import com.fieldsync.dto.UpdateHelperProfileRequest;
import com.fieldsync.security.CurrentUserProvider;
import com.fieldsync.service.HelperService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Helper self-service endpoints.
 */
@RestController
@RequestMapping("/api/helpers")
@RequiredArgsConstructor
@Tag(name = "Helpers", description = "Helper profile management")
public class HelperController {

    private final HelperService helperService;
    private final CurrentUserProvider currentUserProvider;

    /** Public: view any helper's profile */
    @GetMapping("/{id}")
    @Operation(summary = "Get helper profile by ID (public)")
    public ResponseEntity<HelperProfileDTO> getHelperProfile(@PathVariable Long id) {
        return ResponseEntity.ok(helperService.getHelperProfile(id));
    }

    /** Helper: get own profile */
    @GetMapping("/me")
    @PreAuthorize("hasRole('HELPER')")
    @Operation(summary = "Get current helper's profile")
    public ResponseEntity<HelperProfileDTO> getMyProfile() {
        return ResponseEntity.ok(
                helperService.getMyProfile(currentUserProvider.getCurrentUser()));
    }

    /** Helper: update own profile */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('HELPER')")
    @Operation(summary = "Update helper profile")
    public ResponseEntity<HelperProfileDTO> updateProfile(
            @Valid @RequestBody UpdateHelperProfileRequest request) {
        return ResponseEntity.ok(
                helperService.updateProfile(currentUserProvider.getCurrentUser(), request));
    }

    /** Helper: toggle availability */
    @PatchMapping("/availability")
    @PreAuthorize("hasRole('HELPER')")
    @Operation(summary = "Toggle helper availability")
    public ResponseEntity<HelperProfileDTO> toggleAvailability() {
        return ResponseEntity.ok(
                helperService.toggleAvailability(currentUserProvider.getCurrentUser()));
    }
}
