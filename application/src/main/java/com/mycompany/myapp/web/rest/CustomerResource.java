package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.security.AuthoritiesUtil;
import com.mycompany.myapp.security.SpringSecurityAuditorAware;
import com.mycompany.myapp.service.CustomerService;
import com.mycompany.myapp.service.PortalUserService;
import com.mycompany.myapp.service.ProjectService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Customer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class CustomerResource {

    private final Logger log = LoggerFactory.getLogger(CustomerResource.class);

    private static final String ENTITY_NAME = "custportAppCustomer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CustomerService customerService;
    private final PortalUserService portalUserService;
    private final ProjectService projectService;

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    public CustomerResource(CustomerService customerService, PortalUserService portalUserService, ProjectService projectService) {
        this.customerService = customerService;
        this.portalUserService = portalUserService;
        this.projectService = projectService;
    }

    /**
     * {@code POST  /customers} : Create a new customer.
     *
     * @param customer the customer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customer, or with status {@code 400 (Bad Request)} if the customer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/customers")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) throws URISyntaxException {
        log.debug("REST request to save Customer : {}", customer);
        if (customer.getId() != null) {
            throw new BadRequestAlertException("A new customer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Customer result = customerService.save(customer);
        return ResponseEntity.created(new URI("/api/customers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /customers} : Updates an existing customer.
     *
     * @param customer the customer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customer,
     * or with status {@code 400 (Bad Request)} if the customer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customer couldn't be updated.
     */
    @PutMapping("/customers")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Customer> updateCustomer(@Valid @RequestBody Customer customer) {
        log.debug("REST request to update Customer : {}", customer);
        if (customer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Customer result = customerService.save(customer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customer.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /customers} : get all the customers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customers in body.
     */
    @GetMapping("/customers")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public List<Customer> getAllCustomers() {
        log.debug("REST request to get all Customers");

        if (AuthoritiesUtil.isCurrentUserAdminOrSupport()) {
            return customerService.findAll();
        } else {
            Optional<Long> userId = portalUserService.getCurrentPortalUserId();
            if (userId.isPresent()) {
                return customerService.findAllByUser(userId.get());
            }
        }
        return new ArrayList<>();
    }

    /**
     * {@code GET  /customers/:id} : get the "id" customer.
     *
     * @param id the id of the customer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/customers/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        log.debug("REST request to get Customer : {}", id);
        Optional<Customer> customer = Optional.empty();
        if (AuthoritiesUtil.isCurrentUserAdminOrSupport()) {
            customer = customerService.findOne(id);
        } else {
            Optional<Long> userId = portalUserService.getCurrentPortalUserId();
            if (userId.isPresent()) {
                customer = customerService.findOneByUser(id, userId.get());
            }
        }

        return ResponseUtil.wrapOrNotFound(customer);
    }

    /**
     * {@code DELETE  /customers/:id} : delete the "id" customer.
     *
     * @param id the id of the customer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/customers/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        log.debug("REST request to delete Customer : {}", id);

        customerService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code DELETE  /customers/:id} : delete the "id" customer.
     *
     * @param customerId the id of the customer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/customers/{customerId}/projects/{projectId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Void> deleteProjectFromCustomer(@PathVariable Long customerId, @PathVariable Long projectId) {
        log.debug("REST request to delete project {} from Customer : {}", projectId, customerId);

        Optional<Customer> customer = customerService.findOne(customerId);
        Set<Project> projects = customer.get().getProjects();

        for(Project project : projects) {
            if (project.getId().equals(projectId)) {
                customer.get().removeProject(project);
                projectService.delete(projectId);
                break;
            }
        }

        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, customerId.toString())).build();
    }

    /**
     * {@code POST  /customers/:customerId/projects/:projectId} : Add a project to a customer.
     *
     * @param customerId the customer id.
     * @param projectId the project id.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new project, or with status {@code 400 (Bad Request)} if the
     *         project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/customers/{customerId}/projects/{projectId}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN)
    public ResponseEntity<Customer> addProject(@PathVariable Long customerId, @PathVariable Long projectId) throws URISyntaxException {
        log.debug("REST request to add Project to Customer : {}", customerId);
        Customer result = customerService.addProjectToCustomer(customerId, projectId);

        return ResponseEntity
            .created(new URI("/api/customers/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
}
