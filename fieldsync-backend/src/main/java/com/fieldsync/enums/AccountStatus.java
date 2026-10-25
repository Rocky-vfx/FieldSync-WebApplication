package com.fieldsync.enums;

/**
 * Account verification status.
 * Users start as PENDING after Google sign-in until profile is complete.
 * Helpers remain PENDING until Admin approves verification.
 */
public enum AccountStatus {
    PENDING,
    VERIFIED,
    REJECTED
}
