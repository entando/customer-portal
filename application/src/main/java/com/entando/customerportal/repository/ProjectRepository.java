package com.entando.customerportal.repository;

import com.entando.customerportal.domain.Customer;
import com.entando.customerportal.domain.Project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Project entity.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("select distinct p from Project p " +
        "join Customer c on c.id = p.customer.id " +
        "join PortalUser u on u member of p.users " +
        "where c.id = ?1 " +
        "and u.id = ?2 " +
        "order by p.name")
    List<Project> findByCustomerAndUser(long customerId, long userId);

    @Query("select distinct p from Project p " +
        "join Customer c on c.id = p.customer.id " +
        "where c.id = ?1 " +
        "order by p.name")
    List<Project> findByCustomer(Long customerId);

    //Note: eventually should probably replace prior method with an Iterable the Spring Data way
    // Iterable<Project> findByCustomer(Customer customer);

    @Query(value = "select distinct project from Project project left join fetch project.users",
        countQuery = "select count(distinct project) from Project project")
    Page<Project> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct project from Project project left join fetch project.users")
    List<Project> findAllWithEagerRelationships();

    @Query("select project from Project project left join fetch project.users where project.id =:id")
    Optional<Project> findOneWithEagerRelationships(@Param("id") Long id);

    List<Project> findByName(String name);
}
