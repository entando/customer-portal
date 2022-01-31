package com.entando.customerportal.service.impl;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.repository.TicketingSystemConfigRepository;
import com.entando.customerportal.request.ConfigFields;
import com.entando.customerportal.request.TicketingSystemConfigAddRequest;
import com.entando.customerportal.request.TicketingSystemConfigUpdateRequest;
import com.entando.customerportal.service.TicketingSystemConfigService;
import com.entando.customerportal.util.JsonUtil;
import com.entando.customerportal.web.rest.errors.DuplicateTicketingSystemConfigException;
import com.entando.customerportal.web.rest.errors.ErrorConstants;

@Service
@Transactional
public class TicketingSystemConfigServiceImpl implements TicketingSystemConfigService {
	
	@Autowired
	private TicketingSystemConfigRepository ticketingSystemConfigRepository;
	
	private static final String ENTITY_NAME = "custportAppCustomer";

	@Override
	public TicketingSystemConfig addTicketingSystemConfiguration(TicketingSystemConfigAddRequest ticketSystemConfigReq) {
		TicketingSystemConfig ticketingSystemConfig = new TicketingSystemConfig();
		if(Objects.nonNull(ticketSystemConfigReq.getTicketTypes())) {
			ticketingSystemConfig.setTicketType(JsonUtil.objectToJsonString(ticketSystemConfigReq.getTicketTypes()));
		}
		if(Objects.nonNull(ticketSystemConfigReq.getSubscriptionLevels())) {
			ticketingSystemConfig.setSubscriptionLevel(JsonUtil.objectToJsonString(ticketSystemConfigReq.getSubscriptionLevels()));
		}
		if(Objects.nonNull(ticketSystemConfigReq.getProductNames())) {
			ticketingSystemConfig.setProductName(JsonUtil.objectToJsonString(ticketSystemConfigReq.getProductNames()));
		}
		if(Objects.nonNull(ticketSystemConfigReq.getJiraCustomFields())) {
			ticketingSystemConfig.setJiraCustomField(JsonUtil.objectToJsonString(ticketSystemConfigReq.getJiraCustomFields()));
		}
		return ticketingSystemConfigRepository.save(ticketingSystemConfig);
	}
	
	@Override
	public List<TicketingSystemConfig> getAllTicketingSystemConfiguration() {
		return ticketingSystemConfigRepository.findAll();
	}

	@Override
	public TicketingSystemConfig updateTicketingSystemConfiguration(TicketingSystemConfigUpdateRequest ticketingSystemConfigReq) throws DuplicateTicketingSystemConfigException {
		TicketingSystemConfig configUpdated = null;
		TicketingSystemConfig configDb = null;
		List<ConfigFields> duplicateConfigs = isTicketingSystemConfigDuplicate(ticketingSystemConfigReq.getValues());
		if(!CollectionUtils.isEmpty(duplicateConfigs)) {
			throw new DuplicateTicketingSystemConfigException(ErrorConstants.DUP_TICKET_SYTEM_CONFIG_TITLE_MSG, String.format(ErrorConstants.DUP_TICKET_SYTEM_CONFIG_ERR_MSG, ticketingSystemConfigReq.getFlag()), ENTITY_NAME, duplicateConfigs);
		}

		if(Objects.nonNull(ticketingSystemConfigReq.getFlag())) {
			String jsonString = JsonUtil.objectToJsonString(ticketingSystemConfigReq.getValues());
			List<TicketingSystemConfig> configList = getAllTicketingSystemConfiguration();
			if(!CollectionUtils.isEmpty(configList)) {
				configDb = configList.get(0);
			} else {
				configDb = new TicketingSystemConfig();
			}
			switch (ticketingSystemConfigReq.getFlag()) {
				case TICKET_TYPE:
					configDb.setTicketType(jsonString);
					break;
				case SUBSCRIPTION_LEVEL:
					configDb.setSubscriptionLevel(jsonString);
					break;
				case JIRA_CUSTOM_FIELD:
					configDb.setJiraCustomField(jsonString);
					break;
				default:
					configDb.setProductName(jsonString);
					break;
			}
			configUpdated = ticketingSystemConfigRepository.save(configDb);
		}
		return configUpdated;
	}

	private List<ConfigFields> isTicketingSystemConfigDuplicate(Set<ConfigFields> configValues) {
		return configValues.stream().collect(Collectors.groupingBy(ConfigFields::getName))
				.entrySet().stream().filter(e -> e.getValue().size() > 1).flatMap(e -> e.getValue().stream())
				.collect(Collectors.toList());
	}
}
