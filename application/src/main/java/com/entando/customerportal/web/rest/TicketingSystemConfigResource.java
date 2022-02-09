package com.entando.customerportal.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.request.TicketingSystemConfigAddRequest;
import com.entando.customerportal.request.TicketingSystemConfigUpdateRequest;
import com.entando.customerportal.security.AuthoritiesConstants;
import com.entando.customerportal.security.SpringSecurityAuditorAware;
import com.entando.customerportal.service.TicketingSystemConfigService;
import com.entando.customerportal.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api/ticketing-system-config")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class TicketingSystemConfigResource {
	
	private final Logger log = LoggerFactory.getLogger(TicketingSystemConfigResource.class);

    private static final String ENTITY_NAME = "custportAppTicketingSystemConfig";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;
    
    private final TicketingSystemConfigService configService;
    
    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    public TicketingSystemConfigResource(TicketingSystemConfigService configService) {
        this.configService = configService;
    }
    
    @PostMapping("")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<TicketingSystemConfig> createTicketingSystemConfiguration(@Valid @RequestBody TicketingSystemConfigAddRequest ticketSystemConfigAddReq) throws URISyntaxException {
        log.debug("REST request to save Ticketing System Configuration : {}", ticketSystemConfigAddReq);
        TicketingSystemConfig result = configService.addTicketingSystemConfiguration(ticketSystemConfigAddReq);
        return ResponseEntity.created(new URI("/api/ticketing-system-config" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    
    @PutMapping("")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<TicketingSystemConfig> updateTicketingSystemConfiguration(@RequestBody TicketingSystemConfigUpdateRequest ticketingSystemConfigReq) throws URISyntaxException {
        log.debug("REST request to update Ticketing System Configuration : {}", ticketingSystemConfigReq);
        if (ticketingSystemConfigReq.getFlag() == null) {
            throw new BadRequestAlertException("flag is required", ENTITY_NAME, "flag required");
        }
        TicketingSystemConfig result = configService.updateTicketingSystemConfiguration(ticketingSystemConfigReq);
        return ResponseEntity.created(new URI("/api/ticketing-system-config" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    
    @GetMapping("")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public List<TicketingSystemConfig> getAllTicketingSystemConfigrations() {
        log.debug("REST request to get all Ticketing System Configurations");
        return configService.getAllTicketingSystemConfiguration();
    }
}
