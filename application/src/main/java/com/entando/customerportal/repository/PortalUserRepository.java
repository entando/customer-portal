package com.entando.customerportal.repository;

import java.util.Optional;

import com.entando.customerportal.domain.PortalUser;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PortalUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PortalUserRepository extends JpaRepository<PortalUser, Long> {
    Optional<PortalUser> findByUsername(String username);
}
