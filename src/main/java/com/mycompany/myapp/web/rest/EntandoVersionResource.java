package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.EntandoVersion;
import com.mycompany.myapp.service.EntandoVersionService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.EntandoVersion}.
 */
@RestController
@RequestMapping("/api")
public class EntandoVersionResource {

    private final Logger log = LoggerFactory.getLogger(EntandoVersionResource.class);

    private static final String ENTITY_NAME = "custportAppEntandoVersion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EntandoVersionService entandoVersionService;

    public EntandoVersionResource(EntandoVersionService entandoVersionService) {
        this.entandoVersionService = entandoVersionService;
    }

    /**
     * {@code POST  /entando-versions} : Create a new entandoVersion.
     *
     * @param entandoVersion the entandoVersion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new entandoVersion, or with status {@code 400 (Bad Request)} if the entandoVersion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/entando-versions")
    public ResponseEntity<EntandoVersion> createEntandoVersion(@Valid @RequestBody EntandoVersion entandoVersion) throws URISyntaxException {
        log.debug("REST request to save EntandoVersion : {}", entandoVersion);
        if (entandoVersion.getId() != null) {
            throw new BadRequestAlertException("A new entandoVersion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EntandoVersion result = entandoVersionService.save(entandoVersion);
        return ResponseEntity.created(new URI("/api/entando-versions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /entando-versions} : Updates an existing entandoVersion.
     *
     * @param entandoVersion the entandoVersion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entandoVersion,
     * or with status {@code 400 (Bad Request)} if the entandoVersion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the entandoVersion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/entando-versions")
    public ResponseEntity<EntandoVersion> updateEntandoVersion(@Valid @RequestBody EntandoVersion entandoVersion) throws URISyntaxException {
        log.debug("REST request to update EntandoVersion : {}", entandoVersion);
        if (entandoVersion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EntandoVersion result = entandoVersionService.save(entandoVersion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, entandoVersion.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /entando-versions} : get all the entandoVersions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of entandoVersions in body.
     */
    @GetMapping("/entando-versions")
    public List<EntandoVersion> getAllEntandoVersions() {
        log.debug("REST request to get all EntandoVersions");
        return entandoVersionService.findAll();
    }

    /**
     * {@code GET  /entando-versions/:id} : get the "id" entandoVersion.
     *
     * @param id the id of the entandoVersion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the entandoVersion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/entando-versions/{id}")
    public ResponseEntity<EntandoVersion> getEntandoVersion(@PathVariable Long id) {
        log.debug("REST request to get EntandoVersion : {}", id);
        Optional<EntandoVersion> entandoVersion = entandoVersionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(entandoVersion);
    }

    /**
     * {@code DELETE  /entando-versions/:id} : delete the "id" entandoVersion.
     *
     * @param id the id of the entandoVersion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/entando-versions/{id}")
    public ResponseEntity<Void> deleteEntandoVersion(@PathVariable Long id) {
        log.debug("REST request to delete EntandoVersion : {}", id);

        entandoVersionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
