package com.entando.customerportal.service;

import java.util.List;

import com.entando.customerportal.domain.TicketingSystemConfig;

public interface TicketingSystemConfigService {
	
	TicketingSystemConfig saveTicketingSystemConfiguration(TicketingSystemConfig ticketType);
	
	List<TicketingSystemConfig> getAllTicketingSystemConfiguration();

}
