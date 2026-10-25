# FieldSync — Implementation Plan & Build Prompt

## 1. Project Summary

FieldSync connects **Users** (people who need work done) with nearby **Helpers**
(daily-wage field workers — painters, carpenters, plumbers, etc.), letting the
User compare helpers by **location, quoted daily wage, rating, and written
reviews** before contacting them. An **Admin** (human or AI agent) oversees
verification, moderation, and disputes.

---

## 2. Roles

| Role | Description |
|---|---|
| **User** | Searches for helpers by skill + location, compares wage/rating/reviews, contacts/books a helper |
| **Helper** | Sets their skill, daily wage, and the specific location/area they want to work in; receives bookings; gets rated and reviewed |
| **Admin** | Verifies helpers, moderates reviews/listings, resolves disputes. Can be a human staff member or an AI agent handling routine checks (e.g. auto-flagging suspicious reviews, auto-verifying documents) |

## 3. Skill Categories (seed data)

Painter, Carpenter, Plumber, Electrician, Mason, Welder, AC/Appliance Repair
Technician, Pest Control Worker, Gardener/Landscaper, House Cleaner/
Housekeeping, Movers/Loaders, Tile/Flooring Worker, Roofer, Glass/Window
Fitter, CCTV/Electronics Installer, Driver, Cook/Catering Help, Security Guard

## 4. Core Features

1. **Auth** — first-time entry is **Google (Gmail) sign-in** for both User and
   Helper (OAuth2), followed by a **personal details & verification** step
   (name, phone, address, and — for Helpers — skill, wage, ID/document
   verification) before the account is active; JWT session after that;
   role-based access
2. **Helper profile** — skill category, daily wage, work location (settable independent of home address), experience, availability toggle
3. **Search/Discovery** — filter by skill + location radius; sort by distance, wage (low→high), or rating
4. **Comparison view** — each result shows wage, distance, rating, review count, verified badge
5. **Ratings & written reviews** — 1–5 stars + comment, tied to a completed booking
6. **Booking/contact flow** — User requests a Helper; Helper accepts/rejects; status tracking
7. **Admin panel** — verify helpers, moderate reviews, view platform stats; AI-agent-assisted moderation as an optional layer on top of human admin

## 5. Tech Stack

**Backend:** Java 17, Spring Boot 3.x, Spring Data JPA (Hibernate), Spring
Security + **OAuth2 Client (Google login)** + JWT (session after OAuth),
PostgreSQL (PostGIS later for geospatial search at scale), Flyway
(migrations), springdoc-openapi (API docs), JUnit 5 + Mockito + Testcontainers

**Frontend:** React + Vite (or Next.js), Tailwind CSS, shadcn/ui components,
Framer Motion (animations/transitions), React Router, Axios + TanStack Query,
Zustand (state), React-Leaflet or Google Maps JS API (map view), Lucide React (icons)

**Design system:** Light theme, fixed icon+label sidebar with active-pill
highlight, rounded white cards (16–20px radius, soft shadow, no hard borders),
colored circular icon badges on stat cards, pill-shaped status tags in tables,
avatar stacks, black primary buttons with one accent color (orange) for
highlights/active states. Motion: fade+slide-up entrances, hover scale on
cards, sliding tab indicator, slide-in modals/toasts.

**Infra (student-budget):** Render/Railway/Fly.io (backend), Supabase/Neon
(managed Postgres + PostGIS), Vercel/Netlify (frontend)

## 6. Database Entities (already scaffolded, `AppUser` to be extended)

`AppUser` (id, fullName, email, phone, passwordHash, role, **googleId,
profileComplete/verified flag**) · `WorkerProfile`
(user, skillCategory, dailyWage, latitude, longitude, experienceYears,
available, verified, averageRating, ratingCount) · `SkillCategory` (name,
description) · `Booking` (customer, workerProfile, requestedDate, status,
notes) · `Review` (booking, rating, comment)

## 7. Build Phases

| Phase | Deliverable |
|---|---|
| **1. Foundation** | Entities, repositories, DB schema, seed skill categories (done) |
| **2. Search** | Nearby-helper search by skill + radius, sorted by distance/wage/rating (done — MVP version) |
| **3. Auth** | Google (Gmail) OAuth2 login for first-time entry, post-login personal-details/verification form, JWT session issuing, role guards |
| **4. Helper self-service** | Helper updates wage, work location, availability, skill |
| **5. Booking flow** | Create booking, Helper accept/reject, status transitions |
| **6. Ratings & Reviews** | Submit review after completed booking; recompute averageRating |
| **7. Admin** | Verify helpers, moderate reviews, dashboard stats; optional AI-agent-assisted checks |
| **8. Frontend** | React app implementing the design system above, wired to all endpoints |
| **9. Polish** | Animations/transitions, responsive layout, deploy |

---

## 8. Complete Build Prompt

Use this as a single prompt (for Claude Code, another AI coding tool, or as
your own spec) to drive full implementation:

