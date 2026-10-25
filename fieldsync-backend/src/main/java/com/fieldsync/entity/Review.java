package com.fieldsync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * A 1–5 star rating plus written comment left by a User
 * after a booking is completed. One review per booking.
 */
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_helper", columnList = "helper_profile_id"),
        @Index(name = "idx_review_booking", columnList = "booking_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The completed booking this review is for — one review per booking */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    /** The User who wrote the review */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private AppUser reviewer;

    /** The Helper being reviewed */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_profile_id", nullable = false)
    private HelperProfile helperProfile;

    /** Star rating 1–5 */
    @Column(nullable = false)
    private Integer rating;

    /** Written review comment */
    @Column(length = 2000)
    private String comment;

    /** Flagged for Admin moderation */
    @Builder.Default
    private boolean flagged = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
