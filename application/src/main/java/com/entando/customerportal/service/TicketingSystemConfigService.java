package com.entando.customerportal.service;

import java.util.List;

import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.request.TicketingSystemConfigRequest;

public interface TicketingSystemConfigService {
	
	TicketingSystemConfig saveTicketingSystemConfiguration(TicketingSystemConfig ticketType);
	
	TicketingSystemConfig updateTicketingSystemConfiguration(TicketingSystemConfigRequest ticketingSystemConfigReq);
	
	List<TicketingSystemConfig> getAllTicketingSystemConfiguration();

}
