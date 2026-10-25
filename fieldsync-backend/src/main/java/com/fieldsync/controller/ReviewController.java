package com.fieldsync.controller;

import com.fieldsync.dto.CreateReviewRequest;
import com.fieldsync.dto.ReviewDTO;
import com.fieldsync.security.CurrentUserProvider;
import com.fieldsync.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Review endpoints.
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Ratings and reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final CurrentUserProvider currentUserProvider;

    /** Submit a review for a completed booking */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Submit a review")
    public ResponseEntity<ReviewDTO> createReview(
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewDTO review = reviewService.createReview(
                currentUserProvider.getCurrentUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    /** Get all reviews for a helper (public) */
    @GetMapping("/helper/{helperProfileId}")
    @Operation(summary = "Get reviews for a helper")
    public ResponseEntity<List<ReviewDTO>> getReviewsForHelper(
            @PathVariable Long helperProfileId) {
        return ResponseEntity.ok(reviewService.getReviewsForHelper(helperProfileId));
    }

    /** Flag a review for moderation */
    @PostMapping("/{id}/flag")
    @Operation(summary = "Flag a review for moderation")
    public ResponseEntity<ReviewDTO> flagReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.flagReview(id));
    }
}
