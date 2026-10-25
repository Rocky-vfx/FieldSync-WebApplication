package com.fieldsync.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Request body for the post-login profile completion step.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompleteProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    /** "USER" or "HELPER" — chosen during profile setup */
    @NotBlank(message = "Role is required")
    private String role;

    // ─── Helper-only fields (required when role = HELPER) ───

    private Long skillCategoryId;

    @DecimalMin(value = "0.01", message = "Daily wage must be positive")
    private Double dailyWage;

    private Double latitude;
    private Double longitude;
    private String workLocationName;

    @Min(value = 0, message = "Experience years cannot be negative")
    private Integer experienceYears;

    /** URL/path to uploaded ID document (Helper verification) */
    private String documentUrl;

    private String bio;
}
