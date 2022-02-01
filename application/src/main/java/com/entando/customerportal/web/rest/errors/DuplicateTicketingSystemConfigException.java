package com.entando.customerportal.web.rest.errors;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

import com.entando.customerportal.request.ConfigFields;

public class DuplicateTicketingSystemConfigException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;
    private final String entityName;

    public DuplicateTicketingSystemConfigException(String title, String defaultMessage, String entityName, List<ConfigFields> duplicateConfigs) {
        this(ErrorConstants.DEFAULT_TYPE, title, defaultMessage, entityName, duplicateConfigs);
    }

    public DuplicateTicketingSystemConfigException(URI type, String title, String defaultMessage, String entityName, List<ConfigFields> duplicateConfigs) {
        super(type, title, Status.CONFLICT, null, null, null, getAlertParameters(defaultMessage, entityName, duplicateConfigs));
        this.entityName = entityName;
    }

    public String getEntityName() {
        return entityName;
    }

    private static Map<String, Object> getAlertParameters(String defaultMessage, String entityName, List<ConfigFields> duplicateConfigs) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put(ErrorConstants.KEY_IS_ERROR, true);
        parameters.put(ErrorConstants.KEY_MESSAGE, defaultMessage);
        parameters.put(ErrorConstants.KEY_VALUES, duplicateConfigs);
        return parameters;
    }

}
