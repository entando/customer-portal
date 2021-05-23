package com.entando.customerportal.service;

import com.entando.customerportal.domain.EntandoVersion;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link EntandoVersion}.
 */
public interface EntandoVersionService {

    /**
     * Save a entandoVersion.
     *
     * @param entandoVersion the entity to save.
     * @return the persisted entity.
     */
    EntandoVersion save(EntandoVersion entandoVersion);

    /**
     * Get all the entandoVersions.
     *
     * @return the list of entities.
     */
    List<EntandoVersion> findAll();

    /**
     * Get the "id" entandoVersion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EntandoVersion> findOne(Long id);

    /**
     * Delete the "id" entandoVersion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get the entando version by it's name
     * @param name the entando version
     * @return the entity
     */
    Optional<EntandoVersion> findByName(String name);
}
