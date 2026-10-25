package com.fieldsync.mapper;

import com.fieldsync.dto.*;
import com.fieldsync.entity.*;

/**
 * Manual entity-to-DTO mappers. Keeps mapping logic centralised
 * without pulling in a code-gen dependency like MapStruct.
 */
public final class DtoMapper {

    private DtoMapper() {}

    // ─── AppUser ───

    public static AppUserDTO toDto(AppUser user) {
        return AppUserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .accountStatus(user.getAccountStatus())
                .profileComplete(user.isProfileComplete())
                .createdAt(user.getCreatedAt())
                .build();
    }

    // ─── SkillCategory ───

    public static SkillCategoryDTO toDto(SkillCategory sc) {
        return SkillCategoryDTO.builder()
                .id(sc.getId())
                .name(sc.getName())
                .description(sc.getDescription())
                .iconName(sc.getIconName())
                .build();
    }

    // ─── HelperProfile ───

    public static HelperProfileDTO toDto(HelperProfile hp) {
        AppUser user = hp.getUser();
        SkillCategory skill = hp.getSkillCategory();

        return HelperProfileDTO.builder()
                .id(hp.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .skillCategoryId(skill.getId())
                .skillCategoryName(skill.getName())
                .skillIconName(skill.getIconName())
                .dailyWage(hp.getDailyWage())
                .latitude(hp.getLatitude())
                .longitude(hp.getLongitude())
                .workLocationName(hp.getWorkLocationName())
                .experienceYears(hp.getExperienceYears())
                .available(hp.isAvailable())
                .verified(hp.isVerified())
                .averageRating(hp.getAverageRating())
                .ratingCount(hp.getRatingCount())
                .documentUrl(hp.getDocumentUrl())
                .bio(hp.getBio())
                .build();
    }

    // ─── SearchResult ───

    public static SearchResultDTO toSearchResult(HelperProfile hp, double distanceKm) {
        AppUser user = hp.getUser();
        SkillCategory skill = hp.getSkillCategory();

        return SearchResultDTO.builder()
                .helperProfileId(hp.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .skillCategoryName(skill.getName())
                .skillIconName(skill.getIconName())
                .dailyWage(hp.getDailyWage())
                .workLocationName(hp.getWorkLocationName())
                .latitude(hp.getLatitude())
                .longitude(hp.getLongitude())
                .experienceYears(hp.getExperienceYears())
                .verified(hp.isVerified())
                .averageRating(hp.getAverageRating())
                .ratingCount(hp.getRatingCount())
                .distanceKm(Math.round(distanceKm * 100.0) / 100.0)
                .build();
    }

    // ─── Booking ───

    public static BookingDTO toDto(Booking booking, boolean reviewSubmitted) {
        HelperProfile hp = booking.getHelperProfile();
        AppUser customer = booking.getCustomer();
        AppUser helperUser = hp.getUser();

        return BookingDTO.builder()
                .id(booking.getId())
                .customerId(customer.getId())
                .customerName(customer.getFullName())
                .customerAvatarUrl(customer.getAvatarUrl())
                .helperProfileId(hp.getId())
                .helperUserId(helperUser.getId())
                .helperName(helperUser.getFullName())
                .helperAvatarUrl(helperUser.getAvatarUrl())
                .skillCategoryName(hp.getSkillCategory().getName())
                .dailyWage(hp.getDailyWage())
                .requestedDate(booking.getRequestedDate())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .workAddress(booking.getWorkAddress())
                .reviewSubmitted(reviewSubmitted)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    // ─── Review ───

    public static ReviewDTO toDto(Review review) {
        AppUser reviewer = review.getReviewer();

        return ReviewDTO.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .reviewerId(reviewer.getId())
                .reviewerName(reviewer.getFullName())
                .reviewerAvatarUrl(reviewer.getAvatarUrl())
                .helperProfileId(review.getHelperProfile().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .flagged(review.isFlagged())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
