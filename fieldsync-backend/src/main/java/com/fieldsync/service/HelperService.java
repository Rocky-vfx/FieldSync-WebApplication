package com.fieldsync.service;

import com.fieldsync.dto.HelperProfileDTO;
import com.fieldsync.dto.UpdateHelperProfileRequest;
import com.fieldsync.entity.AppUser;
import com.fieldsync.entity.HelperProfile;
import com.fieldsync.entity.SkillCategory;
import com.fieldsync.exception.ResourceNotFoundException;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.HelperProfileRepository;
import com.fieldsync.repository.SkillCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Helper self-service profile operations.
 */
@Service
@RequiredArgsConstructor
public class HelperService {

    private final HelperProfileRepository helperProfileRepository;
    private final SkillCategoryRepository skillCategoryRepository;

    /**
     * Get a helper profile by its ID (public view).
     */
    @Transactional(readOnly = true)
    public HelperProfileDTO getHelperProfile(Long helperProfileId) {
        HelperProfile hp = helperProfileRepository.findById(helperProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("HelperProfile", "id", helperProfileId));
        return DtoMapper.toDto(hp);
    }

    /**
     * Get the current Helper's own profile.
     */
    @Transactional(readOnly = true)
    public HelperProfileDTO getMyProfile(AppUser user) {
        HelperProfile hp = helperProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HelperProfile", "userId", user.getId()));
        return DtoMapper.toDto(hp);
    }

    /**
     * Update the current Helper's profile fields.
     */
    @Transactional
    public HelperProfileDTO updateProfile(AppUser user, UpdateHelperProfileRequest req) {
        HelperProfile hp = helperProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HelperProfile", "userId", user.getId()));

        if (req.getSkillCategoryId() != null) {
            SkillCategory skill = skillCategoryRepository.findById(req.getSkillCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "SkillCategory", "id", req.getSkillCategoryId()));
            hp.setSkillCategory(skill);
        }
        if (req.getDailyWage() != null) {
            hp.setDailyWage(req.getDailyWage());
        }
        if (req.getLatitude() != null && req.getLongitude() != null) {
            hp.setLatitude(req.getLatitude());
            hp.setLongitude(req.getLongitude());
        }
        if (req.getWorkLocationName() != null) {
            hp.setWorkLocationName(req.getWorkLocationName());
        }
        if (req.getExperienceYears() != null) {
            hp.setExperienceYears(req.getExperienceYears());
        }
        if (req.getBio() != null) {
            hp.setBio(req.getBio());
        }

        helperProfileRepository.save(hp);
        return DtoMapper.toDto(hp);
    }

    /**
     * Toggle the Helper's availability.
     */
    @Transactional
    public HelperProfileDTO toggleAvailability(AppUser user) {
        HelperProfile hp = helperProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "HelperProfile", "userId", user.getId()));
        hp.setAvailable(!hp.isAvailable());
        helperProfileRepository.save(hp);
        return DtoMapper.toDto(hp);
    }
}
