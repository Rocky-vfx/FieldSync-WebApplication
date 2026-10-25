package com.fieldsync.security;

import com.fieldsync.entity.AppUser;
import com.fieldsync.enums.AccountStatus;
import com.fieldsync.enums.Role;
import com.fieldsync.repository.AppUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Handles successful Google OAuth2 login.
 * - If the user is new, creates an AppUser record with PENDING status.
 * - Issues a JWT and redirects to the frontend with the token.
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AppUserRepository appUserRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /** Frontend URL — the React app will read the token from the URL params */
    private static final String FRONTEND_REDIRECT = "http://localhost:5173/oauth2/callback";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String googleId = oAuth2User.getAttribute("sub");
        String email    = oAuth2User.getAttribute("email");
        String name     = oAuth2User.getAttribute("name");
        String avatar   = oAuth2User.getAttribute("picture");

        // Find or create user
        AppUser user = appUserRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    AppUser newUser = AppUser.builder()
                            .googleId(googleId)
                            .email(email)
                            .fullName(name != null ? name : "")
                            .avatarUrl(avatar)
                            .role(Role.USER)  // default role; changed during profile setup
                            .accountStatus(AccountStatus.PENDING)
                            .profileComplete(false)
                            .build();
                    return appUserRepository.save(newUser);
                });

        // Update avatar URL in case it changed
        if (avatar != null && !avatar.equals(user.getAvatarUrl())) {
            user.setAvatarUrl(avatar);
            appUserRepository.save(user);
        }

        // Issue JWT
        String token = jwtTokenProvider.generateToken(
                user.getId(), user.getEmail(), user.getRole().name());

        // Redirect to frontend with token and profile status
        String redirectUrl = FRONTEND_REDIRECT
                + "?token=" + token
                + "&profileComplete=" + user.isProfileComplete()
                + "&newUser=" + !user.isProfileComplete();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
