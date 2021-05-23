package com.entando.customerportal.repository;

import com.entando.customerportal.domain.TicketingSystem;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the TicketingSystem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketingSystemRepository extends JpaRepository<TicketingSystem, Long> {
    @Query("select ticketingsystem from TicketingSystem ticketingsystem where ticketingsystem.systemId = ?1")
    TicketingSystem findTicketingSystemBySystemId(String systemId);
}
