package com.entando.customerportal.service.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.entando.customerportal.domain.Partner;
import com.entando.customerportal.repository.PartnerRepository;
import com.entando.customerportal.service.PartnerService;

/**
 * Service Implementation for managing {@link Partner}.
 */
@Service
@Transactional
public class PartnerServiceImpl implements PartnerService {

    private final Logger log = LoggerFactory.getLogger(PartnerServiceImpl.class);

    private final PartnerRepository partnerRepository;

    public PartnerServiceImpl(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    /**
     * Save a partner.
     *
     * @param partner the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Partner save(Partner partner) {
        log.debug("Request to save Partner : {}", partner);
        return partnerRepository.save(partner);
    }

    /**
     * Get all the partners.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Partner> findAll() {
        log.debug("Request to get all Partners");
        return partnerRepository.findAll();
    }


    /**
     * Get one partner by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Partner> findOne(Long id) {
        log.debug("Request to get Partner : {}", id);
        return partnerRepository.findById(id);
    }

    /**
     * Delete the partner by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Partner : {}", id);

        partnerRepository.deleteById(id);
    }
}
