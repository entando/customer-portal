package com.entando.customerportal.service.impl;

import com.entando.customerportal.service.TicketingSystemService;
import com.entando.customerportal.domain.TicketingSystem;
import com.entando.customerportal.repository.TicketingSystemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link TicketingSystem}.
 */
@Service
@Transactional
public class TicketingSystemServiceImpl implements TicketingSystemService {

    private final Logger log = LoggerFactory.getLogger(TicketingSystemServiceImpl.class);

    private final TicketingSystemRepository ticketingSystemRepository;

    public TicketingSystemServiceImpl(TicketingSystemRepository ticketingSystemRepository) {
        this.ticketingSystemRepository = ticketingSystemRepository;
    }

    /**
     * Save a ticketingSystem.
     *
     * @param ticketingSystem the entity to save.
     * @return the persisted entity.
     */
    @Override
    public TicketingSystem save(TicketingSystem ticketingSystem) {
        log.debug("Request to save TicketingSystem : {}", ticketingSystem);
        return ticketingSystemRepository.save(ticketingSystem);
    }

    /**
     * Get all the ticketingSystems.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<TicketingSystem> findAll() {
        log.debug("Request to get all TicketingSystems");
        return ticketingSystemRepository.findAll();
    }


    /**
     * Get one ticketingSystem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<TicketingSystem> findOne(Long id) {
        log.debug("Request to get TicketingSystem : {}", id);
        return ticketingSystemRepository.findById(id);
    }

    /**
     * Delete the ticketingSystem by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete TicketingSystem : {}", id);

        ticketingSystemRepository.deleteById(id);
    }

}
