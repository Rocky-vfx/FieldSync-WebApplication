-- ============================================================
-- V1: Initial schema for FieldSync
-- ============================================================

-- Skill categories lookup
CREATE TABLE skill_categories (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    icon_name   VARCHAR(50)
);

-- Users (all roles)
CREATE TABLE app_users (
    id               BIGSERIAL    PRIMARY KEY,
    full_name        VARCHAR(255) NOT NULL,
    email            VARCHAR(255) NOT NULL UNIQUE,
    phone            VARCHAR(20),
    address          VARCHAR(500),
    google_id        VARCHAR(255) UNIQUE,
    avatar_url       VARCHAR(500),
    role             VARCHAR(20)  NOT NULL DEFAULT 'USER',
    account_status   VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    profile_complete BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_users_email     ON app_users(email);
CREATE INDEX idx_app_users_google_id ON app_users(google_id);

-- Helper profiles
CREATE TABLE helper_profiles (
    id                BIGSERIAL      PRIMARY KEY,
    user_id           BIGINT         NOT NULL UNIQUE REFERENCES app_users(id),
    skill_category_id BIGINT         NOT NULL REFERENCES skill_categories(id),
    daily_wage        NUMERIC(10, 2) NOT NULL,
    latitude          DOUBLE PRECISION NOT NULL,
    longitude         DOUBLE PRECISION NOT NULL,
    work_location_name VARCHAR(255),
    experience_years  INTEGER        DEFAULT 0,
    available         BOOLEAN        NOT NULL DEFAULT TRUE,
    verified          BOOLEAN        NOT NULL DEFAULT FALSE,
    average_rating    NUMERIC(3, 2)  DEFAULT 0.00,
    rating_count      INTEGER        DEFAULT 0,
    document_url      VARCHAR(500),
    bio               VARCHAR(500),
    created_at        TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_helper_skill    ON helper_profiles(skill_category_id);
CREATE INDEX idx_helper_location ON helper_profiles(latitude, longitude);

-- Bookings
CREATE TABLE bookings (
    id                 BIGSERIAL    PRIMARY KEY,
    customer_id        BIGINT       NOT NULL REFERENCES app_users(id),
    helper_profile_id  BIGINT       NOT NULL REFERENCES helper_profiles(id),
    requested_date     DATE         NOT NULL,
    status             VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    notes              VARCHAR(1000),
    work_address       VARCHAR(500),
    created_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_customer ON bookings(customer_id);
CREATE INDEX idx_booking_helper   ON bookings(helper_profile_id);
CREATE INDEX idx_booking_status   ON bookings(status);

-- Reviews
CREATE TABLE reviews (
    id                BIGSERIAL     PRIMARY KEY,
    booking_id        BIGINT        NOT NULL UNIQUE REFERENCES bookings(id),
    reviewer_id       BIGINT        NOT NULL REFERENCES app_users(id),
    helper_profile_id BIGINT        NOT NULL REFERENCES helper_profiles(id),
    rating            INTEGER       NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment           VARCHAR(2000),
    flagged           BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_review_helper  ON reviews(helper_profile_id);
CREATE INDEX idx_review_booking ON reviews(booking_id);
