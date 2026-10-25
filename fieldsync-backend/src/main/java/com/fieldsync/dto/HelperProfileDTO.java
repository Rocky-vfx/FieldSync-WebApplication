package com.fieldsync.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * DTO for helper profile data returned by API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HelperProfileDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String phone;

    private Long skillCategoryId;
    private String skillCategoryName;
    private String skillIconName;

    private BigDecimal dailyWage;
    private Double latitude;
    private Double longitude;
    private String workLocationName;
    private Integer experienceYears;
    private boolean available;
    private boolean verified;
    private BigDecimal averageRating;
    private Integer ratingCount;
    private String documentUrl;
    private String bio;
}
