package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Partner;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.service.PartnerService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Partner}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class PartnerResource {

    private final Logger log = LoggerFactory.getLogger(PartnerResource.class);

    private static final String ENTITY_NAME = "custportAppPartner";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PartnerService partnerService;

    public PartnerResource(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    /**
     * {@code POST  /partners} : Create a new partner.
     *
     * @param partner the partner to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new partner, or with status {@code 400 (Bad Request)} if the partner has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/partners")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Partner> createPartner(@Valid @RequestBody Partner partner) throws URISyntaxException {
        log.debug("REST request to save Partner : {}", partner);
        if (partner.getId() != null) {
            throw new BadRequestAlertException("A new partner cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Partner result = partnerService.save(partner);
        return ResponseEntity.created(new URI("/api/partners/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /partners} : Updates an existing partner.
     *
     * @param partner the partner to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated partner,
     * or with status {@code 400 (Bad Request)} if the partner is not valid,
     * or with status {@code 500 (Internal Server Error)} if the partner couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/partners")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Partner> updatePartner(@Valid @RequestBody Partner partner) throws URISyntaxException {
        log.debug("REST request to update Partner : {}", partner);
        if (partner.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Partner result = partnerService.save(partner);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, partner.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /partners} : get all the partners.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of partners in body.
     */
    @GetMapping("/partners")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public List<Partner> getAllPartners() {
        log.debug("REST request to get all Partners");
        return partnerService.findAll();
    }

    /**
     * {@code GET  /partners/:id} : get the "id" partner.
     *
     * @param id the id of the partner to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the partner, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/partners/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Partner> getPartner(@PathVariable Long id) {
        log.debug("REST request to get Partner : {}", id);
        Optional<Partner> partner = partnerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(partner);
    }

    /**
     * {@code DELETE  /partners/:id} : delete the "id" partner.
     *
     * @param id the id of the partner to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/partners/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Void> deletePartner(@PathVariable Long id) {
        log.debug("REST request to delete Partner : {}", id);

        partnerService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
