package com.fieldsync.controller;

import com.fieldsync.dto.BookingDTO;
import com.fieldsync.dto.CreateBookingRequest;
import com.fieldsync.security.CurrentUserProvider;
import com.fieldsync.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking endpoints.
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking flow management")
public class BookingController {

    private final BookingService bookingService;
    private final CurrentUserProvider currentUserProvider;

    /** User creates a booking */
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a booking request")
    public ResponseEntity<BookingDTO> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {
        BookingDTO booking = bookingService.createBooking(
                currentUserProvider.getCurrentUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    /** List my bookings (role-aware) */
    @GetMapping
    @Operation(summary = "List my bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings() {
        return ResponseEntity.ok(
                bookingService.getMyBookings(currentUserProvider.getCurrentUser()));
    }

    /** Helper accepts a booking */
    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasRole('HELPER')")
    @Operation(summary = "Accept a booking")
    public ResponseEntity<BookingDTO> acceptBooking(@PathVariable Long id) {
        return ResponseEntity.ok(
                bookingService.acceptBooking(currentUserProvider.getCurrentUser(), id));
    }

    /** Helper rejects a booking */
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('HELPER')")
    @Operation(summary = "Reject a booking")
    public ResponseEntity<BookingDTO> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(
                bookingService.rejectBooking(currentUserProvider.getCurrentUser(), id));
    }

    /** Helper marks a booking as completed */
    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('HELPER')")
    @Operation(summary = "Mark booking as completed")
    public ResponseEntity<BookingDTO> completeBooking(@PathVariable Long id) {
        return ResponseEntity.ok(
                bookingService.completeBooking(currentUserProvider.getCurrentUser(), id));
    }

    /** Either party cancels a booking */
    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(
                bookingService.cancelBooking(currentUserProvider.getCurrentUser(), id));
    }
}
