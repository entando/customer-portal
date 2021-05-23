package com.entando.customerportal.service;

import com.entando.customerportal.domain.ProjectSubscription;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ProjectSubscription}.
 */
public interface ProjectSubscriptionService {

    /**
     * Save a projectSubscription.
     *
     * @param projectSubscription the entity to save.
     * @return the persisted entity.
     */
    ProjectSubscription save(ProjectSubscription projectSubscription);

    /**
     * Get all the projectSubscriptions.
     *
     * @return the list of entities.
     */
    List<ProjectSubscription> findAll();


    /**
     * Get the "id" projectSubscription.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProjectSubscription> findOne(Long id);

    /**
     * Delete the "id" projectSubscription.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
