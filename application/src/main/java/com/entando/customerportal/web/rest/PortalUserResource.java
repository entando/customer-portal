package com.entando.customerportal.web.rest;

import com.entando.customerportal.domain.PortalUser;
import com.entando.customerportal.security.AuthoritiesConstants;
import com.entando.customerportal.service.PortalUserService;
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
 * REST controller for managing {@link com.entando.customerportal.domain.PortalUser}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class PortalUserResource {

    private final Logger log = LoggerFactory.getLogger(PortalUserResource.class);

    private static final String ENTITY_NAME = "custportAppPortalUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PortalUserService portalUserService;

    public PortalUserResource(PortalUserService portalUserService) {
        this.portalUserService = portalUserService;
    }

    /**
     * {@code POST  /portal-users} : Create a new portalUser.
     *
     * @param portalUser the portalUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new portalUser, or with status {@code 400 (Bad Request)} if the portalUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/portal-users")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<PortalUser> createPortalUser(@Valid @RequestBody PortalUser portalUser) throws URISyntaxException {
        log.debug("REST request to save PortalUser : {}", portalUser);
        if (portalUser.getId() != null) {
            throw new BadRequestAlertException("A new portalUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PortalUser result = portalUserService.save(portalUser);
        return ResponseEntity.created(new URI("/api/portal-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /portal-users} : Updates an existing portalUser.
     *
     * @param portalUser the portalUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated portalUser,
     * or with status {@code 400 (Bad Request)} if the portalUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the portalUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/portal-users")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<PortalUser> updatePortalUser(@Valid @RequestBody PortalUser portalUser) throws URISyntaxException {
        log.debug("REST request to update PortalUser : {}", portalUser);
        if (portalUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PortalUser result = portalUserService.save(portalUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, portalUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /portal-users} : get all the portalUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of portalUsers in body.
     */
    @GetMapping("/portal-users")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public List<PortalUser> getAllPortalUsers() {
        log.debug("REST request to get all PortalUsers");
        return portalUserService.findAll();
    }

    /**
     * {@code GET  /portal-users/:id} : get the "id" portalUser.
     *
     * @param id the id of the portalUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the portalUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/portal-users/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<PortalUser> getPortalUser(@PathVariable Long id) {
        log.debug("REST request to get PortalUser : {}", id);
        Optional<PortalUser> portalUser = portalUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(portalUser);
    }

    /**
     * {@code DELETE  /portal-users/:id} : delete the "id" portalUser.
     *
     * @param id the id of the portalUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/portal-users/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Void> deletePortalUser(@PathVariable Long id) {
        log.debug("REST request to delete PortalUser : {}", id);

        portalUserService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code GET  /portal-users/username/:username/email/:email} : get the "username" portalUser.
     *
     * @param username the username of the portaluser
     * @param email    the email of the portaluser, used to lazily create the portaluser if needed
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the portalUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/portal-users/username/{username}/email/{email}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<PortalUser> getPortalUserByUserName(@PathVariable String username, @PathVariable String email) {
        log.debug("REST request to get PortalUser by username: {}", username);
        Optional<PortalUser> portalUser = portalUserService.findByUsername(username);
        if (!portalUser.isPresent()) {
            if ((username == null) || username.trim().isEmpty()) {
                throw new BadRequestAlertException("Missing username", "username", "username");
            }
            if ((email == null) || email.trim().isEmpty()) {
                throw new BadRequestAlertException("Missing email", "email", "email");
            }
            log.debug("Creating new PortalUser by username {}, email {}", username, email);
            PortalUser user = new PortalUser();
            user.setUsername(username);
            user.setEmail(email);
            portalUser = Optional.of(portalUserService.save(user));
        }

        return ResponseUtil.wrapOrNotFound(portalUser);
    }
}
