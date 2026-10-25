package com.fieldsync.dto;

import com.fieldsync.enums.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for booking data returned by API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private Long id;

    // Customer info
    private Long customerId;
    private String customerName;
    private String customerAvatarUrl;

    // Helper info
    private Long helperProfileId;
    private Long helperUserId;
    private String helperName;
    private String helperAvatarUrl;
    private String skillCategoryName;
    private BigDecimal dailyWage;

    private LocalDate requestedDate;
    private BookingStatus status;
    private String notes;
    private String workAddress;

    private boolean reviewSubmitted;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
