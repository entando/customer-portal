package com.entando.customerportal.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;

public class AuthoritiesUtil {

    private static final List<String> ADMIN_OR_SUPPORT = Arrays.asList(AuthoritiesConstants.ADMIN, AuthoritiesConstants.SUPPORT);

    public static boolean isCurrentUserAdminOrSupport() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
            .anyMatch(item -> ADMIN_OR_SUPPORT.contains(item.getAuthority()));
    }
}
