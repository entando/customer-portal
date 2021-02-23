package com.mycompany.myapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A TicketingSystem.
 */
@Entity
@Table(name = "ticketing_system")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TicketingSystem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "url", nullable = false)
    private String url;

    @NotNull
    @Column(name = "service_account", nullable = false)
    private String serviceAccount;

    @NotNull
    @Column(name = "service_account_secret", nullable = false)
    private String serviceAccountSecret;

    @Column(name = "system_id")
    private String systemId;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public TicketingSystem url(String url) {
        this.url = url;
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getServiceAccount() {
        return serviceAccount;
    }

    public TicketingSystem serviceAccount(String serviceAccount) {
        this.serviceAccount = serviceAccount;
        return this;
    }

    public void setServiceAccount(String serviceAccount) {
        this.serviceAccount = serviceAccount;
    }

    public String getServiceAccountSecret() {
        return serviceAccountSecret;
    }

    public TicketingSystem serviceAccountSecret(String serviceAccountSecret) {
        this.serviceAccountSecret = serviceAccountSecret;
        return this;
    }

    public void setServiceAccountSecret(String serviceAccountSecret) {
        this.serviceAccountSecret = serviceAccountSecret;
    }

    public String getSystemId() {
        return systemId;
    }

    public TicketingSystem systemId(String systemId) {
        this.systemId = systemId;
        return this;
    }

    public void setSystemId(String systemId) {
        this.systemId = systemId;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TicketingSystem)) {
            return false;
        }
        return id != null && id.equals(((TicketingSystem) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TicketingSystem{" +
            "id=" + getId() +
            ", url='" + getUrl() + "'" +
            ", serviceAccount='" + getServiceAccount() + "'" +
            ", serviceAccountSecret='" + getServiceAccountSecret() + "'" +
            ", systemId='" + getSystemId() + "'" +
            "}";
    }
}
