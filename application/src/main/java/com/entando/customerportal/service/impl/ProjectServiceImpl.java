package com.entando.customerportal.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.entando.customerportal.domain.*;
import com.entando.customerportal.domain.enumeration.Status;
import com.entando.customerportal.repository.*;
import com.entando.customerportal.security.AuthoritiesUtil;
import com.entando.customerportal.security.SpringSecurityAuditorAware;
import com.entando.customerportal.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entando.customerportal.service.ProjectService;

/**
 * Service Implementation for managing {@link Project}.
 */
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectServiceImpl.class);

    private final ProjectRepository projectRepository;
    private final TicketRepository ticketRepository;
    private final ProjectSubscriptionRepository projectSubscriptionRepository;
    private final PartnerRepository partnerRepository;
    private final PortalUserRepository portalUserRepository;

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    public ProjectServiceImpl(ProjectRepository projectRepository, TicketRepository ticketRepository,
                              ProjectSubscriptionRepository projectSubscriptionRepository,
                              PartnerRepository partnerRepository, PortalUserRepository portalUserRepository) {
        this.projectRepository = projectRepository;
        this.ticketRepository = ticketRepository;
        this.projectSubscriptionRepository = projectSubscriptionRepository;
        this.partnerRepository = partnerRepository;
        this.portalUserRepository = portalUserRepository;
    }

    /**
     * Save a project.
     *
     * @param project the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Project save(Project project) {
        log.debug("Request to save Project : {}", project);
        return projectRepository.save(project);
    }

    /**
     * Get all the projects.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Project> findAll() {
        log.debug("Request to get all Projects");
        return projectRepository.findAll();
    }

    @Override
    public Page<Project> findAllWithEagerRelationships(Pageable pageable) {
        log.debug("Request to get all Projects pageable");
        return projectRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one project by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Project> findOne(Long id) {
        log.debug("Request to get Project : {}", id);
        return projectRepository.findById(id);
    }

    /**
     * Delete the project by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        projectRepository.deleteById(id);
    }

    @Override
    public Optional<Project> findByName(String name) {
        log.debug("Request to get Project by name : {}", name);
        List<Project> foundProjects = projectRepository.findByName(name);

        return foundProjects.isEmpty() ? Optional.empty() : Optional.ofNullable(foundProjects.get(0));

    }

    /**
     * Add a ticket to a project.
     *
     * @param projectId the project id.
     * @param ticketId the ticket id.
     * @return the persisted entity.
     */
    @Override
    public Project addTicketToProject(Long projectId, Long ticketId) {
        Optional<Project> project = projectRepository.findById(projectId);
        Optional<Ticket> ticket = ticketRepository.findById(ticketId);
        project.get().addTicket(ticket.get());
        return projectRepository.save(project.get());
    }

    /**
     * Get project tickets by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    public Set<Ticket> getProjectTickets(Long id) {
        return projectRepository.findById(id).get().getTickets();
    }

    /**
     * Add a subscription to a project.
     *
     * @param projectId the project id.
     * @param subscriptionId the ticket id.
     * @return the persisted entity.
     */
    @Override
    public Project addSubscriptionToProject(Long projectId, Long subscriptionId) {
        Optional<Project> project = projectRepository.findById(projectId);
        Optional<ProjectSubscription> subscription = projectSubscriptionRepository.findById(subscriptionId);
        project.get().addProjectSubscription(subscription.get());
        return projectRepository.save(project.get());
    }

    /**
     * Get project subscriptions by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    public Set<ProjectSubscription> getProjectSubscriptions(Long id) {
        return projectRepository.findById(id).get().getProjectSubscriptions();
    }


    /**
     * Add a partner to a project.
     *
     * @param projectId the project id.
     * @param partnerId the partner id.
     * @return the persisted entity.
     */
    @Override
    public Project addPartnerToProject(Long projectId, Long partnerId) {
        Optional<Project> project = projectRepository.findById(projectId);
        Optional<Partner> partner = partnerRepository.findById(partnerId);
        project.get().addPartner(partner.get());
        return projectRepository.save(project.get());
    }

    /**
     * Get project partners by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    public Set<Partner> getProjectPartners(Long id) {
        return projectRepository.findById(id).get().getPartners();
    }

    /**
     * Add a user to a project.
     *
     * @param projectId the project id.
     * @param userId the user id.
     * @return the persisted entity.
     */
    @Override
    public Project addUserToProject(Long projectId, Long userId) {
        Optional<Project> project = projectRepository.findById(projectId);
        Optional<PortalUser> user = portalUserRepository.findById(userId);
        project.get().addUser(user.get());
        return projectRepository.save(project.get());
    }

    /**
     * Delete partner from a project.
     *
     * @param projectId the project id.
     * @param partnerId the user id.
     * @return the persisted entity.
     */
    @Override
    public Project deletePartnerFromProject(Long projectId, Long partnerId) {
        Optional<Project> project = projectRepository.findById(projectId);
        Optional<Partner> partner = partnerRepository.findById(partnerId);
        project.get().removePartner(partner.get());
        return projectRepository.save(project.get());
    }

    /**
     * Delete subscription from a project.
     *
     * @param projectId      the project id.
     * @param subscriptionId the subscription id.
     * @return the persisted entity.
     */
    @Override
    public Project deleteSubscriptionFromProject(Long projectId, Long subscriptionId) {
        Optional<Project> project = projectRepository.findById(projectId);
        Optional<ProjectSubscription> subscription = projectSubscriptionRepository.findById(subscriptionId);
        if (project.isPresent() && subscription.isPresent()) {
            Project theProject = project.get();
            theProject.removeProjectSubscription(subscription.get());
            return projectRepository.save(theProject);
        }
        return null;
    }

    /**
     * Delete user from a project.
     *
     * @param projectId the project id.
     * @param userId    the user id.
     * @return the persisted entity.
     */
    @Override
    public Project deleteUserFromProject(Long projectId, Long userId) {
        Optional<Project> project = projectRepository.findById(projectId);
        Optional<PortalUser> user = portalUserRepository.findById(userId);
        project.get().removeUser(user.get());
        return projectRepository.save(project.get());
    }

    /**
     * Get project users by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    public Set<PortalUser> getProjectUsers(Long id) {
        Optional<Project> project = findOne(id);
        return project.isPresent() ? project.get().getUsers() : new HashSet<>();
    }

    /**
     * Check if the current user has access to a project via admin role or direct assignment
     */
    @Override
    public boolean hasProjectAccess(Long projectId) {
        if (AuthoritiesUtil.isCurrentUserAdminOrSupport()) {
            return true;
        }

        Optional<String> username = springSecurityAuditorAware.getCurrentUserLogin();
        if (!username.isPresent()) {
            return false;
        }

        //Note: this could be optimized with a join query but not urgent given the small number of expected users on a single project
        Optional<PortalUser> user = portalUserRepository.findByUsername(username.get());
        if (user.isPresent()) {
            Set<PortalUser> projectUsers = getProjectUsers(projectId);
            return projectUsers.contains(user.get());
        }
        return false;
    }

    /**
     * Check if the current user has access to the project
     *
     * @param projectId the project id
     * @throws BadRequestAlertException if the user doesn't have access
     */
    @Override
    public void checkProjectAccess(Long projectId) throws RuntimeException {
        if (!hasProjectAccess(projectId)) {
            throw new RuntimeException("Project forbidden ");
        }
    }

    /**
     * Get the current active subscription for a project
     */
    public Optional<ProjectSubscription> getActiveSubscription(Project project) {
        Set<ProjectSubscription> subscriptions = project.getProjectSubscriptions();
        Optional<ProjectSubscription> result = Optional.empty();
        if (!subscriptions.isEmpty()) {
            result = subscriptions.stream()
                .filter(sub -> sub.getStatus() == Status.ACTIVE)
                .reduce((a, b) -> {
                    throw new IllegalStateException();
                });
        }
        return result;
    }
}
