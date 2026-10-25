# FieldSync-WebApplication
FieldSync — A full-stack platform connecting users with nearby daily-wage field workers (painters, plumbers, electricians &amp; more). Search by skill &amp; location, compare by wage, rating &amp; reviews, book helpers, and manage verifications via an admin panel. Built with Spring Boot &amp; React.
## 📖 About

**FieldSync** is a marketplace web application that bridges the gap between people who need skilled field work done and daily-wage workers in their area. Users can search for helpers by skill category and location, compare them by wage, star rating, and written reviews, then book them directly through the platform.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Google OAuth2 Login** | Sign in with Gmail — no passwords needed |
| 🔍 **Skill + Location Search** | Find nearby helpers filtered by trade and radius |
| 📊 **Comparison View** | See wage, distance, rating, and verified badge side by side |
| 📅 **Booking Flow** | Request a helper; helper accepts or rejects; status tracking |
| ⭐ **Ratings & Reviews** | Leave a 1–5 star rating + comment after a completed booking |
| 🛡️ **Admin Panel** | Verify helpers, moderate reviews, view platform stats |
| 🗺️ **Map View** | Browse nearby helpers on an interactive Leaflet map |
| 🔒 **Role-Based Access** | Separate flows for Users, Helpers, and Admins |

### Supported Skill Categories
`Painter` · `Carpenter` · `Plumber` · `Electrician` · `Mason` · `Welder` · `AC/Appliance Repair` · `Pest Control` · `Gardener` · `House Cleaner` · `Movers/Loaders` · `Tile/Flooring Worker` · `Roofer` · `Glass/Window Fitter` · `CCTV Installer` · `Driver` · `Cook/Catering` · `Security Guard`

---

## 🏗️ Tech Stack

### Backend (`fieldsync-backend/`)
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 3.3.4 | Application framework |
| Spring Security | — | Auth & role guards |
| Spring OAuth2 Client | — | Google login |
| JJWT | 0.12.6 | JWT session after OAuth |
| Spring Data JPA / Hibernate | — | ORM |
| PostgreSQL | — | Primary database |
| Flyway | — | Database migrations |
| Lombok | 1.18.38 | Boilerplate reduction |
| springdoc-openapi | 2.6.0 | Swagger API docs |
| H2 | — | In-memory DB for tests |

### Frontend (`fieldsync-frontend/`)
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Leaflet | 5 | Interactive maps |
| Lucide React | — | Icon library |
| canvas-confetti | — | Celebration animations |

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** — [Download](https://adoptium.net/)
- **Maven** (or use the included `mvnw` wrapper)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **PostgreSQL** running locally on port `5432`
- A **Google Cloud** project with OAuth2 credentials

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/FieldSync-WebApplication.git
cd FieldSync-WebApplication
```

---

### 2. Backend Setup

#### Create the PostgreSQL database

```sql
CREATE DATABASE fieldsync;
```

#### Configure environment variables

Create `fieldsync-backend/src/main/resources/application-local.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fieldsync
    username: postgres
    password: your_password
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET

app:
  jwt:
    secret: your-very-long-secret-key-at-least-256-bits
```

#### Run the backend

```bash
cd fieldsync-backend
./mvnw spring-boot:run
```

The backend starts at **http://localhost:8080**  
Swagger UI available at **http://localhost:8080/swagger-ui.html**

---

### 3. Frontend Setup

```bash
cd fieldsync-frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

---

## 🌍 Deployment

| Component | Platform | Notes |
|---|---|---|
| Frontend (React/Vite) | **Vercel** | Auto-deploys on push; set `VITE_API_BASE_URL` env var |
| Backend (Spring Boot) | **Render / Railway / Fly.io** | Set env vars for DB, JWT, Google OAuth |
| Database | **Supabase / Neon** | Managed PostgreSQL with connection pooling |

### Environment Variables (Production)

#### Backend
```
DATABASE_URL=jdbc:postgresql://...
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
```

#### Frontend (Vercel)
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 📁 Project Structure

```
FieldSync-WebApplication/
├── fieldsync-backend/               # Spring Boot REST API
│   └── src/main/java/com/fieldsync/
│       ├── config/                  # Security, CORS, data seeding
│       ├── controller/              # REST controllers
│       ├── dto/                     # Request/Response DTOs
│       ├── entity/                  # JPA entities
│       ├── exception/               # Global exception handling
│       ├── repository/              # Spring Data repositories
│       ├── security/                # JWT filter, OAuth2 handler
│       └── service/                 # Business logic
│
└── fieldsync-frontend/              # React + Vite frontend
    └── src/
        ├── components/              # Reusable UI components
        ├── pages/                   # Route-level pages
        ├── hooks/                   # Custom React hooks
        └── utils/                   # Helper utilities
```

---

## 🗄️ Database Schema

```
AppUser         — id, fullName, email, phone, role, googleId, verified
HelperProfile   — user, skillCategory, dailyWage, latitude, longitude,
                  experienceYears, available, verified, avgRating
SkillCategory   — id, name, description
Booking         — customer, helperProfile, requestedDate, status, notes
Review          — booking, rating (1-5), comment
```

---

## 📜 API Docs

Once the backend is running, visit:

> **http://localhost:8080/swagger-ui.html**

---
