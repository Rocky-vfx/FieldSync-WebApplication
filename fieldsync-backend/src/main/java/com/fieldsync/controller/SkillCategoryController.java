package com.fieldsync.controller;

import com.fieldsync.dto.SkillCategoryDTO;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.SkillCategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Skill Categories lookup endpoint.
 */
@RestController
@RequestMapping("/api/skill-categories")
@RequiredArgsConstructor
@Tag(name = "Skill Categories", description = "Skill category reference list")
public class SkillCategoryController {

    private final SkillCategoryRepository skillCategoryRepository;

    /**
     * Get all active skill categories.
     */
    @GetMapping
    @Operation(summary = "List all skill categories")
    public ResponseEntity<List<SkillCategoryDTO>> getAllSkills() {
        List<SkillCategoryDTO> skills = skillCategoryRepository.findAll()
                .stream()
                .map(DtoMapper::toDto)
                .toList();
        return ResponseEntity.ok(skills);
    }

    /**
     * Get a specific skill category by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get skill category by ID")
    public ResponseEntity<SkillCategoryDTO> getSkillById(@PathVariable Long id) {
        return skillCategoryRepository.findById(id)
                .map(DtoMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
