package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.Ticket;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Ticket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("select ticket from Ticket ticket where ticket.systemId = ?1")
    List<Ticket> findTicketsBySystemId(String name);
}
