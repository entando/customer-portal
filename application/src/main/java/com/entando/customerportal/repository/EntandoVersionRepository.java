package com.entando.customerportal.repository;

import java.util.List;

import com.entando.customerportal.domain.EntandoVersion;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the EntandoVersion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EntandoVersionRepository extends JpaRepository<EntandoVersion, Long> {
    List<EntandoVersion> findByName(String name);

    @Override
    @Query
    public List<EntandoVersion> findAll();
}
