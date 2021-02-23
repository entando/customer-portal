package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PortalUser;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PortalUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PortalUserRepository extends JpaRepository<PortalUser, Long> {
}
