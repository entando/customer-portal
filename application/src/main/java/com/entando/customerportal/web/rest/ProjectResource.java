package com.entando.customerportal.web.rest;

import com.entando.customerportal.domain.*;
import com.entando.customerportal.security.AuthoritiesConstants;
import com.entando.customerportal.security.AuthoritiesUtil;
import com.entando.customerportal.security.SpringSecurityAuditorAware;
import com.entando.customerportal.service.CustomerService;
import com.entando.customerportal.service.PortalUserService;
import com.entando.customerportal.service.ProjectService;
import com.entando.customerportal.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * REST controller for managing {@link com.entando.customerportal.domain.Project}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    private static final String ENTITY_NAME = "custportAppProject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomerService customerService;
    private final ProjectService projectService;
    private final PortalUserService portalUserService;

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    public ProjectResource(CustomerService customerService, ProjectService projectService, PortalUserService portalUserService) {
        this.customerService = customerService;
        this.projectService = projectService;
        this.portalUserService = portalUserService;
    }

    /**
     * {@code POST  /projects} : Create a new project.
     *
     * @param project the project to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Project> createProject(@Valid @RequestBody Project project) throws URISyntaxException {
        log.debug("REST request to save Project : {}", project);

        List<Project> projects = projectService.findAll();
        for (Project p : projects) {
            if (p.getSystemId().equals(project.getSystemId()) && !project.getSystemId().trim().isEmpty()) {
                throw new BadRequestAlertException("A new project must have a unique system id", ENTITY_NAME, "systemidexists");
            }
        }

        if (project.getId() != null) {
            throw new BadRequestAlertException("A new project cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Project result = projectService.save(project);
        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /projects} : Updates an existing project.
     *
     * @param project the project to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     * the updated project, or with status {@code 400 (Bad Request)} if the
     * project is not valid, or with status
     * {@code 500 (Internal Server Error)} if the project couldn't be
     * updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/projects")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Project> updateProject(@Valid @RequestBody Project project) throws URISyntaxException {
        log.debug("REST request to update Project : {}", project);
        Long projectId = project.getId();

        if (projectId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        List<Project> projects = projectService.findAll();
        for (Project p : projects) {
            if (p.getSystemId().equals(project.getSystemId()) && !projectId.equals(p.getId()) && !project.getSystemId().trim().isEmpty()) {
                throw new BadRequestAlertException("A new project must have a unique system id", ENTITY_NAME, "systemidexists");
            }
        }

        //Note: there's probably a Spring way to do this but retrieve the existing users so they don't get lost on the update
        projectService.findOne(projectId).ifPresent(p -> project.setUsers(p.getUsers()));

        Project result = projectService.save(project);
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, project.getId().toString()))
            .body(result);
    }

    @GetMapping("/projects")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public List<Project> getAllProjects() {
        log.debug("REST request to get all Projects");
        return projectService.findAll();
    }

    /**
     * {@code GET  /projects/customers/:id} : get the projects for the customer
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projects in the body.
     */
    @GetMapping("/projects/customer/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public List<Project> getCustomerProjects(@PathVariable Long id) {
        log.debug("REST request to get all Projects for the customer");

        if (AuthoritiesUtil.isCurrentUserAdminOrSupport()) {
            return projectService.findByCustomer(id);
        } else {
            Optional<Long> userId = portalUserService.getCurrentPortalUserId();
            if (userId.isPresent()) {
                return projectService.findByCustomerAndUser(id, userId.get());
            }
        }
        return new ArrayList<>();
    }


    /**
     * {@code GET  /projects/:id} : get the "id" project.
     *
     * @param id the id of the project to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     * the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        Optional<Project> project = Optional.empty();
        if (projectService.hasProjectAccess(id)) {
            project = projectService.findOne(id);
        }
        return ResponseUtil.wrapOrNotFound(project);
    }

    /**
     * {@code DELETE  /projects/:id} : delete the "id" project.
     *
     * @param id the id of the project to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/projects/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        log.debug("REST request to delete Project : {}", id);

        projectService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /projects/:projectId/tickets/:ticketId} : Add a ticket to a project.
     *
     * @param projectId the project id.
     * @param ticketId  the ticket id.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects/{projectId}/tickets/{ticketId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Project> addTicketToProject(@PathVariable Long projectId, @PathVariable Long ticketId) throws URISyntaxException {
        log.debug("REST request to add Ticket to Project : {}", projectId);
        projectService.checkProjectAccess(projectId);

        Project result = projectService.addTicketToProject(projectId, ticketId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /projects/:projectId/tickets} : get the tickets of the project
     *
     * @param projectId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     * the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{projectId}/tickets")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Set<Ticket>> getProjectTickets(@PathVariable Long projectId) {
        projectService.checkProjectAccess(projectId);
        Set<Ticket> tickets = projectService.getProjectTickets(projectId);
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, projectId.toString()))
            .body(tickets);
    }

    /**
     * {@code POST  /projects/:projectId/subscriptions/:subscriptionId} : Add a subscription to a project.
     *
     * @param projectId      the project id.
     * @param subscriptionId the subscription id.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects/{projectId}/subscriptions/{subscriptionId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Project> addSubscriptionToProject(@PathVariable Long projectId, @PathVariable Long subscriptionId) throws URISyntaxException {
        log.debug("REST request to add Ticket to Project : {}", projectId);
        projectService.checkProjectAccess(projectId);
        Project result = projectService.addSubscriptionToProject(projectId, subscriptionId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /projects/:projectId/subscriptions} : get the subscriptions of "projectId" project.
     *
     * @param projectId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     * the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{projectId}/subscriptions")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Set<ProjectSubscription>> getProjectSubscriptions(@PathVariable Long projectId) {
        log.debug("REST request to get project subscriptions : {}", projectId);
        projectService.checkProjectAccess(projectId);
        Set<ProjectSubscription> subscriptions = projectService.getProjectSubscriptions(projectId);
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, projectId.toString()))
            .body(subscriptions);
    }

    /**
     * {@code POST  /projects/:projectId/partners/:partnerId} : Add a partner to a project.
     *
     * @param projectId the project id.
     * @param partnerId the partner id.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects/{projectId}/partners/{partnerId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Project> addPartnerToProject(@PathVariable Long projectId, @PathVariable Long partnerId) throws URISyntaxException {
        log.debug("REST request to add Partner to Project : {}", projectId);
        Project result = projectService.addPartnerToProject(projectId, partnerId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /projects/:projectId/partners} : get the partners of "projectId" project.
     *
     * @param projectId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     * the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{projectId}/partners")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Set<Partner>> getProjectPartners(@PathVariable Long projectId) {
        Set<Partner> partners = projectService.getProjectPartners(projectId);
        projectService.checkProjectAccess(projectId);
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, projectId.toString()))
            .body(partners);
    }

    /**
     * {@code POST  /projects/:projectId/users/:userId} : Add a user to a project.
     *
     * @param projectId the project id.
     * @param userId    the user id.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects/{projectId}/users/{userId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Project> addUserToProject(@PathVariable Long projectId, @PathVariable Long userId) throws URISyntaxException {
        log.debug("REST request to add a user to Project : {}", projectId);
        Project result = projectService.addUserToProject(projectId, userId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code DELETE /projects/:projectId/partners/:partnerId} : Delete a partner from a project.
     *
     * @param projectId the project id.
     * @param partnerId the portal user id.
     * @return the {@link ResponseEntity} with status {@code 201 (Deleted)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project was not found
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @DeleteMapping("/projects/{projectId}/partners/{partnerId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Project> deletePartnerFromProject(@PathVariable Long projectId, @PathVariable Long partnerId) throws URISyntaxException {
        log.debug("REST request to delete partner {} from Project {}", partnerId, projectId);
        Project result = projectService.deletePartnerFromProject(projectId, partnerId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }


    /**
     * {@code DELETE /projects/:projectId/subscriptions/:subscriptionId} : Delete a subscription from a project.
     *
     * @param projectId      the project id.
     * @param subscriptionId the subscription id.
     * @return the {@link ResponseEntity} with status {@code 201 (Deleted)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project was not found
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @DeleteMapping("/projects/{projectId}/subscriptions/{subscriptionId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Project> deleteSubscriptionFromProject(@PathVariable Long projectId, @PathVariable Long subscriptionId) throws URISyntaxException {
        log.debug("REST request to delete subscription {} from Project {}", subscriptionId, projectId);
        Project result = projectService.deleteSubscriptionFromProject(projectId, subscriptionId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code DELETE /projects/:projectId/users/:userId} : Delete a user from a project.
     *
     * @param projectId the project id.
     * @param userId    the portal user id.
     * @return the {@link ResponseEntity} with status {@code 201 (Deleted)} and with
     * body the new project, or with status {@code 400 (Bad Request)} if the
     * project was not found
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @DeleteMapping("/projects/{projectId}/users/{userId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Project> deleteUserFromProject(@PathVariable Long projectId, @PathVariable Long userId) throws URISyntaxException {
        log.debug("REST request to delete user {} from Project {}", userId, projectId);
        Project result = projectService.deleteUserFromProject(projectId, userId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /projects/:projectId/users} : get the users of "projectId" project.
     *
     * @param projectId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     * the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{projectId}/users")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Set<PortalUser>> getProjectUsers(@PathVariable Long projectId) {
        Set<PortalUser> users = projectService.getProjectUsers(projectId);
        projectService.checkProjectAccess(projectId);
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, projectId.toString()))
            .body(users);
    }
}
