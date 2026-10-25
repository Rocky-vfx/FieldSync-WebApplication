package com.fieldsync.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Lookup table for field-work skill categories.
 * Seeded via Flyway migration V2.
 */
@Entity
@Table(name = "skill_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    /** Lucide icon name for frontend rendering (e.g. "paintbrush", "wrench") */
    private String iconName;
}
