package com.mycompany.myapp.service;

import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.Customer;

/**
 * Service Interface for managing {@link Customer}.
 */
public interface CustomerService {

    /**
     * Save a customer.
     *
     * @param customer the entity to save.
     * @return the persisted entity.
     */
    Customer save(Customer customer);

    /**
     * Get all the customers.
     *
     * @return the list of entities.
     */
    List<Customer> findAll();


    /**
     * Get the "id" customer.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Customer> findOne(Long id);

    /**
     * Delete the "id" customer.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
    
    Optional<Customer> findByCustomerNumber(String customerNumber);
}
