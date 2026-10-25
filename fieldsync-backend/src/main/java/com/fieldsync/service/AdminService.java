package com.fieldsync.service;

import com.fieldsync.dto.AdminStatsDTO;
import com.fieldsync.dto.HelperProfileDTO;
import com.fieldsync.dto.ReviewDTO;
import com.fieldsync.entity.AppUser;
import com.fieldsync.entity.HelperProfile;
import com.fieldsync.enums.AccountStatus;
import com.fieldsync.enums.BookingStatus;
import com.fieldsync.enums.Role;
import com.fieldsync.exception.ResourceNotFoundException;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Admin service — helper verification, review moderation, platform stats.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final HelperProfileRepository helperProfileRepository;
    private final AppUserRepository appUserRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    /**
     * List all helpers pending verification.
     */
    @Transactional(readOnly = true)
    public List<HelperProfileDTO> getPendingHelpers() {
        return helperProfileRepository.findByVerifiedFalse()
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    /**
     * Approve a helper's verification.
     */
    @Transactional
    public HelperProfileDTO verifyHelper(Long helperProfileId) {
        HelperProfile hp = helperProfileRepository.findById(helperProfileId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HelperProfile", "id", helperProfileId));
        hp.setVerified(true);

        AppUser user = hp.getUser();
        user.setAccountStatus(AccountStatus.VERIFIED);
        appUserRepository.save(user);

        helperProfileRepository.save(hp);
        return DtoMapper.toDto(hp);
    }

    /**
     * Reject a helper's verification.
     */
    @Transactional
    public HelperProfileDTO rejectHelper(Long helperProfileId) {
        HelperProfile hp = helperProfileRepository.findById(helperProfileId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HelperProfile", "id", helperProfileId));
        hp.setVerified(false);

        AppUser user = hp.getUser();
        user.setAccountStatus(AccountStatus.REJECTED);
        appUserRepository.save(user);

        helperProfileRepository.save(hp);
        return DtoMapper.toDto(hp);
    }

    /**
     * List all flagged reviews.
     */
    @Transactional(readOnly = true)
    public List<ReviewDTO> getFlaggedReviews() {
        return reviewRepository.findByFlaggedTrue()
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    /**
     * Delete a review (moderation action).
     */
    @Transactional
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review", "id", reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    /**
     * Platform-wide statistics.
     */
    @Transactional(readOnly = true)
    public AdminStatsDTO getStats() {
        return AdminStatsDTO.builder()
                .totalUsers(appUserRepository.countByRole(Role.USER))
                .totalHelpers(appUserRepository.countByRole(Role.HELPER))
                .verifiedHelpers(helperProfileRepository.countByVerifiedTrue())
                .pendingHelpers(helperProfileRepository.findByVerifiedFalse().size())
                .totalBookings(bookingRepository.count())
                .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
                .completedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED))
                .totalReviews(reviewRepository.count())
                .flaggedReviews(reviewRepository.findByFlaggedTrue().size())
                .build();
    }
}
