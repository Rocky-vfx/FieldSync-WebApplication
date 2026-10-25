package com.fieldsync.repository;

import com.fieldsync.entity.HelperProfile;
import com.fieldsync.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HelperProfileRepository extends JpaRepository<HelperProfile, Long> {

    Optional<HelperProfile> findByUser(AppUser user);

    Optional<HelperProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    /** Find all verified and available helpers (optionally filtered by skill) */
    @Query("SELECT hp FROM HelperProfile hp " +
           "JOIN FETCH hp.user " +
           "JOIN FETCH hp.skillCategory " +
           "WHERE (:skillId IS NULL OR hp.skillCategory.id = :skillId) " +
           "AND hp.verified = true " +
           "AND hp.available = true")
    List<HelperProfile> findVerifiedAvailableBySkill(@Param("skillId") Long skillId);

    /** Find all helpers pending verification (for Admin panel) */
    List<HelperProfile> findByVerifiedFalse();

    long countByVerifiedTrue();
}
