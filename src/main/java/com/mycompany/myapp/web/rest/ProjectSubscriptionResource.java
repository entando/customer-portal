package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.request.SubscriptionCreationRequest;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.security.AuthoritiesUtil;
import com.mycompany.myapp.security.SpringSecurityAuditorAware;
import com.mycompany.myapp.service.*;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ProjectSubscription}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class ProjectSubscriptionResource {

    private final Logger log = LoggerFactory.getLogger(ProjectSubscriptionResource.class);

    private static final String ENTITY_NAME = "projectSubscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    private final ProjectSubscriptionService projectSubscriptionService;
    private final ProjectService projectService;
    private final EntandoVersionService entandoVersionService;
    private final TicketService ticketService;
    private final JiraTicketingSystemService ticketingSystemService;

    public ProjectSubscriptionResource(ProjectSubscriptionService projectSubscriptionService, ProjectService projectService,
                                       EntandoVersionService entandoVersionService, TicketService ticketService,
                                       JiraTicketingSystemService ticketingSystemService) {
        this.projectSubscriptionService = projectSubscriptionService;
        this.projectService = projectService;
        this.entandoVersionService = entandoVersionService;
        this.ticketService = ticketService;
        this.ticketingSystemService = ticketingSystemService;
    }

    /**
     * {@code POST  /project-subscriptions} : Create a new projectSubscription.
     *
     * @param subscriptionCreationRequest the projectSubscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectSubscription, or with status {@code 400 (Bad Request)} if the projectSubscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-subscriptions")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<ProjectSubscription> createProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest subscriptionCreationRequest)
        throws URISyntaxException {
        log.debug("REST request to save ProjectSubscription : {}", subscriptionCreationRequest);
        ProjectSubscription projectSubscription = subscriptionCreationRequest.getProjectSubscription();

        Long projectId = subscriptionCreationRequest.getProjectId();
        if (projectSubscription == null || projectSubscription.getId() != null) {
            throw new BadRequestAlertException("A new projectSubscription cannot already have an ID", ENTITY_NAME, "idexists");
        } else if (subscriptionCreationRequest.getEntandoVersionId() == null) {
            throw new BadRequestAlertException("Missing entando version id", ENTITY_NAME, "missingEntandoVersionId");
        } else if (projectId == null) {
            throw new BadRequestAlertException("Missing project id ", ENTITY_NAME, "missingProjectId");
        }
        projectService.checkProjectAccess(projectId);

        Optional<Project> optionalProject = projectService.findOne(projectId);
        if (!optionalProject.isPresent()) {
            throw new BadRequestAlertException("There was no project found with that id", ENTITY_NAME, "projectNotFound");
        }
        Project project = optionalProject.get();
        projectSubscription.setProject(project);

        Optional<EntandoVersion> optionalVersion = entandoVersionService.findOne(subscriptionCreationRequest.getEntandoVersionId());
        if (!optionalVersion.isPresent()) {
            throw new BadRequestAlertException("There was no entando version found with that id", ENTITY_NAME, "entandoVersionNotFound");
        }
        projectSubscription.setEntandoVersion(optionalVersion.get());

        ProjectSubscription result = projectSubscriptionService.save(projectSubscription);

        //Create a ticket when the request isn't from an admin
        if (AuthoritiesUtil.isCurrentUserAdminOrSupport()) {
            log.info("Skipping ticket creation since subscription {} for project {} was created by admin", result.getId(), projectId);
        } else {
            log.info("Creating ticket since subscription {} for project {} was created by user", result.getId(), projectId);

            Optional<TicketingSystem> optionalTicketingSystem = ticketingSystemService.getDefaultTicketingSystem();
            if (!optionalTicketingSystem.isPresent()) {
                log.warn("Unable to open subscription request");
            } else {
                TicketingSystem ts = optionalTicketingSystem.get();
                //Prepare the ticket
                Ticket ticket = new Ticket();
                ticket.setSummary("New Subscription Request: " + project.getName());
                ticket.setDescription(String.format("A new subscription has been requested for project %s (%s) to start on %s for %s months",
                    project.getName(), project.getId(), result.getStartDate(), result.getLengthInMonths()));
                ticket.setType("Support");
                ticket.setPriority("High");

                // Create ticket in Jira
                String organizationId = project.getSystemId();
                JSONObject response = new JSONObject(ticketingSystemService.createJiraTicketInOrg(
                    ts.getSystemId(), organizationId, ts.getUrl(),
                    ts.getServiceAccount(), ts.getServiceAccountSecret(), ticket, result.getEntandoVersion(), result.getLevel()));
                String key = response.getString("key");

                // Create ticket in the portal
                Ticket portalTicket = ticketingSystemService.jiraTicketToPortalTicket(ts, key, project);
                ticketService.save(portalTicket);
            }
        }
        return ResponseEntity.created(new URI("/api/project-subscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-subscriptions} : Updates an existing projectSubscription.
     *
     * @param request the projectSubscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectSubscription,
     * or with status {@code 400 (Bad Request)} if the projectSubscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectSubscription couldn't be updated.
     */
    @PutMapping("/project-subscriptions")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<ProjectSubscription> updateProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest request) {
        ProjectSubscription projectSubscription = request.getProjectSubscription();
        log.debug("REST request to update ProjectSubscription : {}", projectSubscription);

        if (projectSubscription == null || projectSubscription.getId() == null || !projectSubscriptionService.findOne(projectSubscription.getId()).isPresent()) {
            throw new BadRequestAlertException("Invalid Project Subscription id", ENTITY_NAME, "projectSubscriptionIdNull");
        }

        Long projectId = request.getProjectId();
        projectService.checkProjectAccess(projectId);

        Optional<Project> associatedProjectOpt = projectService.findOne(projectId);
        if (!associatedProjectOpt.isPresent()) {
            throw new BadRequestAlertException("There was no project found with that id", ENTITY_NAME, "projectNotFound");
        }

        Long entandoVersionId = request.getEntandoVersionId();
        if (entandoVersionId == null) {
            throw new BadRequestAlertException("Missing entando version id", ENTITY_NAME, "missingEntandoVersionId");
        }

        Optional<EntandoVersion> entandoVersionOpt = entandoVersionService.findOne(entandoVersionId);
        if (!entandoVersionOpt.isPresent()) {
            throw new BadRequestAlertException("There was no entando version found with that id", ENTITY_NAME, "entandoVersionNotFound");
        }

        associatedProjectOpt.ifPresent(projectSubscription::setProject);
        entandoVersionOpt.ifPresent(projectSubscription::setEntandoVersion);

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
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
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
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<ProjectSubscription> getProjectSubscription(@PathVariable Long id) {
        log.debug("REST request to get ProjectSubscription : {}", id);
        Optional<ProjectSubscription> projectSubscription = projectSubscriptionService.findOne(id);
        projectSubscription.ifPresent(subscription -> projectService.checkProjectAccess(subscription.getProject().getId()));

        return ResponseUtil.wrapOrNotFound(projectSubscription);
    }

    /**
     * {@code DELETE  /project-subscriptions/:id} : delete the "id" projectSubscription.
     *
     * @param id the id of the projectSubscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-subscriptions/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Void> deleteProjectSubscription(@PathVariable Long id) {
        log.debug("REST request to delete ProjectSubscription : {}", id);

        projectSubscriptionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/project-subscriptions/renew")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<ProjectSubscription> renewProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest subscriptionCreationRequest)
        throws URISyntaxException {
        long entandoVersionId = subscriptionCreationRequest.getEntandoVersionId();
        long projectId = subscriptionCreationRequest.getProjectId();
        log.debug("REST request to renew a subscription : entandoVersionId {}. projectVersionId {}", entandoVersionId, projectId);
        projectService.checkProjectAccess(projectId);

        //For now, a renewal is identical to a new request but starts with existing data so clear the existing subscription id
        subscriptionCreationRequest.getProjectSubscription().setId(null);
        return createProjectSubscription(subscriptionCreationRequest);
    }

}
