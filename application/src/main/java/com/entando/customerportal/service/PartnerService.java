package com.entando.customerportal.service;

import java.util.List;
import java.util.Optional;

import com.entando.customerportal.domain.Partner;

/**
 * Service Interface for managing {@link Partner}.
 */
public interface PartnerService {

    /**
     * Save a partner.
     *
     * @param partner the entity to save.
     * @return the persisted entity.
     */
    Partner save(Partner partner);

    /**
     * Get all the partners.
     *
     * @return the list of entities.
     */
    List<Partner> findAll();

    /**
     * Get the "id" partner.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Partner> findOne(Long id);

    /**
     * Delete the "id" partner.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
