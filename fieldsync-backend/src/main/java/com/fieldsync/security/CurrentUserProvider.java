package com.fieldsync.security;

import com.fieldsync.entity.AppUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility to get the currently authenticated AppUser from the SecurityContext.
 */
@Component
public class CurrentUserProvider {

    /**
     * Returns the authenticated AppUser or throws if not authenticated.
     */
    public AppUser getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AppUser)) {
            throw new IllegalStateException("No authenticated user found");
        }
        return (AppUser) auth.getPrincipal();
    }

    /**
     * Returns the authenticated user's ID.
     */
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
