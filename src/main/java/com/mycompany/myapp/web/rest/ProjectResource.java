package com.mycompany.myapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myapp.constant.CustportAppConstant;
import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.ProjectSubscription;
import com.mycompany.myapp.response.model.SubscriptionDetailResponse;
import com.mycompany.myapp.response.model.SubscriptionListResponse;
import com.mycompany.myapp.service.CustomerService;
import com.mycompany.myapp.service.ProjectService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Project}.
 */
@RestController
@RequestMapping("/api")
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    private static final String ENTITY_NAME = "custportAppProject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectService projectService;

    @Autowired
    private CustomerService customerService;
    
    public ProjectResource(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * {@code POST  /projects} : Create a new project.
     *
     * @param project the project to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new project, or with status {@code 400 (Bad Request)} if the
     *         project has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/projects")
    public ResponseEntity<Project> createProject(@Valid @RequestBody Project project) throws URISyntaxException {
        log.debug("REST request to save Project : {}", project);
        if (project.getId() != null) {
            throw new BadRequestAlertException("A new project cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Project result = projectService.save(project);
        return ResponseEntity
                .created(new URI("/api/projects/" + result.getId())).headers(HeaderUtil
                        .createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /projects} : Updates an existing project.
     *
     * @param project the project to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated project, or with status {@code 400 (Bad Request)} if the
     *         project is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the project couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/projects")
    public ResponseEntity<Project> updateProject(@Valid @RequestBody Project project) throws URISyntaxException {
        log.debug("REST request to update Project : {}", project);
        if (project.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Project result = projectService.save(project);
        return ResponseEntity.ok().headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, project.getId().toString()))
                .body(result);
    }
    
	@GetMapping("/projects") 
	public List<Project> getAllProjects() {
		log.debug("REST request to get all Projects"); 
		return projectService.findAll(); 
	}
    
	@GetMapping("/projects/subscriptions/customer/{customerNumber}")
    public ResponseEntity<List<SubscriptionListResponse>> getSubscriptionsForCustomer(@PathVariable String customerNumber) {
		List<SubscriptionListResponse> subscriptionList = new ArrayList<>();
		
		try {
	    	Optional<Customer> customer = customerService.findByCustomerNumber(customerNumber);
    	
	        if (customer.isPresent()) {
	        	SimpleDateFormat sdf = new SimpleDateFormat(CustportAppConstant.DATE_FORMAT); 
	        	Set<Project> projects = customer.get().getProjects();

	        	for (Project project: projects) {
	        		SubscriptionListResponse subscription = new SubscriptionListResponse();
	        		
	        		subscription.setProjectName(project.getName());
	        		if (!project.getPartners().isEmpty()) {
	        			List<String> partners = new ArrayList<>();
	        			project.getPartners().stream().forEachOrdered(partner -> partners.add(partner.getName()));
	        			subscription.setPartners(partners);
	        		}
	        		// need to review
	        		if (project.getProjectSubscriptions().stream().findFirst().isPresent()) {
	        			ProjectSubscription projectSubscription = project.getProjectSubscriptions().stream().findFirst().get();
	        			subscription.setStartDate(sdf.format(Date.from(projectSubscription.getStartDate().toInstant())));
        				subscription.setEndDate(sdf.format(Date.from(projectSubscription.getStartDate().plusMonths(projectSubscription.getLengthInMonths()).toInstant())));
	        			
	        			if(projectSubscription.getEntandoVersion() != null) {
	        				subscription.setEntandoVersion(projectSubscription.getEntandoVersion().getName());
	        			}
	        		}
	        		subscription.setTickets(project.getTickets().size());
	        		
	        		subscriptionList.add(subscription);
	        	}
	        }
    	} catch(Exception e) {
    		log.error("Error occurred while fetching subscriptions for customer number : " + customerNumber, e);
    	}
    	
        return new ResponseEntity<List<SubscriptionListResponse>>(subscriptionList, HttpStatus.OK);
    }
    
    @GetMapping("/projects/subscriptions/admin")
    //@Secured(AuthoritiesConstants.ADMIN) // required?
    public ResponseEntity<Map<String, String>> getSubscriptionsForAdmin() {
        Map<String, String> customers = new HashMap<String, String>();
        
        try {
	        List<Customer> customerList = customerService.findAll();
	
	        for (Customer customer : customerList) {
	        	customers.put(customer.getName(), customer.getCustomerNumber());
	        }
        } catch(Exception e) {
    		log.error("Error occurred while fetching subscriptions for all customer", e);
    	}

        return new ResponseEntity<Map<String, String>>(customers, HttpStatus.OK);
    }

    @GetMapping("/projects/subscriptions/detail")
    public ResponseEntity<SubscriptionDetailResponse> getSubscriptionDetail(		
            @RequestParam(value = "projectId") Long projectId) {
    	
    	SubscriptionDetailResponse subscriptionDetail = new SubscriptionDetailResponse();
    	SimpleDateFormat sdf = new SimpleDateFormat("MMM yyyy"); 
    	
    	Optional<Project> returnedProject = projectService.findOne(projectId);
    	
    	if (returnedProject.isPresent()) {
    		Project project = returnedProject.get();
    		
    		subscriptionDetail.setProjectName(project.getName());
    		subscriptionDetail.setDescription(project.getDescription());
    		ProjectSubscription projectSubscription = project.getProjectSubscriptions().stream().findFirst().get(); // assume there is only one subscription per project
    		subscriptionDetail.setLevel(projectSubscription.getLevel().name());
    		subscriptionDetail.setStartDate(sdf.format(projectSubscription.getStartDate()));
    		//response.setEndDate(); // there is no endDate field in the entity yet.
    		subscriptionDetail.setPartner(project.getPartners().stream().findFirst().get().getName()); // assume there is only one partner per project
    	}
    	
    	return new ResponseEntity<SubscriptionDetailResponse>(subscriptionDetail, HttpStatus.OK);
    }
    
    
    /**
     * {@code GET  /projects/:id} : get the "id" project.
     *
     * @param id the id of the project to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the project, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/projects/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        Optional<Project> project = projectService.findOne(id);
        return ResponseUtil.wrapOrNotFound(project);
    }

    /**
     * {@code DELETE  /projects/:id} : delete the "id" project.
     *
     * @param id the id of the project to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        log.debug("REST request to delete Project : {}", id);

        projectService.delete(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
                .build();
    }
}
