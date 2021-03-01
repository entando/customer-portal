package com.mycompany.myapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mycompany.myapp.domain.ProjectSubscription;

/**
 * Spring Data  repository for the ProjectSubscription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectSubscriptionRepository extends JpaRepository<ProjectSubscription, Long> {
}
