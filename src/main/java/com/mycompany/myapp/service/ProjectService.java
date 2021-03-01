package com.mycompany.myapp.service;

import java.util.List;
import java.util.Optional;

import com.mycompany.myapp.domain.Project;

/**
 * Service Interface for managing {@link Project}.
 */
public interface ProjectService {

    /**
     * Save a project.
     *
     * @param project the entity to save.
     * @return the persisted entity.
     */
    Project save(Project project);

    /**
     * Get all the projects.
     *
     * @return the list of entities.
     */
    List<Project> findAll();

    /**
     * Get the "id" project.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Project> findOne(Long id);

    /**
     * Find a project by name.
     * 
     * @param name the name of the project.
     * @return the entity.
     */
    Optional<Project> findByName(String name);

    /**
     * Delete the "id" project.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
