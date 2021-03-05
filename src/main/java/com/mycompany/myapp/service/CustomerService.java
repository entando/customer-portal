package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.PortalUser;
import com.mycompany.myapp.domain.Project;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    /**
     * Add a project to a customer.
     *
     * @param projectId the project id.
     * @param customerId the partner id.
     * @return the persisted entity.
     */
    Customer addProjectToCustomer(Long customerId, Long projectId);

    /**
     * Get customer projects by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Set<Project> getCustomerProjects(Long id);
}
