package com.entando.customerportal.repository;

import com.entando.customerportal.domain.ProjectSubscription;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ProjectSubscription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectSubscriptionRepository extends JpaRepository<ProjectSubscription, Long> {
}