```
Build a full-stack web application called FieldSync.

PURPOSE
FieldSync connects Users who need field work done with nearby Helpers who do
daily-wage skilled work (painters, carpenters, plumbers, electricians, etc.).
Users search by skill and location, and compare Helpers by quoted daily wage,
star rating, and written reviews before contacting them.

ROLES
- User: searches for Helpers, views wage/rating/reviews, books a Helper.
- Helper: sets skill category, daily wage, and their own preferred work
  location (independent of home address), toggles availability.
- Admin: verifies Helpers, moderates reviews, resolves disputes. Admin may be
  a human or an AI agent that assists with routine verification/moderation.

SKILL CATEGORIES (seed data)
Painter, Carpenter, Plumber, Electrician, Mason, Welder, AC/Appliance Repair
Technician, Pest Control Worker, Gardener/Landscaper, House Cleaner/
Housekeeping, Movers/Loaders, Tile/Flooring Worker, Roofer, Glass/Window
Fitter, CCTV/Electronics Installer, Driver, Cook/Catering Help, Security Guard

CORE FEATURES
1. Auth: first-time entry for both User and Helper is Google (Gmail)
   sign-in via OAuth2 — no separate password signup. After the first Google
   login, the user is taken through a personal details & verification step:
   full name (prefilled from Google, editable), phone number, address, and
   — for Helpers specifically — skill category, daily wage, work location,
   and an ID/document upload for verification. The account is marked
   "pending verification" until an Admin (or AI-agent-assisted check)
   approves it; Users can browse/search immediately but Helpers must be
   verified before appearing in search results. After this one-time setup,
   returning users just sign in with Google and go straight to their
   dashboard. Issue a JWT session after successful Google auth for
   subsequent API calls. Role-based access control for User/Helper/Admin.
2. Helper profile: skill, daily wage, work location (lat/lng), experience
   years, availability toggle, verified badge.
3. Search: filter Helpers by skill and location radius; sort by distance,
   wage (low to high), or rating.
4. Comparison view: each search result shows name, wage, distance, average
   rating, review count, verified badge.
5. Ratings & reviews: after a booking is completed, the User leaves a 1-5
   star rating plus a written comment; Helper's average rating updates.
6. Booking flow: User requests a Helper for a date; Helper accepts or
   rejects; booking status tracked (pending/accepted/rejected/completed/cancelled).
7. Admin panel: verify Helper accounts, moderate/remove flagged reviews,
   view platform stats (total users, helpers, bookings).

BACKEND
- Java 17, Spring Boot 3.x
- Spring Data JPA + Hibernate, PostgreSQL
- Spring Security with Google OAuth2 login (spring-boot-starter-oauth2-client)
  for first-time authentication, then a JWT session for subsequent requests;
  role guards for User/Helper/Admin
- Post-OAuth verification flow: endpoint to complete/update personal details,
  an account status field (pending/verified/rejected), and an Admin endpoint
  to approve/reject Helper verification (with room for an AI-agent-assisted
  auto-check on submitted documents)
- Flyway for schema migrations
- Distance search: Haversine formula computed in the service layer for MVP
  (upgrade path: PostGIS ST_DWithin/ST_Distance for scale)
- springdoc-openapi for Swagger docs
- REST endpoints for: auth (register/login), helper profile CRUD, search,
  bookings CRUD, reviews CRUD, admin actions
- JUnit 5 + Mockito for tests

FRONTEND
- React + Vite (or Next.js), Tailwind CSS, shadcn/ui components
- Framer Motion for animation/transitions
- React Router, Axios + TanStack Query for API calls, Zustand for state
- React-Leaflet or Google Maps JS API for a map view of nearby helpers
- Lucide React icons

DESIGN SYSTEM
Light theme. Fixed left sidebar with icon+label navigation and an
active-item highlight pill. Top bar with search input, notification bell,
settings icon, user avatar. Main content area uses rounded white cards
(16-20px border radius, soft drop shadow, no hard borders); stat cards have
a small colored circular icon badge. Tables use colored pill-shaped status
tags, avatar stacks for people, and icon-only row actions that appear on
hover. Pill-shaped segmented tabs for filters, with a sliding active
indicator. Black primary buttons; one accent color (orange) for highlights
and active states. Bold headings, muted-gray secondary text. Apply this
design system consistently across the User search/browse view, Helper
profile cards, booking tables, and the Admin dashboard.

MOTION
Page and card entrances fade in and slide up (150-250ms, ease-out). Sidebar
nav items transition background color smoothly on hover/active. Stat cards
scale slightly (1.02) on hover. Table rows highlight with a subtle
background transition on hover. Modals and drawers slide in with a backdrop
fade. Buttons have a subtle press/scale-down on click. Tab switches animate
the active-pill position like a sliding indicator. Toast notifications slide
in from the top-right and auto-dismiss with a fade.

BUILD ORDER
1. Database entities, migrations, seed skill categories
2. Search endpoint (skill + location + radius, sortable)
3. Auth (Google OAuth2 login, post-login verification/details step, JWT session, role guards)
4. Helper self-service endpoints
5. Booking flow endpoints
6. Ratings & reviews endpoints
7. Admin endpoints
8. Frontend implementing the design system above, wired to all endpoints
9. Animations/transitions, responsive polish, deployment

Deploy target: Render/Railway/Fly.io for backend, Supabase/Neon (Postgres)
for database, Vercel/Netlify for frontend.
```

---

## Notes

- This plan builds directly on the Spring Boot skeleton already scaffolded
  (entities, repositories, and the search endpoint from Phase 1–2 are done).
- You said not to start building the website yet — this document is the plan
  and prompt only. Say the word when you want implementation to resume, and
  we can pick up at Phase 3 (Auth) or wherever you'd like to start.
