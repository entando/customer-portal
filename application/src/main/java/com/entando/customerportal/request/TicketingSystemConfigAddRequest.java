package com.entando.customerportal.request;

import java.util.Objects;
import java.util.Set;

import javax.validation.constraints.NotNull;

public class TicketingSystemConfigAddRequest {
	
	private Set<ConfigFields> ticketTypes;
	private Set<ConfigFields> subscriptionLevels;
	private Set<ConfigFields> productNames;

	@NotNull
	private Set<JiraCustomFieldRequest> jiraCustomFields;

	public Set<ConfigFields> getTicketTypes() {
		return ticketTypes;
	}
	public void setTicketTypes(Set<ConfigFields> ticketTypes) {
		this.ticketTypes = ticketTypes;
	}
	public Set<ConfigFields> getSubscriptionLevels() {
		return subscriptionLevels;
	}
	public void setSubscriptionLevels(Set<ConfigFields> subscriptionLevels) {
		this.subscriptionLevels = subscriptionLevels;
	}
	public Set<ConfigFields> getProductNames() {
		return productNames;
	}
	public void setProductNames(Set<ConfigFields> productNames) {
		this.productNames = productNames;
	}
	public Set<JiraCustomFieldRequest> getJiraCustomFields() {
		return jiraCustomFields;
	}
	public void setJiraCustomFields(Set<JiraCustomFieldRequest> jiraCustomFields) {
		this.jiraCustomFields = jiraCustomFields;
	}

	@Override
	public int hashCode() {
		return Objects.hash(jiraCustomFields, productNames, subscriptionLevels, ticketTypes);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TicketingSystemConfigAddRequest other = (TicketingSystemConfigAddRequest) obj;
		return Objects.equals(jiraCustomFields, other.jiraCustomFields)
				&& Objects.equals(productNames, other.productNames)
				&& Objects.equals(subscriptionLevels, other.subscriptionLevels)
				&& Objects.equals(ticketTypes, other.ticketTypes);
	}
	@Override
	public String toString() {
		return "TicketingSystemConfigAddRequest [ticketTypes=" + ticketTypes + ", subscriptionLevels="
				+ subscriptionLevels + ", productNames=" + productNames + ", jiraCustomFields=" + jiraCustomFields
				+ "]";
	}
	
}
