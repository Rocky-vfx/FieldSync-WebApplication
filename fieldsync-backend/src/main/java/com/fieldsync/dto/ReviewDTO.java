package com.fieldsync.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO for review data returned by API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private Long bookingId;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerAvatarUrl;
    private Long helperProfileId;
    private Integer rating;
    private String comment;
    private boolean flagged;
    private LocalDateTime createdAt;
}
