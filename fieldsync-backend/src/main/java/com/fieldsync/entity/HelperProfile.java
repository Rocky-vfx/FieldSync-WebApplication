package com.fieldsync.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A Helper's professional profile — skill, wage, work location, etc.
 * One-to-one with AppUser (role = HELPER).
 * Only profiles with verified = true AND available = true appear in search results.
 */
@Entity
@Table(name = "helper_profiles", indexes = {
        @Index(name = "idx_helper_skill", columnList = "skill_category_id"),
        @Index(name = "idx_helper_location", columnList = "latitude, longitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HelperProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user account this profile belongs to */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private AppUser user;

    /** Primary skill/trade */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_category_id", nullable = false)
    private SkillCategory skillCategory;

    /** Quoted daily wage in INR */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyWage;

    /**
     * Work location — the area where the Helper prefers to take jobs.
     * Independent of their home address.
     */
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    /** Human-readable name for the work location (e.g. "Koramangala, Bangalore") */
    private String workLocationName;

    @Builder.Default
    private Integer experienceYears = 0;

    /** Helper can toggle availability on/off */
    @Builder.Default
    private boolean available = true;

    /** Set to true after Admin verification */
    @Builder.Default
    private boolean verified = false;

    /** Running average star rating (1.0 – 5.0) */
    @Builder.Default
    @Column(precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    /** Total number of ratings received */
    @Builder.Default
    private Integer ratingCount = 0;

    /** URL / path to uploaded ID document for verification */
    private String documentUrl;

    /** Short bio or description */
    @Column(length = 500)
    private String bio;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
