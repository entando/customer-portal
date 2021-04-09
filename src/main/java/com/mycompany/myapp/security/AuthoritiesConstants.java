package com.mycompany.myapp.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "cp-admin";

    public static final String CUSTOMER = "cp-customer";

    public static final String PARTNER = "cp-partner";

    public static final String SUPPORT = "cp-support";

    public static final String HAS_ADMIN_OR_SUPPORT = "hasAnyAuthority('" + ADMIN + "', '" + SUPPORT + "')";

    public static final String HAS_CUSTOMER_OR_PARTNER = "hasAnyAuthority('" + CUSTOMER + "', '" + PARTNER + "')";

    public static final String HAS_ANY_PORTAL_ROLE = "hasAnyAuthority('" + ADMIN + "', '" + SUPPORT + "', '" + PARTNER + "', '" + CUSTOMER + "')";

    private AuthoritiesConstants() {
    }

}
