package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.TicketingSystem;
import com.mycompany.myapp.domain.Ticket;
import org.json.JSONObject;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link TicketingSystem}.
 */
public interface JiraTicketingSystemService {

    /**
     * Save a ticketingSystem.
     *
     * @param ticketingSystem the entity to save.
     * @return the persisted entity.
     */
    TicketingSystem save(TicketingSystem ticketingSystem);

    /**
     * Get all the ticketingSystems.
     *
     * @return the list of entities.
     */
    List<TicketingSystem> findAll();


    /**
     * Get the "id" ticketingSystem.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<TicketingSystem> findOne(Long id);

    /**
     * Delete the "id" ticketingSystem.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get the "systemId" ticketingSystem.
     *
     * @param systemId the systemId of the entity.
     * @return the entity.
     */
    TicketingSystem findTicketingSystemBySystemId(String systemId);

    /**
     * Get all the tickets corresponding to the systemId.
     *
     * @param systemId the systemId of the Jira project.
     * @return the JSON list of Tickets.
     */
    String fetchJiraTicketsBySystemId(String systemId, String url, String serviceAccount, String serviceAccountSecret);

    /**
     * Get all the tickets corresponding to the systemId.
     *
     * @param systemId the systemId of the Jira project.
     * @return the JSON list of Tickets.
     */
    String fetchSingleJiraTicketBySystemId(String systemId, String url, String serviceAccount, String serviceAccountSecret);

    /**
     * Creating a new Jira ticket.
     *
     * @param systemId the systemId of the Jira ticket.
     * @return the JSON response
     */
    String createJiraTicket(String systemId, String url, String serviceAccount, String serviceAccountSecret,
                            Ticket ticket);

    /**
     * Updating a Jira ticket.
     *
     * @param systemId the systemId of the Jira ticket.
     * @return the JSON response
     */
    String updateJiraTicket(String systemId, String url, String serviceAccount, String serviceAccountSecret,
                            Ticket ticket);

    /**
     * Deleting a Jira ticket.
     *
     * @param systemId the systemId of the ticket
     */
    String deleteJiraTicket(String systemId, String url, String serviceAccount, String serviceAccountSecret);
}
