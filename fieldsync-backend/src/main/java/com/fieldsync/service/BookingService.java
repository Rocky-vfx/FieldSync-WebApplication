package com.fieldsync.service;

import com.fieldsync.dto.BookingDTO;
import com.fieldsync.dto.CreateBookingRequest;
import com.fieldsync.entity.AppUser;
import com.fieldsync.entity.Booking;
import com.fieldsync.entity.HelperProfile;
import com.fieldsync.enums.BookingStatus;
import com.fieldsync.enums.Role;
import com.fieldsync.exception.BadRequestException;
import com.fieldsync.exception.ResourceNotFoundException;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.BookingRepository;
import com.fieldsync.repository.HelperProfileRepository;
import com.fieldsync.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Booking lifecycle service.
 * State machine: PENDING → ACCEPTED | REJECTED | CANCELLED
 *                ACCEPTED → COMPLETED | CANCELLED
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HelperProfileRepository helperProfileRepository;
    private final ReviewRepository reviewRepository;

    /**
     * User creates a booking request.
     */
    @Transactional
    public BookingDTO createBooking(AppUser customer, CreateBookingRequest req) {
        HelperProfile helper = helperProfileRepository.findById(req.getHelperProfileId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HelperProfile", "id", req.getHelperProfileId()));

        if (!helper.isVerified()) {
            throw new BadRequestException("Cannot book an unverified helper");
        }
        if (!helper.isAvailable()) {
            throw new BadRequestException("This helper is currently unavailable");
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .helperProfile(helper)
                .requestedDate(req.getRequestedDate())
                .status(BookingStatus.PENDING)
                .notes(req.getNotes())
                .workAddress(req.getWorkAddress())
                .build();

        bookingRepository.save(booking);
        return DtoMapper.toDto(booking, false);
    }

    /**
     * Get all bookings for the current user (filtered by their role).
     */
    @Transactional(readOnly = true)
    public List<BookingDTO> getMyBookings(AppUser user) {
        List<Booking> bookings;

        if (user.getRole() == Role.HELPER) {
            HelperProfile hp = helperProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "HelperProfile", "userId", user.getId()));
            bookings = bookingRepository.findByHelperProfileId(hp.getId());
        } else {
            bookings = bookingRepository.findByCustomerId(user.getId());
        }

        return bookings.stream()
                .map(b -> DtoMapper.toDto(b, reviewRepository.existsByBookingId(b.getId())))
                .toList();
    }

    /**
     * Helper accepts a pending booking.
     */
    @Transactional
    public BookingDTO acceptBooking(AppUser helper, Long bookingId) {
        Booking booking = getBookingForHelper(helper, bookingId);
        validateTransition(booking.getStatus(), BookingStatus.ACCEPTED);
        booking.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(booking);
        return DtoMapper.toDto(booking, false);
    }

    /**
     * Helper rejects a pending booking.
     */
    @Transactional
    public BookingDTO rejectBooking(AppUser helper, Long bookingId) {
        Booking booking = getBookingForHelper(helper, bookingId);
        validateTransition(booking.getStatus(), BookingStatus.REJECTED);
        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);
        return DtoMapper.toDto(booking, false);
    }

    /**
     * Mark an accepted booking as completed.
     */
    @Transactional
    public BookingDTO completeBooking(AppUser helper, Long bookingId) {
        Booking booking = getBookingForHelper(helper, bookingId);
        validateTransition(booking.getStatus(), BookingStatus.COMPLETED);
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        return DtoMapper.toDto(booking, false);
    }

    /**
     * Cancel a booking (by either party, from PENDING or ACCEPTED).
     */
    @Transactional
    public BookingDTO cancelBooking(AppUser user, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Verify the user is either the customer or the helper
        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());
        boolean isHelper = booking.getHelperProfile().getUser().getId().equals(user.getId());
        if (!isCustomer && !isHelper) {
            throw new BadRequestException("You are not a party to this booking");
        }

        validateTransition(booking.getStatus(), BookingStatus.CANCELLED);
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        return DtoMapper.toDto(booking, false);
    }

    // ─── Private helpers ───

    private Booking getBookingForHelper(AppUser helper, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getHelperProfile().getUser().getId().equals(helper.getId())) {
            throw new BadRequestException("This booking is not assigned to you");
        }
        return booking;
    }

    private void validateTransition(BookingStatus current, BookingStatus target) {
        boolean valid = switch (target) {
            case ACCEPTED  -> current == BookingStatus.PENDING;
            case REJECTED  -> current == BookingStatus.PENDING;
            case COMPLETED -> current == BookingStatus.ACCEPTED;
            case CANCELLED -> current == BookingStatus.PENDING || current == BookingStatus.ACCEPTED;
            default        -> false;
        };
        if (!valid) {
            throw new BadRequestException(
                    "Cannot transition from " + current + " to " + target);
        }
    }
}
