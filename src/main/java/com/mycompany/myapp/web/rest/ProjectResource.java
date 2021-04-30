package com.mycompany.myapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.validation.Valid;

import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.security.SpringSecurityAuditorAware;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myapp.constant.CustportAppConstant;
import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.Partner;
import com.mycompany.myapp.domain.PortalUser;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.ProjectSubscription;
import com.mycompany.myapp.domain.Ticket;
import com.mycompany.myapp.response.model.SubscriptionDetailResponse;
import com.mycompany.myapp.response.model.SubscriptionListResponse;
import com.mycompany.myapp.service.CustomerService;
import com.mycompany.myapp.service.ProjectService;
import com.mycompany.myapp.service.TicketService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Project}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    private static final String ENTITY_NAME = "custportAppProject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectService projectService;

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    @Autowired
    private CustomerService customerService;

    public ProjectResource(ProjectService projectService) {
        this.projectService = projectService;
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


        List<Project> projects = projectService.findAll();
        for (Project p : projects) {
            if (p.getSystemId().equals(project.getSystemId()) && !project.getId().equals(p.getId()) && !project.getSystemId().trim().isEmpty()) {
                throw new BadRequestAlertException("A new project must have a unique system id", ENTITY_NAME, "systemidexists");
            }
        }

        if (project.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
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

    @GetMapping("/projects/subscriptions/customer/{customerNumber}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<List<SubscriptionListResponse>> getSubscriptionsForCustomer(@PathVariable String customerNumber) {
        List<SubscriptionListResponse> subscriptionList = new ArrayList<>();

        try {
            Optional<Customer> customer = customerService.findByCustomerNumber(customerNumber);

            if (customer.isPresent()) {
                SimpleDateFormat sdf = new SimpleDateFormat(CustportAppConstant.DATE_FORMAT);
                Set<Project> projects = customer.get().getProjects();

                for (Project project : projects) {
                    SubscriptionListResponse subscription = new SubscriptionListResponse();

                    subscription.setProjectName(project.getName());
                    if (!project.getPartners().isEmpty()) {
                        List<String> partners = new ArrayList<>();
                        project.getPartners().stream().forEachOrdered(partner -> partners.add(partner.getName()));
                        subscription.setPartners(partners);
                    }

                    if (project.getProjectSubscriptions().stream().findFirst().isPresent()) {
                        ProjectSubscription projectSubscription = project.getProjectSubscriptions().stream().findFirst().get();
                        subscription.setSubscriptionId(projectSubscription.getId());
                        subscription.setStartDate(sdf.format(Date.from(projectSubscription.getStartDate().toInstant())));
                        subscription.setEndDate(sdf.format(Date.from(projectSubscription.getStartDate().plusMonths(projectSubscription.getLengthInMonths()).toInstant())));

                        if (projectSubscription.getEntandoVersion() != null) {
                            subscription.setEntandoVersion(projectSubscription.getEntandoVersion().getName());
                        }
                    }
                    subscription.setTickets(project.getTickets().size());

                    subscriptionList.add(subscription);
                }
            }
        } catch (Exception e) {
            log.error("Error occurred while fetching subscriptions for customer number : " + customerNumber, e);
        }

        return new ResponseEntity<>(subscriptionList, HttpStatus.OK);
    }

    @GetMapping("/projects/subscriptions/detail")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<SubscriptionDetailResponse> getSubscriptionDetail(
        @RequestParam(value = "projectId") Long projectId) {

        //TODO
        SubscriptionDetailResponse subscriptionDetail = new SubscriptionDetailResponse();
        SimpleDateFormat sdf = new SimpleDateFormat("MMM yyyy");

        Optional<Project> returnedProject = projectService.findOne(projectId);

        if (returnedProject.isPresent()) {
            Project project = returnedProject.get();

            subscriptionDetail.setProjectName(project.getName());
            subscriptionDetail.setDescription(project.getDescription());
            ProjectSubscription projectSubscription = project.getProjectSubscriptions().stream().findFirst().get(); // assume there is only one subscription per project
            subscriptionDetail.setLevel(projectSubscription.getLevel().name());
            subscriptionDetail.setStartDate(sdf.format(projectSubscription.getStartDate()));
            subscriptionDetail.setPartner(project.getPartners().stream().findFirst().get().getName()); // assume there is only one partner per project
        }

        return new ResponseEntity<>(subscriptionDetail, HttpStatus.OK);
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
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
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
        //TODO:
        Project result = projectService.addTicketToProject(projectId, ticketId);

        return ResponseEntity
            .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /projects/:projectId/tickets} : get the tickets of "projctId" project.
     *
     * @param projectId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     * the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{projectId}/tickets")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Set<Ticket>> getProjectTickets(@PathVariable Long projectId) {
        //TODO
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
    public ResponseEntity<List<ProjectSubscription>> getProjectSubscriptions(@PathVariable Long projectId) {
        List<ProjectSubscription> subscriptions = projectService.getProjectSubscriptions(projectId);
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
        log.debug("REST request to add Ticket to Project : {}", projectId);
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
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
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
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, projectId.toString()))
            .body(users);
    }

    @GetMapping("/projects/nameId")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Map<Long, String>> getProjectIdsAndNames() {
        List<Project> projects = projectService.findAll();
        Map<Long, String> projectIdNameMap = new HashMap<>();
        projects.forEach(project -> {
            projectIdNameMap.put(project.getId(), project.getName());
        });

        return new ResponseEntity<>(projectIdNameMap, HttpStatus.OK);
    }

    @GetMapping("/projects/myprojects/nameId")
    @PreAuthorize(AuthoritiesConstants.HAS_CUSTOMER_OR_PARTNER)
    public ResponseEntity<Map<Long, String>> getMyProjectIdsAndNames() {
        List<Project> projects = projectService.findAll();
        String currentUser = springSecurityAuditorAware.getCurrentUserLogin().get();
        Map<Long, String> projectIdNameMap = new HashMap<>();
        projects.forEach(project -> {
            Set<PortalUser> users = projectService.getProjectUsers(project.getId());
            for (PortalUser user : users) {
                if (currentUser.equals(user.getUsername())) {
                    projectIdNameMap.put(project.getId(), project.getName());
                    break;
                }
            }
        });

        return new ResponseEntity<>(projectIdNameMap, HttpStatus.OK);
    }

    /**
     * {@code GET  /projects/admin} : get all the Projects.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customers in body.
     */
    @GetMapping("/projects/admin")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public List<Project> adminGetAllProjects() {
        log.debug("REST request to get all Projects");
        return projectService.findAll();
    }

    /**
     * {@code GET  /projects/myprojects} : get all the customers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customers in body.
     */
    @GetMapping("/projects/myprojects")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public List<Project> getMyProjects() {
        log.debug("REST request to get user's Projects");

        String currentUser = springSecurityAuditorAware.getCurrentUserLogin().get();
        List<Project> projects = projectService.findAll();
        Set<Project> result = new HashSet<>();
        for (Project project : projects) {
            Set<PortalUser> users = projectService.getProjectUsers(project.getId());
            for (PortalUser user : users) {
                if (currentUser.equals(user.getUsername())) {
                    result.add(project);
                    break;
                }
            }
        }
        return new ArrayList<>(result);
    }

    /**
     * {@code GET  /projects/myproject/:id} : get the "id" project.
     *
     * @param id the id of the project to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/myproject/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Project> getMyProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        Optional<Project> project = projectService.findOne(id);

        String currentUser = springSecurityAuditorAware.getCurrentUserLogin().get();
        Set<PortalUser> projectUsers = projectService.getProjectUsers(project.get().getId());
        for (PortalUser user : projectUsers) {
            if (user.getUsername().equals(currentUser)) {
                return ResponseUtil.wrapOrNotFound(project);
            }
        }
        return null;
    }

    /**
     * {@code GET  /projects/myproject/:id} : get the users for my project.
     *
     * @param id the id of the project to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/myproject/{id}/users")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Set<PortalUser>> getMyProjectUsers(@PathVariable Long id) {
        log.debug("REST request to get my Project users: {}", id);
        ResponseEntity<Project> project = getMyProject(id);
        if (!project.getStatusCode().is2xxSuccessful()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return getProjectUsers(id);
    }
}
