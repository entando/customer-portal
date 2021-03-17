package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.PortalUser;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link PortalUser}.
 */
public interface PortalUserService {

    /**
     * Save a portalUser.
     *
     * @param portalUser the entity to save.
     * @return the persisted entity.
     */
    PortalUser save(PortalUser portalUser);

    /**
     * Get all the portalUsers.
     *
     * @return the list of entities.
     */
    List<PortalUser> findAll();


    /**
     * Get the "id" portalUser.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PortalUser> findOne(Long id);

    /**
     * Delete the "id" portalUser.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Finds a portal user by their username.
     * 
     * @param username the username of the customer
     * @return the entity
     */
    Optional<PortalUser> findByUsername(String username);
}
