package com.mycompany.myapp.service.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.repository.ProjectRepository;
import com.mycompany.myapp.service.ProjectService;

/**
 * Service Implementation for managing {@link Project}.
 */
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectServiceImpl.class);

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
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
}
