package com.entando.customerportal.request;

import java.util.Set;

public class TicketingSystemConfigAddRequest {
	
	private Set<ConfigFields> ticketTypes;
	private Set<ConfigFields> subscriptionLevels;
	private Set<ConfigFields> productNames;
	private JiraCustomFieldRequest jiraCustomFields;
	
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
	public JiraCustomFieldRequest getJiraCustomFields() {
		return jiraCustomFields;
	}
	public void setJiraCustomFields(JiraCustomFieldRequest jiraCustomFields) {
		this.jiraCustomFields = jiraCustomFields;
	}
	
}
