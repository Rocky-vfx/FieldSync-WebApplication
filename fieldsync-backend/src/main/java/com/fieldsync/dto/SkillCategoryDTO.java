package com.fieldsync.dto;

import lombok.*;

/**
 * DTO for skill category lookup data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String iconName;
}
