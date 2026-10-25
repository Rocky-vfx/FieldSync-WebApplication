package com.fieldsync.service;

import com.fieldsync.dto.CreateReviewRequest;
import com.fieldsync.dto.ReviewDTO;
import com.fieldsync.entity.AppUser;
import com.fieldsync.entity.Booking;
import com.fieldsync.entity.HelperProfile;
import com.fieldsync.entity.Review;
import com.fieldsync.enums.BookingStatus;
import com.fieldsync.exception.BadRequestException;
import com.fieldsync.exception.ResourceNotFoundException;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.BookingRepository;
import com.fieldsync.repository.HelperProfileRepository;
import com.fieldsync.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Review service — handles review creation, helper rating recomputation, and flagging.
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final HelperProfileRepository helperProfileRepository;

    /**
     * Submit a review for a completed booking.
     * One review per booking, only by the booking's customer.
     */
    @Transactional
    public ReviewDTO createReview(AppUser reviewer, CreateReviewRequest req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", req.getBookingId()));

        // Validate
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Can only review completed bookings");
        }
        if (!booking.getCustomer().getId().equals(reviewer.getId())) {
            throw new BadRequestException("Only the booking customer can submit a review");
        }
        if (reviewRepository.existsByBookingId(req.getBookingId())) {
            throw new BadRequestException("A review already exists for this booking");
        }

        HelperProfile helper = booking.getHelperProfile();

        Review review = Review.builder()
                .booking(booking)
                .reviewer(reviewer)
                .helperProfile(helper)
                .rating(req.getRating())
                .comment(req.getComment())
                .flagged(false)
                .build();

        reviewRepository.save(review);

        // Recompute average rating
        recomputeRating(helper);

        return DtoMapper.toDto(review);
    }

    /**
     * Get all reviews for a helper.
     */
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsForHelper(Long helperProfileId) {
        return reviewRepository.findByHelperProfileId(helperProfileId)
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    /**
     * Flag a review for admin moderation.
     */
    @Transactional
    public ReviewDTO flagReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        review.setFlagged(true);
        reviewRepository.save(review);
        return DtoMapper.toDto(review);
    }

    /**
     * Recompute the helper's average rating from all their reviews.
     */
    private void recomputeRating(HelperProfile helper) {
        List<Review> allReviews = reviewRepository.findByHelperProfileId(helper.getId());

        if (allReviews.isEmpty()) {
            helper.setAverageRating(BigDecimal.ZERO);
            helper.setRatingCount(0);
        } else {
            double avg = allReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            helper.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            helper.setRatingCount(allReviews.size());
        }

        helperProfileRepository.save(helper);
    }
}
