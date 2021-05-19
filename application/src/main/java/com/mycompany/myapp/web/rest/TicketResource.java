package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.domain.enumeration.SubscriptionLevel;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.service.JiraTicketingSystemService;
import com.mycompany.myapp.service.ProjectService;
import com.mycompany.myapp.service.TicketService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Ticket}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class TicketResource {

    private final Logger log = LoggerFactory.getLogger(TicketResource.class);

    private static final String ENTITY_NAME = "custportAppTicket";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketService ticketService;
    private final JiraTicketingSystemService ticketingSystemService;
    private final ProjectService projectService;

    public TicketResource(TicketService ticketService,
                          JiraTicketingSystemService ticketingSystemService,
                          ProjectService projectService) {
        this.ticketService = ticketService;
        this.ticketingSystemService = ticketingSystemService;
        this.projectService = projectService;
    }

    /**
     * {@code POST  /tickets} : Create a new ticket.
     *
     * @param ticket the ticket to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticket, or with status {@code 400 (Bad Request)} if the ticket has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tickets")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) throws URISyntaxException {
        log.debug("REST request to save Ticket : {}", ticket);
        if (ticket.getId() != null) {
            throw new BadRequestAlertException("A new ticket cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ticket result = ticketService.save(ticket);
        return ResponseEntity.created(new URI("/api/tickets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /tickets} : get all the tickets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tickets in body.
     */
    @GetMapping("/tickets")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public List<Ticket> getAllTickets() {
        log.debug("REST request to get all Tickets");
        return ticketService.findAll();
    }

    /**
     * {@code GET  /tickets/:id} : get the "id" ticket.
     *
     * @param id the id of the ticket to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticket, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tickets/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        log.debug("REST request to get Ticket : {}", id);
        Optional<Ticket> ticket = ticketService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ticket);
    }

    /**
     * {@code DELETE  /tickets/:id} : delete the "id" ticket.
     *
     * @param id the id of the ticket to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tickets/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        log.debug("REST request to delete Ticket : {}", id);

        ticketService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code GET  /tickets/ticketingsystem/:projectId} : get all the tickets in project.
     *
     * @param projectId the projectId of the tickets to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tickets in body.
     */
    @GetMapping("/tickets/ticketingsystem/{projectId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public List<Ticket> getJiraTicketsByProject(@PathVariable Long projectId)
        throws URISyntaxException {
        log.debug("REST request to get all Tickets by projectId: {}", projectId);
        projectService.checkProjectAccess(projectId);

        List<Ticket> resultTickets = new ArrayList<>();

        Optional<Project> optionalProject = projectService.findOne(projectId);
        if (!optionalProject.isPresent()) {
            throw new IllegalArgumentException("Project could not be found " + projectId);
        }

        Project project = optionalProject.get();
        String projectOrganizationId = project.getSystemId();
        if (projectOrganizationId == null || projectOrganizationId.trim().isEmpty()) {
            throw new IllegalAccessError("No systemId is configured for the project " + projectId);
        }

        TicketingSystem ts = getTicketingSystem();

        //Notes: may need to address design/performance issues here. Retrieving all tickets on every fetch and then updating them won't scale
        JSONObject response = new JSONObject(ticketingSystemService.fetchJiraTicketsBySystemIdAndOrganization(
            ts.getSystemId(), projectOrganizationId, ts.getUrl(), ts.getServiceAccount(), ts.getServiceAccountSecret()));

        JSONArray issues = new JSONArray(response.getJSONArray("issues"));

        // loop through tickets and check if they exist as Tickets in the db
        for (Object issue : issues) {
            JSONObject jsonIssue = (JSONObject) issue;
            String jiraKey = jsonIssue.getString("key");
            Ticket t = ticketService.findTicketBySystemId(jiraKey);
            // if Ticket exists in the db, check to see if any values have changed
            if (t != null) {
                log.debug("Ticket already exists. Updating values if needed. {}", jiraKey);
                t.setDescription((String) jsonIssue.getJSONObject("fields").get("summary"));
                t.setType((String) jsonIssue.getJSONObject("fields").getJSONObject("issuetype").get("name"));
                t.setPriority((String) jsonIssue.getJSONObject("fields").getJSONObject("priority").get("name"));
                t.setStatus(jsonIssue.getJSONObject("fields").getJSONObject("status").getString("name"));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSX");
                // Create Date
                String createdDate = jsonIssue.getJSONObject("fields").getString("created");
                ZonedDateTime formattedDate = ZonedDateTime.parse(createdDate, formatter);
                if (t.getCreateDate() != formattedDate) {
                    t.setCreateDate(formattedDate);
                }

                //Update Date
                String updatedDate = jsonIssue.getJSONObject("fields").getString("updated");
                formattedDate = ZonedDateTime.parse(updatedDate, formatter);
                if (t.getUpdateDate() != formattedDate) {
                    t.setUpdateDate(formattedDate);
                }
                ticketService.save(t);
                resultTickets.add(t);
            }
            // else create a Ticket
            else {
                log.debug("Creating ticket {}", jiraKey);
                Ticket prepareTicketToCreate = ticketingSystemService.jiraTicketToPortalTicket(ts, jiraKey, project);
                resultTickets.add(prepareTicketToCreate);
                createTicket(prepareTicketToCreate);
            }
        }

        return resultTickets;
    }

    /**
     * {@code GET  /tickets/ticketingsystem/:projectId} : Creating a new jira ticket in a project.
     * @param projectId the projectId for the ticket
     * @return the JSON response
     */
    @PostMapping("/tickets/ticketingsystem/{projectId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Ticket> createJiraTicketInProject(@PathVariable Long projectId, @Valid @RequestBody Ticket ticket)
        throws URISyntaxException {
        log.debug("REST request to create Jira ticket in projectId: {}", projectId);

        Optional<Project> optionalProject = projectService.findOne(projectId);
        if (!optionalProject.isPresent()) {
            throw new IllegalArgumentException("Project unavailable");
        }
        projectService.checkProjectAccess(projectId);

        Project project = optionalProject.get();
        TicketingSystem ts = getTicketingSystem();
        Optional<ProjectSubscription> optionalSubscription = projectService.getActiveSubscription(project);
        if (!optionalSubscription.isPresent()) {
            log.warn("No active subscription for {}", projectId);
            throw new IllegalStateException("No active subscription " + projectId);
        }

        ProjectSubscription subscription = optionalSubscription.get();
        EntandoVersion version = subscription.getEntandoVersion();
        SubscriptionLevel level = subscription.getLevel();

        // Create ticket in Jira
        String organizationId = project.getSystemId();
        JSONObject response = new JSONObject(ticketingSystemService.createJiraTicketInOrg(
            ts.getSystemId(), organizationId, ts.getUrl(),
            ts.getServiceAccount(), ts.getServiceAccountSecret(), ticket, version, level));

        // Create ticket in the portal
        String key = response.getString("key");
        Ticket portalTicket = ticketingSystemService.jiraTicketToPortalTicket(ts, key, project);
        return createTicket(portalTicket);
    }

    private TicketingSystem getTicketingSystem() {
        Optional<TicketingSystem> optionalTicketingSystem = ticketingSystemService.getDefaultTicketingSystem();
        if (!optionalTicketingSystem.isPresent()) {
            String msg = "No ticketing system is configured";
            log.warn(msg);
            throw new IllegalStateException(msg);
        }
        return optionalTicketingSystem.get();
    }

}
