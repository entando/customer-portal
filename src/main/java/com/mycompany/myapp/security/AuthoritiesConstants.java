package com.mycompany.myapp.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String CUSTOMER = "ROLE_CUSTOMER";

    public static final String PARTNER = "ROLE_PARTNER";

    public static final String SUPPORT = "ROLE_SUPPORT";

    public static final String HAS_ADMIN_OR_SUPPORT = "hasAnyRole('" + ADMIN + "', '" + SUPPORT + "')";

    public static final String HAS_CUSTOMER_OR_PARTNER = "hasAnyRole('" + CUSTOMER + "', '" + PARTNER + "')";

    public static final String HAS_ANY_PORTAL_ROLE = "hasAnyRole('" + ADMIN + "', '" + SUPPORT + "', '" + PARTNER + "', '" + CUSTOMER + "')";

    private AuthoritiesConstants() {
    }

}
