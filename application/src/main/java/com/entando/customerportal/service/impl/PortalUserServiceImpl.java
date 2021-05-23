package com.entando.customerportal.service.impl;

import com.entando.customerportal.security.SpringSecurityAuditorAware;
import com.entando.customerportal.service.PortalUserService;
import com.entando.customerportal.domain.PortalUser;
import com.entando.customerportal.repository.PortalUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link PortalUser}.
 */
@Service
@Transactional
public class PortalUserServiceImpl implements PortalUserService {

    private final Logger log = LoggerFactory.getLogger(PortalUserServiceImpl.class);

    private final PortalUserRepository portalUserRepository;

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    public PortalUserServiceImpl(PortalUserRepository portalUserRepository) {
        this.portalUserRepository = portalUserRepository;
    }

    /**
     * Save a portalUser.
     *
     * @param portalUser the entity to save.
     * @return the persisted entity.
     */
    @Override
    public PortalUser save(PortalUser portalUser) {
        log.debug("Request to save PortalUser : {}", portalUser);
        return portalUserRepository.save(portalUser);
    }

    /**
     * Get all the portalUsers.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<PortalUser> findAll() {
        log.debug("Request to get all PortalUsers");
        return portalUserRepository.findAll();
    }


    /**
     * Get one portalUser by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<PortalUser> findOne(Long id) {
        log.debug("Request to get PortalUser : {}", id);
        return portalUserRepository.findById(id);
    }

    /**
     * Delete the portalUser by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete PortalUser : {}", id);

        portalUserRepository.deleteById(id);
    }

    @Override
    public Optional<PortalUser> findByUsername(String username) {
        return portalUserRepository.findByUsername(username);
    }

    @Override
    public Optional<Long> getCurrentPortalUserId() {
        Optional<String> username = springSecurityAuditorAware.getCurrentUserLogin();
        Long result = 0L;
        if (username.isPresent()) {
            Optional<PortalUser> user = portalUserRepository.findByUsername(username.get());
            if (user.isPresent()) {
                result = user.get().getId();
            }
        }
        return Optional.of(result);
    }
}
