package com.fieldsync.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Request body for Helper to update their own profile.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateHelperProfileRequest {

    private Long skillCategoryId;

    @DecimalMin(value = "0.01", message = "Daily wage must be positive")
    private BigDecimal dailyWage;

    private Double latitude;
    private Double longitude;
    private String workLocationName;

    @Min(value = 0, message = "Experience years cannot be negative")
    private Integer experienceYears;

    private String bio;
}
