package com.fieldsync.controller;

import com.fieldsync.dto.AdminStatsDTO;
import com.fieldsync.dto.HelperProfileDTO;
import com.fieldsync.dto.ReviewDTO;
import com.fieldsync.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints — guarded by ADMIN role at both URL and method level.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin panel endpoints")
public class AdminController {

    private final AdminService adminService;

    /** List helpers awaiting verification */
    @GetMapping("/helpers/pending")
    @Operation(summary = "List pending helper verifications")
    public ResponseEntity<List<HelperProfileDTO>> getPendingHelpers() {
        return ResponseEntity.ok(adminService.getPendingHelpers());
    }

    /** Approve a helper */
    @PatchMapping("/helpers/{id}/verify")
    @Operation(summary = "Verify a helper")
    public ResponseEntity<HelperProfileDTO> verifyHelper(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.verifyHelper(id));
    }

    /** Reject a helper */
    @PatchMapping("/helpers/{id}/reject")
    @Operation(summary = "Reject a helper")
    public ResponseEntity<HelperProfileDTO> rejectHelper(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectHelper(id));
    }

    /** List flagged reviews */
    @GetMapping("/reviews/flagged")
    @Operation(summary = "List flagged reviews")
    public ResponseEntity<List<ReviewDTO>> getFlaggedReviews() {
        return ResponseEntity.ok(adminService.getFlaggedReviews());
    }

    /** Remove a review */
    @DeleteMapping("/reviews/{id}")
    @Operation(summary = "Delete a flagged review")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    /** Platform stats */
    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
