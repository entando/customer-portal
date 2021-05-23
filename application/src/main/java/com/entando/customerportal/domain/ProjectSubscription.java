package com.entando.customerportal.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

import com.entando.customerportal.domain.enumeration.SubscriptionLevel;

import com.entando.customerportal.domain.enumeration.Status;

/**
 * A ProjectSubscription.
 */
@Entity
@Table(name = "project_subscription")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProjectSubscription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false)
    private SubscriptionLevel level;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "length_in_months")
    private Integer lengthInMonths;

    @Column(name = "start_date")
    private ZonedDateTime startDate;

    @Size(max = 1024)
    @Column(name = "notes", length = 1024)
    private String notes;

    @ManyToOne
    @JsonIgnoreProperties(value = "projectSubscriptions", allowSetters = true)
    private EntandoVersion entandoVersion;

    @ManyToOne
    //CUSTOM START for performance
    @JsonIgnoreProperties(value = {"tickets", "partners", "portalUsers", "projectSubscriptions", "customer"}, allowSetters = true)
    //CUSTOM END
    private Project project;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SubscriptionLevel getLevel() {
        return level;
    }

    public ProjectSubscription level(SubscriptionLevel level) {
        this.level = level;
        return this;
    }

    public void setLevel(SubscriptionLevel level) {
        this.level = level;
    }

    public Status getStatus() {
        return status;
    }

    public ProjectSubscription status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getLengthInMonths() {
        return lengthInMonths;
    }

    public ProjectSubscription lengthInMonths(Integer lengthInMonths) {
        this.lengthInMonths = lengthInMonths;
        return this;
    }

    public void setLengthInMonths(Integer lengthInMonths) {
        this.lengthInMonths = lengthInMonths;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public ProjectSubscription startDate(ZonedDateTime startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public String getNotes() {
        return notes;
    }

    public ProjectSubscription notes(String notes) {
        this.notes = notes;
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public EntandoVersion getEntandoVersion() {
        return entandoVersion;
    }

    public ProjectSubscription entandoVersion(EntandoVersion entandoVersion) {
        this.entandoVersion = entandoVersion;
        return this;
    }

    public void setEntandoVersion(EntandoVersion entandoVersion) {
        this.entandoVersion = entandoVersion;
    }

    public Project getProject() {
        return project;
    }

    public ProjectSubscription project(Project project) {
        this.project = project;
        return this;
    }

    public void setProject(Project project) {
        this.project = project;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProjectSubscription)) {
            return false;
        }
        return id != null && id.equals(((ProjectSubscription) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProjectSubscription{" +
            "id=" + getId() +
            ", level='" + getLevel() + "'" +
            ", status='" + getStatus() + "'" +
            ", lengthInMonths=" + getLengthInMonths() +
            ", startDate='" + getStartDate() + "'" +
            ", notes='" + getNotes() + "'" +
            "}";
    }
}
