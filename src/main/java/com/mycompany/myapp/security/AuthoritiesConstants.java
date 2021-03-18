package com.mycompany.myapp.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String SUPPORT = "ROLE_SUPPORT";

    public static final String CUSTOMER = "ROLE_CUSTOMER";

    public static final String PARTNER = "ROLE_PARTNER";

    private AuthoritiesConstants() {
    }
}
