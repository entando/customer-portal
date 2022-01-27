package com.entando.customerportal.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.repository.TicketingSystemConfigRepository;
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

}
