package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * A Project.
 */
@Entity
@Table(name = "project")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "system_id")
    private String systemId;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @Size(max = 1024)
    @Column(name = "notes", length = 1024)
    private String notes;

    @OneToMany(mappedBy = "project", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private List<ProjectSubscription> projectSubscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "project", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Ticket> tickets = new HashSet<>();

    @OneToMany(mappedBy = "project", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Partner> partners = new HashSet<>();

    @OneToMany(mappedBy = "project", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<PortalUser> portalUsers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "projects", allowSetters = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Project name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Project description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSystemId() {
        return systemId;
    }

    public Project systemId(String systemId) {
        this.systemId = systemId;
        return this;
    }

    public void setSystemId(String systemId) {
        this.systemId = systemId;
    }

    public String getContactName() {
        return contactName;
    }

    public Project contactName(String contactName) {
        this.contactName = contactName;
        return this;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public Project contactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
        return this;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public Project contactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
        return this;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getNotes() {
        return notes;
    }

    public Project notes(String notes) {
        this.notes = notes;
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<ProjectSubscription> getProjectSubscriptions() {
        return projectSubscriptions;
    }

    public Project projectSubscriptions(List<ProjectSubscription> projectSubscriptions) {
        this.projectSubscriptions = projectSubscriptions;
        return this;
    }

    public Project addProjectSubscription(ProjectSubscription projectSubscription) {
        this.projectSubscriptions.add(projectSubscription);
        projectSubscription.setProject(this);
        return this;
    }

    public Project removeProjectSubscription(ProjectSubscription projectSubscription) {
        this.projectSubscriptions.remove(projectSubscription);
        projectSubscription.setProject(null);
        return this;
    }

    public void setProjectSubscriptions(List<ProjectSubscription> projectSubscriptions) {
        this.projectSubscriptions = projectSubscriptions;
    }

    public Set<Ticket> getTickets() {
        return tickets;
    }

    public Project tickets(Set<Ticket> tickets) {
        this.tickets = tickets;
        return this;
    }

    public Project addTicket(Ticket ticket) {
        this.tickets.add(ticket);
        ticket.setProject(this);
        return this;
    }

    public Project removeTicket(Ticket ticket) {
        this.tickets.remove(ticket);
        ticket.setProject(null);
        return this;
    }

    public void setTickets(Set<Ticket> tickets) {
        this.tickets = tickets;
    }

    public Set<Partner> getPartners() {
        return partners;
    }

    public Project partners(Set<Partner> partners) {
        this.partners = partners;
        return this;
    }

    public Project addPartner(Partner partner) {
        this.partners.add(partner);
        partner.setProject(this);
        return this;
    }

    public Project removePartner(Partner partner) {
        this.partners.remove(partner);
        partner.setProject(null);
        return this;
    }

    public void setPartners(Set<Partner> partners) {
        this.partners = partners;
    }

    public Set<PortalUser> getPortalUsers() {
        return portalUsers;
    }

    public Project portalUsers(Set<PortalUser> portalUsers) {
        this.portalUsers = portalUsers;
        return this;
    }

    public Project addPortalUser(PortalUser portalUser) {
        this.portalUsers.add(portalUser);
        portalUser.setProject(this);
        return this;
    }

    public Project removePortalUser(PortalUser portalUser) {
        this.portalUsers.remove(portalUser);
        portalUser.setProject(null);
        return this;
    }

    public void setPortalUsers(Set<PortalUser> portalUsers) {
        this.portalUsers = portalUsers;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Project customer(Customer customer) {
        this.customer = customer;
        return this;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Project)) {
            return false;
        }
        return id != null && id.equals(((Project) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", systemId='" + getSystemId() + "'" +
            ", contactName='" + getContactName() + "'" +
            ", contactPhone='" + getContactPhone() + "'" +
            ", contactEmail='" + getContactEmail() + "'" +
            ", notes='" + getNotes() + "'" +
            "}";
    }
}
