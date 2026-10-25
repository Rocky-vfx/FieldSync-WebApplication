-- ============================================================
-- V3: Seed a default admin account (H2-compatible)
-- ============================================================

INSERT INTO app_users (full_name, email, role, account_status, profile_complete)
VALUES ('FieldSync Admin', 'admin@fieldsync.com', 'ADMIN', 'VERIFIED', TRUE);
