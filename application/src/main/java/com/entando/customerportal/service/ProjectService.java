package com.entando.customerportal.service;

import com.entando.customerportal.domain.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service Interface for managing {@link Project}.
 */
public interface ProjectService {

    /**
     * Save a project.
     *
     * @param project the entity to save.
     * @return the persisted entity.
     */
    Project save(Project project);

    /**
     * Get all the projects.
     *
     * @return the list of entities.
     */
    List<Project> findAll();

    /**
     * Get all the projects with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    Page<Project> findAllWithEagerRelationships(Pageable pageable);


    /**
     * Get the "id" project.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Project> findOne(Long id);

    /**
     * Find a project by name.
     *
     * @param name the name of the project.
     * @return the entity.
     */
    Optional<Project> findByName(String name);

    /**
     * Delete the "id" project.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Add a ticket to a project.
     *
     * @param projectId the project id.
     * @param ticketId the ticket id.
     * @return the persisted entity.
     */
    Project addTicketToProject(Long projectId, Long ticketId);

    /**
     * Get project tickets by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Set<Ticket> getProjectTickets(Long id);

    /**
     * Add a subscription to a project.
     *
     * @param projectId the project id.
     * @param subscriptionId the subscription id.
     * @return the persisted entity.
     */
    Project addSubscriptionToProject(Long projectId, Long subscriptionId);

    /**
     * Get project subscriptions by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Set<ProjectSubscription> getProjectSubscriptions(Long id);

    /**
     * Add a partner to a project.
     *
     * @param projectId the project id.
     * @param partnerId the partner id.
     * @return the persisted entity.
     */
    Project addPartnerToProject(Long projectId, Long partnerId);

    /**
     * Get project partners by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Set<Partner> getProjectPartners(Long id);

    /**
     * Add a portal user to a project.
     *
     * @param projectId the project id.
     * @param userId    the user id.
     * @return the persisted entity.
     */
    Project addUserToProject(Long projectId, Long userId);

    /**
     * Delete partner from a project.
     *
     * @param projectId the project id.
     * @param partnerId the user id.
     * @return the persisted entity.
     */
    Project deletePartnerFromProject(Long projectId, Long partnerId);


    /**
     * Delete subscription from a project.
     *
     * @param projectId      the project id.
     * @param subscriptionId the subscription id.
     * @return the persisted entity.
     */
    Project deleteSubscriptionFromProject(Long projectId, Long subscriptionId);

    /**
     * Delete user from a project.
     *
     * @param projectId the project id.
     * @param userId    the user id.
     * @return the persisted entity.
     */
    Project deleteUserFromProject(Long projectId, Long userId);

    /**
     * Get project users by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Set<PortalUser> getProjectUsers(Long id);

    /**
     * Check if the current user has access to a project via admin role or direct assignment
     */
    boolean hasProjectAccess(Long projectId);

    /**
     * Check if the current user has access to the project
     *
     * @param projectId
     * @throws RuntimeException if the user doesn't have access
     */
    void checkProjectAccess(Long projectId) throws RuntimeException;

    /**
     * Get the current active subscription for a project
     */
    public Optional<ProjectSubscription> getActiveSubscription(Project project);

}
