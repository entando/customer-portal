package com.entando.customerportal.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "ticketing_system_configuration")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TicketingSystemConfig implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;
    
    @Column(name = "ticket_type", nullable = true)
    private String ticketType;
    
    @Column(name = "subscription_level", nullable = true)
    private String subscriptionLevel;
    
    @Column(name = "product_name", nullable = true)
    private String productName;
    
    @Column(name = "jira_customfield", nullable = true)
    private String jiraCustomField;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTicketType() {
		return ticketType;
	}

	public void setTicketType(String ticketType) {
		this.ticketType = ticketType;
	}

	public String getSubscriptionLevel() {
		return subscriptionLevel;
	}

	public void setSubscriptionLevel(String subscriptionLevel) {
		this.subscriptionLevel = subscriptionLevel;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getJiraCustomField() {
		return jiraCustomField;
	}

	public void setJiraCustomField(String jiraCustomField) {
		this.jiraCustomField = jiraCustomField;
	}

}
