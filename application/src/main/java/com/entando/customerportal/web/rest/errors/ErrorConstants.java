package com.entando.customerportal.web.rest.errors;

import java.net.URI;

public final class ErrorConstants {

	private ErrorConstants() {
    }

    public static final String ERR_CONCURRENCY_FAILURE = "error.concurrencyFailure";
    public static final String ERR_VALIDATION = "error.validation";
    public static final String PROBLEM_BASE_URL = "https://www.jhipster.tech/problem";
    public static final URI DEFAULT_TYPE = URI.create(PROBLEM_BASE_URL + "/problem-with-message");
    public static final URI CONSTRAINT_VIOLATION_TYPE = URI.create(PROBLEM_BASE_URL + "/constraint-violation");
    public static final URI ENTITY_NOT_FOUND_TYPE = URI.create(PROBLEM_BASE_URL + "/entity-not-found");

    public static final String KEY_IS_ERROR = "isError";
    public static final String KEY_MESSAGE = "message";
    public static final String KEY_VALUES = "values";

    public static final String DUP_TICKET_SYTEM_CONFIG_TITLE_MSG = "Duplicate Ticketing System Configuration";
    public static final String DUP_TICKET_SYTEM_CONFIG_ERR_MSG = "Duplicate %s not allowed";
}
