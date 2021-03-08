package com.mycompany.myapp.repository;

import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.Ticket;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Customer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByName(String name);
    
    Optional<Customer> findByCustomerNumber(String customerNumber);
}
