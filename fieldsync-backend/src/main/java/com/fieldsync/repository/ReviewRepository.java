package com.fieldsync.repository;

import com.fieldsync.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** All reviews for a helper, newest first */
    @Query("SELECT r FROM Review r " +
           "JOIN FETCH r.reviewer " +
           "WHERE r.helperProfile.id = :helperProfileId " +
           "ORDER BY r.createdAt DESC")
    List<Review> findByHelperProfileId(@Param("helperProfileId") Long helperProfileId);

    /** Check if a review already exists for a booking */
    boolean existsByBookingId(Long bookingId);

    Optional<Review> findByBookingId(Long bookingId);

    /** All flagged reviews for Admin moderation */
    List<Review> findByFlaggedTrue();

    long count();
}
