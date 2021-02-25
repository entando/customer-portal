package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Ticket;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Ticket}.
 */
public interface TicketService {

    /**
     * Save a ticket.
     *
     * @param ticket the entity to save.
     * @return the persisted entity.
     */
    Ticket save(Ticket ticket);

    /**
     * Get all the tickets.
     *
     * @return the list of entities.
     */
    List<Ticket> findAll();


    /**
     * Get the "id" ticket.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Ticket> findOne(Long id);

    /**
     * Delete the "id" ticket.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

}
