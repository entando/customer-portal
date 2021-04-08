package com.mycompany.myapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

import javax.validation.Valid;

import com.mycompany.myapp.domain.PortalUser;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.security.SpringSecurityAuditorAware;
import com.mycompany.myapp.service.PortalUserService;
import com.mycompany.myapp.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.service.CustomerService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Customer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
@PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
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
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
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
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/customers")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Customer> updateCustomer(@Valid @RequestBody Customer customer) throws URISyntaxException {
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

        if(userHasAdminOrSupport()) {
            return customerService.findAll();
        }

        SpringSecurityAuditorAware security = new SpringSecurityAuditorAware();
        Optional<String> currentUser = security.getCurrentUserLogin();

        //TODO: This and similar methods below won't scale and should eventually be refactored to use join on assigned users
        List<Project> projects = projectService.findAll();
        Set<Customer> toAdd = new HashSet<>();
        List<Customer> customers = new ArrayList<>();
        for(Project project : projects) {
            Set<PortalUser> users = projectService.getProjectUsers(project.getId());
            for(PortalUser user : users) {
                if (currentUser.get().equals(user.getUsername())) {
                    toAdd.add(project.getCustomer());
                    break;
                }
            }
        }
        customers.addAll(toAdd);
        return customers;
    }

    /**
     * {@code GET  /customers/all} : get map object of all customers' names and numbers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the map of customers' names and numbers in body.
     */
    @GetMapping("/customers/all")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Map<String, String>> getCustomersForAdminDashboard() {
        Map<String, String> customers = new HashMap<>();

        try {
	        List<Customer> customerList = customerService.findAll();

	        for (Customer customer : customerList) {
	        	customers.put(customer.getName(), customer.getCustomerNumber());
	        }
        } catch(Exception e) {
    		log.error("Error occurred while fetching all customer", e);
    	}

        return new ResponseEntity<>(customers, HttpStatus.OK);
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
        Optional<Customer> optional = customerService.findOne(id);

        //Check that the user has access to this customer
        if(!userHasAdminOrSupport() && optional.isPresent()) {
            List<Customer> customers = getMyCustomers();
            Customer customer = optional.get();
            if(!customers.contains(customer)) {
                optional = Optional.empty();
            }
        }

        return ResponseUtil.wrapOrNotFound(optional);
    }

    /**
     * {@code GET  /customers/:id} : get the "id" customer.
     *
     * @param id the id of the customer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/customers/admin/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Customer> adminGetCustomer(@PathVariable Long id) {
        log.debug("REST request to get Customer : {}", id);
        Optional<Customer> customer = customerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(customer);
    }

    /**
     * {@code DELETE  /customers/:id} : delete the "id" customer.
     *
     * @param id the id of the customer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/customers/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        log.debug("REST request to delete Customer : {}", id);

        customerService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
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
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Customer> addProjectToCustomer(@PathVariable Long customerId, @PathVariable Long projectId) throws URISyntaxException {
        log.debug("REST request to add Project to Customer : {}", customerId);
        Customer result = customerService.addProjectToCustomer(customerId, projectId);

        return ResponseEntity
            .created(new URI("/api/customers/" + result.getId())).headers(HeaderUtil
                .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /customers/:customerId/projects} : get the projects of "customerId" customer.
     *
     * @param customerId the id of the project.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/customers/{customerId}/projects")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<Set<Project>> getCustomerProjects(@PathVariable Long customerId) {
        Set<Project> projects = customerService.getCustomerProjects(customerId);
        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customerId.toString()))
            .body(projects);
    }

    /**
     * {@code GET  /customers/admin} : get all the customers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customers in body.
     */
    @GetMapping("/customers/admin")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public List<Customer> adminGetAllCustomers() {
        log.debug("REST request to get all Customers");
        return customerService.findAll();
    }

    /**
     * {@code GET  /customers/mycustomers} : get the user's customers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of customers in body.
     */
    @GetMapping("/customers/mycustomers")
    @PreAuthorize(AuthoritiesConstants.HAS_CUSTOMER_OR_PARTNER)
    public List<Customer> getMyCustomers() {
        log.debug("REST request to get user's Customers");

        List<Customer> customers = new ArrayList<>();

        String currentUser = springSecurityAuditorAware.getCurrentUserLogin().get();
        Optional<PortalUser> optional = portalUserService.findByUsername(currentUser);
        if (optional.isPresent()) {
            PortalUser currentPortalUser = optional.get();

            List<Project> projects = projectService.findAll();
            Set<Customer> toAdd = new HashSet<>();

            for(Project project : projects) {
                Set<PortalUser> users = projectService.getProjectUsers(project.getId());
                if (users.contains(currentPortalUser)) {
                    toAdd.add(project.getCustomer());
                }
            }
            customers.addAll(toAdd);
        }

        return customers;
    }

    /**
     * {@code GET  /customers/mycustomers/:customerId/projects} : get the projects of "customerId" customer.
     *
     * @param customerId the id of the customer.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the projects, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/customers/mycustomers/{customerId}/projects")
    @PreAuthorize(AuthoritiesConstants.HAS_CUSTOMER_OR_PARTNER)
    public ResponseEntity<Set<Project>> getMyCustomerProjects(@PathVariable Long customerId) {
        Set<Project> projects = customerService.getCustomerProjects(customerId);

        String currentUser = springSecurityAuditorAware.getCurrentUserLogin().get();
        Optional<PortalUser> optional = portalUserService.findByUsername(currentUser);
        Set<Project> result = new HashSet<>();
        if (optional.isPresent()) {
            PortalUser currentPortalUser = optional.get();
            for(Project project : projects) {
                Set<PortalUser> users = projectService.getProjectUsers(project.getId());
                if (users.contains(currentPortalUser)) {
                    result.add(project);
                }
            }
        }

        return ResponseEntity.ok().headers(
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, customerId.toString()))
            .body(result);
    }

    private boolean userHasAdminOrSupport() {
        return userHasRole(AuthoritiesConstants.ADMIN) || userHasRole(AuthoritiesConstants.SUPPORT);
    }

    private boolean userHasRole(String roleName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority role : authentication.getAuthorities()) {
            if(role.toString().equals(roleName)) {
                return true;
            }
        }
        return false;
    }
}
