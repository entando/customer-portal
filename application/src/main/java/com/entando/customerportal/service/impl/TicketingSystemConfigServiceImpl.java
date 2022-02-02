package com.entando.customerportal.service.impl;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.repository.TicketingSystemConfigRepository;
import com.entando.customerportal.request.ConfigFields;
import com.entando.customerportal.request.TicketingSystemConfigAddRequest;
import com.entando.customerportal.request.TicketingSystemConfigUpdateRequest;
import com.entando.customerportal.request.TicketingSystemConfigUpdateRequest.TicketingSystemConfigEnum;
import com.entando.customerportal.service.TicketingSystemConfigService;
import com.entando.customerportal.web.rest.errors.ErrorConstants;
import com.entando.customerportal.web.rest.errors.InvalidTicketingSystemConfigException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class TicketingSystemConfigServiceImpl implements TicketingSystemConfigService {

	@Autowired
	private TicketingSystemConfigRepository ticketingSystemConfigRepository;

	private static final String ENTITY_NAME = "custportAppTicketingSystemConfig";

	private final Logger log = LoggerFactory.getLogger(TicketingSystemConfigServiceImpl.class);

	@Override
	public TicketingSystemConfig addTicketingSystemConfiguration(TicketingSystemConfigAddRequest ticketSystemConfigReq) {
		checkIfRecordAlreadyExists();
		checkIfTicketingSystemsDuplicate(ticketSystemConfigReq);
		TicketingSystemConfig ticketingSystemConfig = new TicketingSystemConfig();
		if(Objects.nonNull(ticketSystemConfigReq.getTicketTypes())) {
			ticketingSystemConfig.setTicketType(objectToJsonString(ticketSystemConfigReq.getTicketTypes()));
		}
		if(Objects.nonNull(ticketSystemConfigReq.getSubscriptionLevels())) {
			ticketingSystemConfig.setSubscriptionLevel(objectToJsonString(ticketSystemConfigReq.getSubscriptionLevels()));
		}
		if(Objects.nonNull(ticketSystemConfigReq.getProductNames())) {
			ticketingSystemConfig.setProductName(objectToJsonString(ticketSystemConfigReq.getProductNames()));
		}
		if(Objects.nonNull(ticketSystemConfigReq.getJiraCustomFields())) {
			ticketingSystemConfig.setJiraCustomField(objectToJsonString(ticketSystemConfigReq.getJiraCustomFields()));
		}
		return ticketingSystemConfigRepository.save(ticketingSystemConfig);
	}

	@Override
	public List<TicketingSystemConfig> getAllTicketingSystemConfiguration() {
		return ticketingSystemConfigRepository.findAll();
	}

	@Override
	public TicketingSystemConfig updateTicketingSystemConfiguration(TicketingSystemConfigUpdateRequest ticketingSystemConfigReq) throws InvalidTicketingSystemConfigException {
		TicketingSystemConfig configUpdated = null;
		TicketingSystemConfig configDb = null;
		if(ticketingSystemConfigReq.getFlag() != TicketingSystemConfigEnum.JIRA_CUSTOM_FIELD) {
			List<String> duplicateValues = getDuplicateTicketingSystemConfig(ticketingSystemConfigReq.getValues());
			if(!CollectionUtils.isEmpty(duplicateValues)) {
				throw new InvalidTicketingSystemConfigException(ErrorConstants.DUP_TICKET_SYTEM_CONFIG_TITLE_MSG, String.format(ErrorConstants.DUP_TICKET_SYTEM_CONFIG_ERR_MSG, ticketingSystemConfigReq.getFlag()), ENTITY_NAME, duplicateValues);
			}
		}

		if(Objects.nonNull(ticketingSystemConfigReq.getFlag())) {
			String jsonString = null;
			List<TicketingSystemConfig> configList = getAllTicketingSystemConfiguration();
			if(!CollectionUtils.isEmpty(configList)) {
				configDb = configList.get(0);
			} else {
				configDb = new TicketingSystemConfig();
			}

			if(ticketingSystemConfigReq.getFlag() == TicketingSystemConfigEnum.JIRA_CUSTOM_FIELD) {
				jsonString = objectToJsonString(ticketingSystemConfigReq.getJiraCustomFields());
				configDb.setJiraCustomField(jsonString);
			} else {
				jsonString = objectToJsonString(ticketingSystemConfigReq.getValues());
				switch (ticketingSystemConfigReq.getFlag()) {
					case TICKET_TYPE:
						configDb.setTicketType(jsonString);
						break;
					case SUBSCRIPTION_LEVEL:
						configDb.setSubscriptionLevel(jsonString);
						break;
					case PRODUCT_NAME:
						configDb.setProductName(jsonString);
						break;
					default:
						break;
				}
			}
			configUpdated = ticketingSystemConfigRepository.save(configDb);
		}
		return configUpdated;
	}

	/**
	 * Check if one record already present in database, if Yes then throw error
	 */
	private void checkIfRecordAlreadyExists() {
		if(ticketingSystemConfigRepository.count() > 0) {
			throw new InvalidTicketingSystemConfigException(ErrorConstants.ONE_RECORED_ALREADY_EXIST_TITLE_MSG, ErrorConstants.ONE_RECORED_ALREADY_EXIST_ERR_MSG, ENTITY_NAME, null);
		}
	}

	/**
	 * Check duplicate values in configuration object
	 * @param ticketSystemConfigReq
	 */
	private void checkIfTicketingSystemsDuplicate(TicketingSystemConfigAddRequest ticketSystemConfigReq) {
		List<String> duplicateValues = Collections.emptyList();
		if(Objects.nonNull(ticketSystemConfigReq)) {
			duplicateValues = getDuplicateTicketingSystemConfig(ticketSystemConfigReq.getTicketTypes());
			if(!CollectionUtils.isEmpty(duplicateValues)) {
				throwError(TicketingSystemConfigEnum.TICKET_TYPE, duplicateValues);
			}
			duplicateValues = getDuplicateTicketingSystemConfig(ticketSystemConfigReq.getSubscriptionLevels());
			if(!CollectionUtils.isEmpty(duplicateValues)) {
				throwError(TicketingSystemConfigEnum.SUBSCRIPTION_LEVEL, duplicateValues);
			}
			duplicateValues = getDuplicateTicketingSystemConfig(ticketSystemConfigReq.getProductNames());
			if(!CollectionUtils.isEmpty(duplicateValues)) {
				throwError(TicketingSystemConfigEnum.PRODUCT_NAME, duplicateValues);
			}
		}
	}

	/**
	 * Check duplicate values, if found duplicate values, throw error.
	 * @param flag
	 * @param duplicateConfigs
	 */
	private void throwError(TicketingSystemConfigEnum flag, List<String> duplicateConfigs) {
		throw new InvalidTicketingSystemConfigException(ErrorConstants.DUP_TICKET_SYTEM_CONFIG_TITLE_MSG, String.format(ErrorConstants.DUP_TICKET_SYTEM_CONFIG_ERR_MSG, flag), ENTITY_NAME, duplicateConfigs);
	}

	/**
	 * Filter duplicate objects based on name property
	 * @param configValues
	 * @return
	 */
	private List<String> getDuplicateTicketingSystemConfig(Set<ConfigFields> configValues) {
		if(configValues == null) {
			configValues = Collections.emptySet();
		}
		List<ConfigFields> list = configValues.stream().collect(Collectors.groupingBy(ConfigFields::getName))
				.entrySet().stream().filter(e -> e.getValue().size() > 1).flatMap(e -> e.getValue().stream())
				.collect(Collectors.toList());
		return list.stream().map(ConfigFields::getName).collect(Collectors.toList());
	}

	/**
	 * Convert an object to json string
	 * @param object
	 * @return
	 */
	private String objectToJsonString(Object object) {
		String jsonStr = "";
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			jsonStr = objectMapper.writeValueAsString(object);
		} catch (IOException e) {
			log.error("Conversion of object to json string failure {}", object, e);
		}
		return jsonStr;
	}
}
