package com.fieldsync.config;

import com.fieldsync.entity.*;
import com.fieldsync.enums.AccountStatus;
import com.fieldsync.enums.BookingStatus;
import com.fieldsync.enums.Role;
import com.fieldsync.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

/**
 * Initializes reference data and demo records if the database is empty.
 * Runs seamlessly on both PostgreSQL and H2.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SkillCategoryRepository skillCategoryRepository;
    private final AppUserRepository appUserRepository;
    private final HelperProfileRepository helperProfileRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedSkillCategoriesIfEmpty();
        seedAdminAndDemoUsersIfEmpty();
    }

    private void seedSkillCategoriesIfEmpty() {
        if (skillCategoryRepository.count() > 0) {
            log.info("Skill categories already seeded ({} found)", skillCategoryRepository.count());
            return;
        }

        log.info("Seeding 18 standard skill categories...");
        List<SkillCategory> categories = List.of(
            SkillCategory.builder().name("Painter").description("Interior and exterior painting services").iconName("paintbrush").build(),
            SkillCategory.builder().name("Carpenter").description("Woodwork, furniture repair, and carpentry").iconName("hammer").build(),
            SkillCategory.builder().name("Plumber").description("Pipe fitting, leak repair, and drainage work").iconName("wrench").build(),
            SkillCategory.builder().name("Electrician").description("Electrical wiring, repair, and installation").iconName("zap").build(),
            SkillCategory.builder().name("Mason").description("Brickwork, plastering, and masonry construction").iconName("brick-wall").build(),
            SkillCategory.builder().name("Welder").description("Metal welding and fabrication").iconName("flame").build(),
            SkillCategory.builder().name("AC/Appliance Repair Technician").description("AC servicing, fridge, washing machine repair").iconName("thermometer").build(),
            SkillCategory.builder().name("Pest Control Worker").description("Termite, rodent, and pest extermination").iconName("bug").build(),
            SkillCategory.builder().name("Gardener/Landscaper").description("Garden maintenance, landscaping, and lawn care").iconName("flower-2").build(),
            SkillCategory.builder().name("House Cleaner/Housekeeping").description("Home cleaning, deep cleaning, and sanitisation").iconName("sparkles").build(),
            SkillCategory.builder().name("Movers/Loaders").description("Packing, loading, and moving services").iconName("truck").build(),
            SkillCategory.builder().name("Tile/Flooring Worker").description("Tile laying, flooring installation and repair").iconName("grid-3x3").build(),
            SkillCategory.builder().name("Roofer").description("Roof repair, waterproofing, and installation").iconName("home").build(),
            SkillCategory.builder().name("Glass/Window Fitter").description("Glass cutting, window fitting, and mirror work").iconName("panel-top").build(),
            SkillCategory.builder().name("CCTV/Electronics Installer").description("CCTV, intercom, and electronics installation").iconName("camera").build(),
            SkillCategory.builder().name("Driver").description("Personal, commercial, and delivery driving").iconName("car").build(),
            SkillCategory.builder().name("Cook/Catering Help").description("Cooking, catering, and food preparation").iconName("chef-hat").build(),
            SkillCategory.builder().name("Security Guard").description("Property and event security services").iconName("shield").build()
        );

        skillCategoryRepository.saveAll(categories);
        log.info("Successfully seeded 18 skill categories.");
    }

    private void seedAdminAndDemoUsersIfEmpty() {
        if (appUserRepository.count() > 0) {
            log.info("Users already present in database ({} found)", appUserRepository.count());
            return;
        }

        log.info("Seeding default admin and demo personas...");

        // 1. Admin
        AppUser admin = AppUser.builder()
                .fullName("FieldSync Admin")
                .email("admin@fieldsync.com")
                .role(Role.ADMIN)
                .accountStatus(AccountStatus.VERIFIED)
                .profileComplete(true)
                .phone("+91 98800 00000")
                .address("FieldSync HQ, Indiranagar, Bengaluru")
                .build();
        appUserRepository.save(admin);

        // 2. Demo Customer User
        AppUser customer = AppUser.builder()
                .fullName("Rahul Sharma")
                .email("rahul.sharma@gmail.com")
                .role(Role.USER)
                .accountStatus(AccountStatus.VERIFIED)
                .profileComplete(true)
                .phone("+91 98450 12345")
                .address("Flat 402, Green Glen Layout, Bellandur, Bengaluru")
                .build();
        appUserRepository.save(customer);

        // Map categories by name for easy reference
        Map<String, SkillCategory> skillMap = new HashMap<>();
        skillCategoryRepository.findAll().forEach(sc -> skillMap.put(sc.getName(), sc));

        // 3. Demo Helpers
        createHelper(
                "Ramesh Kumar", "ramesh.kumar@gmail.com", "+91 98201 11223",
                "Koramangala 4th Block, Bengaluru", skillMap.get("Painter"),
                new BigDecimal("850.00"), 12.9352, 77.6245, "Koramangala & HSR",
                9, true, true, new BigDecimal("4.85"), 28,
                "Professional master painter with 9+ years experience. Asian Paints certified specialist in waterproofing, stencil design, and interior emulsion.",
                customer
        );

        createHelper(
                "Suresh M.", "suresh.carpenter@gmail.com", "+91 97401 22334",
                "HSR Layout Sector 2, Bengaluru", skillMap.get("Carpenter"),
                new BigDecimal("950.00"), 12.9121, 77.6446, "HSR Layout & BTM",
                12, true, true, new BigDecimal("4.90"), 42,
                "Bespoke woodwork, modular kitchen hinge replacements, custom cabinets, and structural timber repairs.",
                null
        );

        createHelper(
                "Rajesh Verma", "rajesh.plumbing@gmail.com", "+91 98860 33445",
                "BTM Layout 2nd Stage, Bengaluru", skillMap.get("Plumber"),
                new BigDecimal("750.00"), 12.9166, 77.6101, "BTM & Bannerghatta Road",
                6, true, true, new BigDecimal("4.75"), 19,
                "Rapid leak diagnostics, bathroom sanitary fittings, pressure pump installation, and underground drainage clearing.",
                null
        );

        createHelper(
                "Anita Sharma", "anita.electrical@gmail.com", "+91 99001 44556",
                "Indiranagar 100ft Road, Bengaluru", skillMap.get("Electrician"),
                new BigDecimal("900.00"), 12.9719, 77.6412, "Indiranagar & Domlur",
                8, true, true, new BigDecimal("4.92"), 35,
                "Licensed wireman. DB box rewiring, inverter battery setup, 3-phase load balancing, and smart home lighting installations.",
                null
        );

        createHelper(
                "Vikram Singh", "vikram.mason@gmail.com", "+91 98111 55667",
                "Marathahalli Bridge, Bengaluru", skillMap.get("Mason"),
                new BigDecimal("800.00"), 12.9591, 77.6974, "Marathahalli & Whitefield",
                10, true, true, new BigDecimal("4.70"), 15,
                "Bricklaying, terrace tile grouting, wall crack treatment, compound wall construction, and cement plastering.",
                null
        );

        // Pending helper (for Admin review demo)
        createHelper(
                "Deepak Yadav", "deepak.welder@gmail.com", "+91 98451 66778",
                "Electronic City Phase 1, Bengaluru", skillMap.get("Welder"),
                new BigDecimal("850.00"), 12.8452, 77.6602, "Electronic City & Bommanahalli",
                5, true, false, BigDecimal.ZERO, 0,
                "Arc welding, MS safety grill fabrication, sliding gate fabrication, and metal staircase repair.",
                null
        );

        log.info("Demo users and helpers seeded successfully.");
    }

    private void createHelper(String name, String email, String phone, String address,
                              SkillCategory skill, BigDecimal wage, double lat, double lng,
                              String locationName, int exp, boolean available, boolean verified,
                              BigDecimal rating, int ratingCount, String bio, AppUser reviewer) {
        if (skill == null) return;

        AppUser helperUser = AppUser.builder()
                .fullName(name)
                .email(email)
                .phone(phone)
                .address(address)
                .role(Role.HELPER)
                .accountStatus(verified ? AccountStatus.VERIFIED : AccountStatus.PENDING)
                .profileComplete(true)
                .build();
        appUserRepository.save(helperUser);

        HelperProfile profile = HelperProfile.builder()
                .user(helperUser)
                .skillCategory(skill)
                .dailyWage(wage)
                .latitude(lat)
                .longitude(lng)
                .workLocationName(locationName)
                .experienceYears(exp)
                .available(available)
                .verified(verified)
                .averageRating(rating)
                .ratingCount(ratingCount)
                .bio(bio)
                .documentUrl("https://fieldsync.internal/docs/aadhaar_" + helperUser.getId() + ".pdf")
                .build();
        helperProfileRepository.save(profile);

        // If reviewer provided, add a sample completed booking & review
        if (reviewer != null && verified) {
            Booking booking = Booking.builder()
                    .customer(reviewer)
                    .helperProfile(profile)
                    .requestedDate(LocalDate.now().minusDays(3))
                    .status(BookingStatus.COMPLETED)
                    .notes("Full 3BHK living room repaint with Asian Paints Royale Luxury.")
                    .workAddress(reviewer.getAddress())
                    .build();
            bookingRepository.save(booking);

            Review review = Review.builder()
                    .booking(booking)
                    .reviewer(reviewer)
                    .helperProfile(profile)
                    .rating(5)
                    .comment("Ramesh did an outstanding job! He was prompt at 8:30 AM, masked all baseboards, and left no drips on the flooring. Highly recommended.")
                    .flagged(false)
                    .build();
            reviewRepository.save(review);
        }
    }
}
