package com.entando.customerportal.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entando.customerportal.domain.Customer;
import com.entando.customerportal.domain.Project;
import com.entando.customerportal.repository.CustomerRepository;
import com.entando.customerportal.repository.ProjectRepository;
import com.entando.customerportal.service.CustomerService;

/**
 * Service Implementation for managing {@link Customer}.
 */
@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);

    private final CustomerRepository customerRepository;
    private final ProjectRepository projectRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, ProjectRepository projectRepository) {
        this.customerRepository = customerRepository;
        this.projectRepository = projectRepository;
    }

    /**
     * Save a customer.
     *
     * @param customer the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Customer save(Customer customer) {
        log.debug("Request to save Customer : {}", customer);
        return customerRepository.save(customer);
    }

    /**
     * Get all the customers.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Customer> findAll() {
        log.debug("Request to get all Customers");
        return customerRepository.findAll();
    }


    /**
     * Get one customer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Customer> findOne(Long id) {
        log.debug("Request to get Customer : {}", id);
        return customerRepository.findById(id);
    }

    /**
     * Delete the customer by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Customer : {}", id);

        customerRepository.deleteById(id);
    }

    /**
     * Add a project to a customer.
     *
     * @param customerId the partner id.
     * @param projectId the project id.
     * @return the persisted entity.
     */
    @Override
    public Customer addProjectToCustomer(Long customerId, Long projectId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        Optional<Project> project = projectRepository.findById(projectId);
        customer.get().addProject(project.get());
        return customerRepository.save(customer.get());
    }

    /**
     * Get customer projects by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    public Set<Project> getCustomerProjects(Long id) {
        return customerRepository.findById(id).get().getProjects();
    }

    @Override
    public Optional<Customer> findByCustomerNumber(String customerNumber) {
        return customerRepository.findByCustomerNumber(customerNumber);
    }

    @Override
    public List<Customer> findAllByUser(Long portalUserId) {
        return customerRepository.findAllByUser(portalUserId);
    }

    @Override
    public Optional<Customer> findOneByUser(Long companyId, Long portalUserId) {
        return customerRepository.findOneByUser(companyId, portalUserId);
    }
}
