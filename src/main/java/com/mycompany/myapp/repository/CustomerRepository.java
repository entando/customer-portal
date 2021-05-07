package com.mycompany.myapp.repository;

import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.Customer;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Customer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("select c from Customer c " +
        "join Project p on p.customer.id = c.id " +
        "join PortalUser u on u member of p.users " +
        "where u.id = ?1")
    List<Customer> findAllByUser(long userId);

    @Query("select distinct c from Customer c " +
        "join Project p on p.customer.id = c.id " +
        "join PortalUser u on u member of p.users " +
        "where c.id = ?1 and u.id = ?2")
    Optional<Customer> findOneByUser(long companyId, long userId);

    List<Customer> findByName(String name);

    Optional<Customer> findByCustomerNumber(String customerNumber);

    @Override
    @Query
    public List<Customer> findAll();
}
