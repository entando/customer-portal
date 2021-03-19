package com.mycompany.myapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import com.mycompany.myapp.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myapp.constant.CustportAppConstant;
import com.mycompany.myapp.domain.EntandoVersion;
import com.mycompany.myapp.request.EntandoVersionRequest;
import com.mycompany.myapp.response.model.EntandoVersionResponse;
import com.mycompany.myapp.service.EntandoVersionService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

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
    public ResponseEntity<EntandoVersion> createEntandoVersion(@Valid @RequestBody EntandoVersionRequest entandoVersionRequest) throws URISyntaxException {

    	try {
	    	if (entandoVersionRequest != null) {
	    		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(CustportAppConstant.INPUT_DATE_FORMAT);
	    		LocalDate startDate = LocalDate.parse(entandoVersionRequest.getStartDate(), formatter);
	    		LocalDate endDate = LocalDate.parse(entandoVersionRequest.getEndDate(), formatter);

	    		EntandoVersion objToAdd = new EntandoVersion();
	    		objToAdd.setStartDate(startDate.atStartOfDay(ZoneId.systemDefault()));
	    		objToAdd.setEndDate(endDate.atStartOfDay(ZoneId.systemDefault()));
	    		objToAdd.setName(entandoVersionRequest.getName());

	    		EntandoVersion result = entandoVersionService.save(objToAdd);

	    		return ResponseEntity.created(new URI("/api/entando-versions/" + result.getId()))
	                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
	                    .body(result);
	    	}
    	} catch (DateTimeParseException e) {
    		log.error("Error occurred while parsing date", e);
    	} catch (Exception exception) {
    		log.error("Error occurred while creating a entando version : " + entandoVersionRequest.getName(), exception);
    	}

    	// will be updated once the way to handle response error in front end is determined.
        return null;
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
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.CUSTOMER + "', '" + AuthoritiesConstants.PARTNER +
        "', '" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
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

    @PutMapping("/entando-versions/{id}")
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.CUSTOMER + "', '" + AuthoritiesConstants.PARTNER +
        "', '" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
    public ResponseEntity<EntandoVersion> updateEntandoVersionStatus(@PathVariable Long id) throws URISyntaxException {

    	try {
    		Optional<EntandoVersion> entandoVersion = entandoVersionService.findOne(id);

    		if (entandoVersion.isPresent()) {
    			EntandoVersion objToUpdate = entandoVersion.get();
    			objToUpdate.setStatus(!objToUpdate.isStatus());
    			entandoVersionService.save(objToUpdate);
    		}
    	} catch(Exception e) {
    		log.error("Error occurred while updating entando version for id : " + id, e);
    	}

    	 return ResponseEntity.noContent().headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code GET  /entando-versions} : get all the entandoVersions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of entandoVersions in body.
     */
    @GetMapping("/entando-versions")
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.CUSTOMER + "', '" + AuthoritiesConstants.PARTNER +
        "', '" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
    public ResponseEntity<List<EntandoVersionResponse>> getAllEntandoVersions() {

    	SimpleDateFormat sdf = new SimpleDateFormat(CustportAppConstant.DATE_FORMAT);
        List<EntandoVersionResponse> entandoVersions = new ArrayList<>();

        try {
	        List<EntandoVersion> entandoVersionList = entandoVersionService.findAll();

	        for (EntandoVersion entandoVersion : entandoVersionList) {
	        	EntandoVersionResponse res = new EntandoVersionResponse();

	        	res.setId(entandoVersion.getId());
	        	res.setName(entandoVersion.getName());
	        	res.setStatus(entandoVersion.isStatus());
	        	if(entandoVersion.getStartDate() != null) {
	        		res.setStartDate(sdf.format(Date.from(entandoVersion.getStartDate().toInstant())));
	        	}
	        	if(entandoVersion.getEndDate() != null) {
	        		res.setEndDate(sdf.format(Date.from(entandoVersion.getEndDate().toInstant())));
	        	}

	        	entandoVersions.add(res);
	        }
        } catch(Exception e) {
    		log.error("Error occurred while fetching all customer", e);
    	}

        return new ResponseEntity<List<EntandoVersionResponse>>(entandoVersions, HttpStatus.OK);
    }

    /**
     * {@code GET  /entando-versions/:id} : get the "id" entandoVersion.
     *
     * @param id the id of the entandoVersion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the entandoVersion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/entando-versions/{id}")
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.CUSTOMER + "', '" + AuthoritiesConstants.PARTNER +
        "', '" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
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
    @PreAuthorize("hasAnyRole('" + AuthoritiesConstants.CUSTOMER + "', '" + AuthoritiesConstants.PARTNER +
        "', '" + AuthoritiesConstants.ADMIN + "', '" + AuthoritiesConstants.SUPPORT + "')")
    public ResponseEntity<Void> deleteEntandoVersion(@PathVariable Long id) {
        log.debug("REST request to delete EntandoVersion : {}", id);

        entandoVersionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
