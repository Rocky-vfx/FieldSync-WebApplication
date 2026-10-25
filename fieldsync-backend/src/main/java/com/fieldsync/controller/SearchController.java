package com.fieldsync.controller;

import com.fieldsync.dto.SearchResultDTO;
import com.fieldsync.dto.SkillCategoryDTO;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.SkillCategoryRepository;
import com.fieldsync.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public search endpoints — no authentication required.
 */
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Find helpers by skill and location")
public class SearchController {

    private final SearchService searchService;
    private final SkillCategoryRepository skillCategoryRepository;

    /**
     * Search for helpers by skill within a radius.
     *
     * @param skillId   skill category ID to filter by
     * @param lat       search origin latitude
     * @param lng       search origin longitude
     * @param radius    max distance in km (default 25)
     * @param sort      "distance" (default), "wage", or "rating"
     */
    @GetMapping("/helpers")
    @Operation(summary = "Search helpers by skill and location radius")
    public ResponseEntity<List<SearchResultDTO>> searchHelpers(
            @RequestParam(required = false) Long skillId,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25") double radius,
            @RequestParam(defaultValue = "distance") String sort) {

        List<SearchResultDTO> results = searchService.searchHelpers(skillId, lat, lng, radius, sort);
        return ResponseEntity.ok(results);
    }

    /**
     * List all skill categories (for search filter dropdowns).
     */
    @GetMapping("/skills")
    @Operation(summary = "List all skill categories")
    public ResponseEntity<List<SkillCategoryDTO>> listSkills() {
        List<SkillCategoryDTO> skills = skillCategoryRepository.findAll()
                .stream()
                .map(DtoMapper::toDto)
                .toList();
        return ResponseEntity.ok(skills);
    }
}
