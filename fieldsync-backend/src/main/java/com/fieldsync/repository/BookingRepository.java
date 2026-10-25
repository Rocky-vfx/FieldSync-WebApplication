package com.fieldsync.repository;

import com.fieldsync.entity.Booking;
import com.fieldsync.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /** All bookings placed by a specific User */
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.helperProfile hp " +
           "JOIN FETCH hp.user " +
           "JOIN FETCH hp.skillCategory " +
           "WHERE b.customer.id = :customerId " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerId(@Param("customerId") Long customerId);

    /** All bookings for a specific Helper */
    @Query("SELECT b FROM Booking b " +
           "JOIN FETCH b.customer " +
           "JOIN FETCH b.helperProfile hp " +
           "JOIN FETCH hp.skillCategory " +
           "WHERE hp.id = :helperProfileId " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findByHelperProfileId(@Param("helperProfileId") Long helperProfileId);

    List<Booking> findByStatus(BookingStatus status);

    long countByStatus(BookingStatus status);

    long count();
}
