package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.Customer;

import com.mycompany.myapp.domain.Ticket;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Project entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("select project from Project project where project.systemId = ?1")
    Project findProjectBySystemId(String systemId);

    Iterable<Project> findByCustomer(Customer customer);
    List<Project> findByName(String name);
}
