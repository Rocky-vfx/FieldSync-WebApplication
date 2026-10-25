package com.fieldsync.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Request body for creating a new booking.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {

    @NotNull(message = "Helper profile ID is required")
    private Long helperProfileId;

    @NotNull(message = "Requested date is required")
    @FutureOrPresent(message = "Requested date must be today or in the future")
    private LocalDate requestedDate;

    @Size(max = 1000, message = "Notes must be at most 1000 characters")
    private String notes;

    private String workAddress;
}
