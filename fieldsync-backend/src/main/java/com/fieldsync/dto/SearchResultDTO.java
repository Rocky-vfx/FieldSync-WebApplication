package com.fieldsync.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * Search result DTO — includes computed distance from the search origin.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResultDTO {
    private Long helperProfileId;
    private Long userId;
    private String fullName;
    private String avatarUrl;

    private String skillCategoryName;
    private String skillIconName;

    private BigDecimal dailyWage;
    private String workLocationName;
    private Double latitude;
    private Double longitude;
    private Integer experienceYears;
    private boolean verified;
    private BigDecimal averageRating;
    private Integer ratingCount;

    /** Distance in km from the search origin, computed via Haversine */
    private Double distanceKm;
}
