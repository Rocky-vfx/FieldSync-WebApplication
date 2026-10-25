package com.fieldsync.dto;

import lombok.*;

/**
 * Platform-wide statistics for the Admin dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDTO {
    private long totalUsers;
    private long totalHelpers;
    private long verifiedHelpers;
    private long pendingHelpers;
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long totalReviews;
    private long flaggedReviews;
}
