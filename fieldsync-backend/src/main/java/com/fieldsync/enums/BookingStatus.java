package com.fieldsync.enums;

/**
 * Booking lifecycle states.
 *
 * State transitions:
 *   PENDING  → ACCEPTED | REJECTED | CANCELLED
 *   ACCEPTED → COMPLETED | CANCELLED
 */
public enum BookingStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    COMPLETED,
    CANCELLED
}
