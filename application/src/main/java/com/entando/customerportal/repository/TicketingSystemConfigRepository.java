package com.entando.customerportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entando.customerportal.domain.TicketingSystemConfig;

@Repository
public interface TicketingSystemConfigRepository extends JpaRepository<TicketingSystemConfig, Long> {

}
