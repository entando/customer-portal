package com.entando.customerportal.web.rest.errors;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class InvalidTicketingSystemConfigException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;
    private final String entityName;

    public InvalidTicketingSystemConfigException(String title, String defaultMessage, String entityName, List<String> values) {
        this(ErrorConstants.DEFAULT_TYPE, title, defaultMessage, entityName, values);
    }

    public InvalidTicketingSystemConfigException(URI type, String title, String defaultMessage, String entityName, List<String> values) {
        super(type, title, Status.CONFLICT, null, null, null, getAlertParameters(defaultMessage, entityName, values));
        this.entityName = entityName;
    }

    public String getEntityName() {
        return entityName;
    }

    private static Map<String, Object> getAlertParameters(String defaultMessage, String entityName, List<String> values) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ErrorConstants.KEY_IS_ERROR, true);
        parameters.put(ErrorConstants.KEY_MESSAGE, defaultMessage);
        parameters.put(ErrorConstants.KEY_VALUES, values);
        return parameters;
    }

}
