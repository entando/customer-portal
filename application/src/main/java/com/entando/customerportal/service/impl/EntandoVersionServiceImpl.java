package com.entando.customerportal.service.impl;

import com.entando.customerportal.service.EntandoVersionService;
import com.entando.customerportal.domain.EntandoVersion;
import com.entando.customerportal.repository.EntandoVersionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link EntandoVersion}.
 */
@Service
@Transactional
public class EntandoVersionServiceImpl implements EntandoVersionService {

    private final Logger log = LoggerFactory.getLogger(EntandoVersionServiceImpl.class);

    private final EntandoVersionRepository entandoVersionRepository;

    public EntandoVersionServiceImpl(EntandoVersionRepository entandoVersionRepository) {
        this.entandoVersionRepository = entandoVersionRepository;
    }

    /**
     * Save a entandoVersion.
     *
     * @param entandoVersion the entity to save.
     * @return the persisted entity.
     */
    @Override
    public EntandoVersion save(EntandoVersion entandoVersion) {
        log.debug("Request to save EntandoVersion : {}", entandoVersion);
        return entandoVersionRepository.save(entandoVersion);
    }

    /**
     * Get all the entandoVersions.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<EntandoVersion> findAll() {
        log.debug("Request to get all EntandoVersions");
        return entandoVersionRepository.findAll();
    }


    /**
     * Get one entandoVersion by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<EntandoVersion> findOne(Long id) {
        log.debug("Request to get EntandoVersion : {}", id);
        return entandoVersionRepository.findById(id);
    }

    /**
     * Delete the entandoVersion by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete EntandoVersion : {}", id);

        entandoVersionRepository.deleteById(id);
    }

    @Override
    public Optional<EntandoVersion> findByName(String name) {
        log.debug("Request to get Project by name : {}", name);
        List<EntandoVersion> foundEntandoVersion = entandoVersionRepository.findByName(name);

        return foundEntandoVersion.isEmpty() ? Optional.ofNullable(null) : Optional.ofNullable(foundEntandoVersion.get(0));
    }
}
