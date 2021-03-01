package com.mycompany.myapp.service.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.ProjectSubscription;
import com.mycompany.myapp.repository.ProjectSubscriptionRepository;
import com.mycompany.myapp.service.ProjectSubscriptionService;

/**
 * Service Implementation for managing {@link ProjectSubscription}.
 */
@Service
@Transactional
public class ProjectSubscriptionServiceImpl implements ProjectSubscriptionService {

    private final Logger log = LoggerFactory.getLogger(ProjectSubscriptionServiceImpl.class);

    private final ProjectSubscriptionRepository projectSubscriptionRepository;

    public ProjectSubscriptionServiceImpl(ProjectSubscriptionRepository projectSubscriptionRepository) {
        this.projectSubscriptionRepository = projectSubscriptionRepository;
    }

    /**
     * Save a projectSubscription.
     *
     * @param projectSubscription the entity to save.
     * @return the persisted entity.
     */
    @Override
    public ProjectSubscription save(ProjectSubscription projectSubscription) {
        log.debug("Request to save ProjectSubscription : {}", projectSubscription);
        return projectSubscriptionRepository.save(projectSubscription);
    }

    /**
     * Get all the projectSubscriptions.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProjectSubscription> findAll() {
        log.debug("Request to get all ProjectSubscriptions");
        return projectSubscriptionRepository.findAll();
    }


    /**
     * Get one projectSubscription by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<ProjectSubscription> findOne(Long id) {
        log.debug("Request to get ProjectSubscription : {}", id);
        return projectSubscriptionRepository.findById(id);
    }

    /**
     * Delete the projectSubscription by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ProjectSubscription : {}", id);

        projectSubscriptionRepository.deleteById(id);
    }
}
