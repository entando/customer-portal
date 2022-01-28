package com.entando.customerportal.service.impl;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.repository.TicketingSystemConfigRepository;
import com.entando.customerportal.request.TicketingSystemConfigRequest;
import com.entando.customerportal.service.TicketingSystemConfigService;

@Service
@Transactional
public class TicketingSystemConfigServiceImpl implements TicketingSystemConfigService {
	
	@Autowired
	private TicketingSystemConfigRepository ticketingSystemConfigRepository;

	@Override
	public TicketingSystemConfig saveTicketingSystemConfiguration(TicketingSystemConfig ticketingSystemConfig) {
		return ticketingSystemConfigRepository.save(ticketingSystemConfig);
	}
	
	@Override
	public List<TicketingSystemConfig> getAllTicketingSystemConfiguration() {
		return ticketingSystemConfigRepository.findAll();
	}

	@Override
	public TicketingSystemConfig updateTicketingSystemConfiguration(TicketingSystemConfigRequest ticketingSystemConfigReq) {
		TicketingSystemConfig configUpdated = null; 
		if(Objects.nonNull(ticketingSystemConfigReq.getFlag())) {
			List<TicketingSystemConfig> configList = getAllTicketingSystemConfiguration();
			if(!CollectionUtils.isEmpty(configList)) {
				TicketingSystemConfig configDb = configList.get(0);
				switch (ticketingSystemConfigReq.getFlag()) {
				case TICKET_TYPE:
					configDb.setTicketType(ticketingSystemConfigReq.getValue());
					break;
				case SUBSCRIPTION_LEVEL:
					configDb.setSubscriptionLevel(ticketingSystemConfigReq.getValue());
					break;
				case JIRA_CUSTOM_FIELD:
					configDb.setJiraCustomField(ticketingSystemConfigReq.getValue());
					break;
				default:
					configDb.setProductName(ticketingSystemConfigReq.getValue());
					break;
				}
				configUpdated = ticketingSystemConfigRepository.save(configDb);
			}
		}
		return configUpdated;
	}
}
