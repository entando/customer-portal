package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.EntandoVersion;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.ProjectSubscription;
import com.mycompany.myapp.request.SubscriptionCreationRequest;
import com.mycompany.myapp.service.EntandoVersionService;
import com.mycompany.myapp.service.ProjectService;
import com.mycompany.myapp.service.ProjectSubscriptionService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ProjectSubscription}.
 */
@RestController
@RequestMapping("/api")
public class ProjectSubscriptionResource {

    private final Logger log = LoggerFactory.getLogger(ProjectSubscriptionResource.class);

    private static final String ENTITY_NAME = "custportAppProjectSubscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectSubscriptionService projectSubscriptionService;
    private final ProjectService projectService;
    private final EntandoVersionService entandoVersionService;

    public ProjectSubscriptionResource(ProjectSubscriptionService projectSubscriptionService, ProjectService projectService, EntandoVersionService entandoVersionService) {
        this.projectSubscriptionService = projectSubscriptionService;
        this.projectService = projectService;
        this.entandoVersionService = entandoVersionService;
    }

    /**
     * {@code POST  /project-subscriptions} : Create a new projectSubscription.
     *
     * @param projectSubscription the projectSubscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectSubscription, or with status {@code 400 (Bad Request)} if the projectSubscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-subscriptions")
    public ResponseEntity<ProjectSubscription> createProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest subscriptionCreationRequest) throws URISyntaxException {
        log.debug("REST request to save ProjectSubscription : {}", subscriptionCreationRequest);
        ProjectSubscription projectSubscription = subscriptionCreationRequest.getProjectSubscription();
        
        if (projectSubscription == null || projectSubscription.getId() != null) {
            throw new BadRequestAlertException("A new projectSubscription cannot already have an ID", ENTITY_NAME, "idexists");
        } else if (subscriptionCreationRequest.getEntandoVersion() == null) {
            throw new BadRequestAlertException("Missing entando version", ENTITY_NAME, "missingentandoversion");
        } else if (subscriptionCreationRequest.getProjectName() == null) {
            throw new BadRequestAlertException("Missing project name", ENTITY_NAME, "missingprojectname");
        }

        // TODO: This may change to ID or even the whole object
        Optional<Project> associatedProjectOpt = projectService.findByName(subscriptionCreationRequest.getProjectName());
        if (!associatedProjectOpt.isPresent()) {
            throw new BadRequestAlertException("There was no project found with that name", ENTITY_NAME, "projectNotFound");
        }

        // TODO: This may change to ID or even the whole object
        Optional<EntandoVersion> entandoVersionOpt = entandoVersionService.findByName(subscriptionCreationRequest.getEntandoVersion());
        if (!entandoVersionOpt.isPresent()) {
            throw new BadRequestAlertException("There was no entando version found with that name", ENTITY_NAME, "");
        }

        associatedProjectOpt.ifPresent(project -> projectSubscription.setProject(project));
        entandoVersionOpt.ifPresent(entandoVersion -> projectSubscription.setEntandoVersion(entandoVersion));

        ProjectSubscription result = projectSubscriptionService.save(subscriptionCreationRequest.getProjectSubscription());
        return ResponseEntity.created(new URI("/api/project-subscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-subscriptions} : Updates an existing projectSubscription.
     *
     * @param projectSubscription the projectSubscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectSubscription,
     * or with status {@code 400 (Bad Request)} if the projectSubscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectSubscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-subscriptions")
    public ResponseEntity<ProjectSubscription> updateProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest subscriptionCreationRequest) throws URISyntaxException {
        ProjectSubscription projectSubscription = subscriptionCreationRequest.getProjectSubscription();
        log.debug("REST request to update ProjectSubscription : {}", projectSubscription);

        if (projectSubscription == null || projectSubscription.getId() == null || !projectService.findOne(projectSubscription.getId()).isPresent()) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        } else if (subscriptionCreationRequest.getEntandoVersion() == null) {
            throw new BadRequestAlertException("Missing entando version", ENTITY_NAME, "missingentandoversion");
        } else if (subscriptionCreationRequest.getProjectName() == null) {
            throw new BadRequestAlertException("Missing project name", ENTITY_NAME, "missingprojectname");
        }

        // TODO: This may change to ID or even the whole object
        Optional<Project> associatedProjectOpt = projectService.findByName(subscriptionCreationRequest.getProjectName());
        if (!associatedProjectOpt.isPresent()) {
            throw new BadRequestAlertException("There was no project found with that name", ENTITY_NAME, "projectNotFound");
        }

        // TODO: This may change to ID or even the whole object
        Optional<EntandoVersion> entandoVersionOpt = entandoVersionService.findByName(subscriptionCreationRequest.getEntandoVersion());
        if (!entandoVersionOpt.isPresent()) {
            throw new BadRequestAlertException("There was no entando version found with that name", ENTITY_NAME, "");
        }

        associatedProjectOpt.ifPresent(project -> projectSubscription.setProject(project));
        entandoVersionOpt.ifPresent(entandoVersion -> projectSubscription.setEntandoVersion(entandoVersion));
        
        ProjectSubscription result = projectSubscriptionService.save(projectSubscription);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, projectSubscription.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /project-subscriptions} : get all the projectSubscriptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectSubscriptions in body.
     */
    @GetMapping("/project-subscriptions")
    public List<ProjectSubscription> getAllProjectSubscriptions() {
        log.debug("REST request to get all ProjectSubscriptions");
        return projectSubscriptionService.findAll();
    }

    /**
     * {@code GET  /project-subscriptions/:id} : get the "id" projectSubscription.
     *
     * @param id the id of the projectSubscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectSubscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-subscriptions/{id}")
    public ResponseEntity<ProjectSubscription> getProjectSubscription(@PathVariable Long id) {
        log.debug("REST request to get ProjectSubscription : {}", id);
        Optional<ProjectSubscription> projectSubscription = projectSubscriptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(projectSubscription);
    }

    /**
     * {@code DELETE  /project-subscriptions/:id} : delete the "id" projectSubscription.
     *
     * @param id the id of the projectSubscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-subscriptions/{id}")
    public ResponseEntity<Void> deleteProjectSubscription(@PathVariable Long id) {
        log.debug("REST request to delete ProjectSubscription : {}", id);

        projectSubscriptionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
