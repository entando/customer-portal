package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PortalUser;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.service.PortalUserService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

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
 * REST controller for managing {@link com.mycompany.myapp.domain.PortalUser}.
 */
@RestController
@RequestMapping("/api")
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
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
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
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
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
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
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
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
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
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
    public ResponseEntity<Void> deletePortalUser(@PathVariable Long id) {
        log.debug("REST request to delete PortalUser : {}", id);

        portalUserService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code GET  /portal-users/username/:username} : get the "username" portalUser.
     *
     * @param username the username of the portaluser
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the portalUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/portal-users/username/{username}")
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.CUSTOMER + "', '" + AuthoritiesConstants.PARTNER +
        "', '" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
    public ResponseEntity<PortalUser> getPortalUserByUserName(@PathVariable String username) {
        log.debug("REST request to get PortalUser by username: {}", username);
        Optional<PortalUser> portalUser = portalUserService.findByUsername(username);
        return ResponseUtil.wrapOrNotFound(portalUser);
    }
}
