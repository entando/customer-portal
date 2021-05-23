package com.entando.customerportal.service;

import com.entando.customerportal.domain.TicketingSystem;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link TicketingSystem}.
 */
public interface TicketingSystemService {

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

}
