package com.fieldsync.service;

import com.fieldsync.dto.SearchResultDTO;
import com.fieldsync.entity.HelperProfile;
import com.fieldsync.mapper.DtoMapper;
import com.fieldsync.repository.HelperProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/**
 * Search service — finds verified, available helpers by skill within
 * a given radius using the Haversine formula for distance calculation.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    private final HelperProfileRepository helperProfileRepository;

    /**
     * Search for helpers by skill within a radius of the given coordinates.
     *
     * @param skillCategoryId  skill to filter by
     * @param lat              search origin latitude
     * @param lng              search origin longitude
     * @param radiusKm         max distance in kilometres
     * @param sortBy           "distance" (default), "wage", or "rating"
     * @return list of matching helpers with computed distance
     */
    public List<SearchResultDTO> searchHelpers(Long skillCategoryId,
                                                double lat,
                                                double lng,
                                                double radiusKm,
                                                String sortBy) {

        List<HelperProfile> helpers = helperProfileRepository
                .findVerifiedAvailableBySkill(skillCategoryId);

        // Compute distance and filter by radius
        List<SearchResultDTO> results = helpers.stream()
                .map(hp -> {
                    double distance = haversine(lat, lng, hp.getLatitude(), hp.getLongitude());
                    return DtoMapper.toSearchResult(hp, distance);
                })
                .filter(dto -> dto.getDistanceKm() <= radiusKm)
                .toList();

        // Sort
        Comparator<SearchResultDTO> comparator = switch (sortBy != null ? sortBy.toLowerCase() : "distance") {
            case "wage"   -> Comparator.comparing(SearchResultDTO::getDailyWage);
            case "rating" -> Comparator.comparing(SearchResultDTO::getAverageRating).reversed();
            default       -> Comparator.comparing(SearchResultDTO::getDistanceKm);
        };

        return results.stream()
                .sorted(comparator)
                .toList();
    }

    /**
     * Haversine formula — computes the great-circle distance in km
     * between two (lat, lng) coordinate pairs.
     */
    public static double haversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}
