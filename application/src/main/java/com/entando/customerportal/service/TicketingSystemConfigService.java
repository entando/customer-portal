package com.entando.customerportal.service;

import java.util.List;

import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.request.TicketingSystemConfigAddRequest;
import com.entando.customerportal.request.TicketingSystemConfigUpdateRequest;

public interface TicketingSystemConfigService {
	
	TicketingSystemConfig addTicketingSystemConfiguration(TicketingSystemConfigAddRequest ticketSystemConfigAddReq);
	
	TicketingSystemConfig updateTicketingSystemConfiguration(TicketingSystemConfigUpdateRequest ticketSystemConfigReq);
	
	List<TicketingSystemConfig> getAllTicketingSystemConfiguration();

}
