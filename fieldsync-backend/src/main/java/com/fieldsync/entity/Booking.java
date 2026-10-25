package com.fieldsync.entity;

import com.fieldsync.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A booking request from a User to a Helper.
 *
 * Lifecycle: PENDING → ACCEPTED | REJECTED | CANCELLED
 *            ACCEPTED → COMPLETED | CANCELLED
 */
@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_customer", columnList = "customer_id"),
        @Index(name = "idx_booking_helper", columnList = "helper_profile_id"),
        @Index(name = "idx_booking_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The User who is requesting the service */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private AppUser customer;

    /** The Helper being booked */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_profile_id", nullable = false)
    private HelperProfile helperProfile;

    /** Date the work is requested for */
    @Column(nullable = false)
    private LocalDate requestedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    /** Optional notes from the User describing the work */
    @Column(length = 1000)
    private String notes;

    /** Address/location where the work should be done */
    private String workAddress;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
