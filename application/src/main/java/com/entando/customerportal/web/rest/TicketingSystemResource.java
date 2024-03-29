package com.entando.customerportal.web.rest;

import com.entando.customerportal.domain.TicketingSystem;
import com.entando.customerportal.request.TicketingSystemRequest;
import com.entando.customerportal.security.AuthoritiesConstants;
import com.entando.customerportal.service.TicketingSystemService;
import com.entando.customerportal.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.entando.customerportal.domain.TicketingSystem}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class TicketingSystemResource {

    private final Logger log = LoggerFactory.getLogger(TicketingSystemResource.class);

    private static final String ENTITY_NAME = "custportAppTicketingSystem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketingSystemService ticketingSystemService;

    public TicketingSystemResource(TicketingSystemService ticketingSystemService) {
        this.ticketingSystemService = ticketingSystemService;
    }

    /**
     * {@code POST  /ticketing-systems} : Create a new ticketingSystem.
     *
     * @param request the ticketingSystem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticketingSystem, or with status {@code 400 (Bad Request)} if the ticketingSystem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ticketing-systems")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<TicketingSystem> createTicketingSystem(@Valid @RequestBody TicketingSystemRequest request) throws URISyntaxException {
        log.debug("REST request to save TicketingSystem : {}", request);
        TicketingSystem ts = request.getTicketingSystem();
        if (ts.getId() != null) {
            throw new BadRequestAlertException("A new ticketingSystem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ts.setServiceAccountSecret(request.getSecret());
        TicketingSystem result = ticketingSystemService.save(ts);
        return ResponseEntity.created(new URI("/api/ticketing-systems/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ticketing-systems} : Updates an existing ticketingSystem.
     *
     * @param request the ticketingSystem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticketingSystem,
     * or with status {@code 400 (Bad Request)} if the ticketingSystem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticketingSystem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ticketing-systems")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<TicketingSystem> updateTicketingSystem(@Valid @RequestBody TicketingSystemRequest request) throws URISyntaxException {
        log.debug("REST request to update TicketingSystem : {}", request);
        TicketingSystem ts = request.getTicketingSystem();
        if (ts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ts.setServiceAccountSecret(request.getSecret());
        TicketingSystem result = ticketingSystemService.save(ts);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /ticketing-systems} : get all the ticketingSystems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ticketingSystems in body.
     */
    @GetMapping("/ticketing-systems")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public List<TicketingSystem> getAllTicketingSystems() {
        log.debug("REST request to get all TicketingSystems");
        return ticketingSystemService.findAll();
    }

    /**
     * {@code GET  /ticketing-systems/:id} : get the "id" ticketingSystem.
     *
     * @param id the id of the ticketingSystem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticketingSystem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ticketing-systems/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<TicketingSystem> getTicketingSystem(@PathVariable Long id) {
        log.debug("REST request to get TicketingSystem : {}", id);
        Optional<TicketingSystem> ticketingSystem = ticketingSystemService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticketingSystem);
    }

    /**
     * {@code DELETE  /ticketing-systems/:id} : delete the "id" ticketingSystem.
     *
     * @param id the id of the ticketingSystem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ticketing-systems/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Void> deleteTicketingSystem(@PathVariable Long id) {
        log.debug("REST request to delete TicketingSystem : {}", id);

        ticketingSystemService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

}
