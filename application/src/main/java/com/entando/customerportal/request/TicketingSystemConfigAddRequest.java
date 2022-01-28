package com.entando.customerportal.request;

import java.util.Map;

public class TicketingSystemConfigAddRequest {
	
	private Map<String, String> ticketTypes;
	private Map<String, String> subscriptionLevels;
	private Map<String, String> productNames;
	private Map<String, String> jiraCustomFields;
	
	public Map<String, String> getTicketTypes() {
		return ticketTypes;
	}
	public void setTicketTypes(Map<String, String> ticketTypes) {
		this.ticketTypes = ticketTypes;
	}
	public Map<String, String> getSubscriptionLevels() {
		return subscriptionLevels;
	}
	public void setSubscriptionLevels(Map<String, String> subscriptionLevels) {
		this.subscriptionLevels = subscriptionLevels;
	}
	public Map<String, String> getProductNames() {
		return productNames;
	}
	public void setProductNames(Map<String, String> productNames) {
		this.productNames = productNames;
	}
	public Map<String, String> getJiraCustomFields() {
		return jiraCustomFields;
	}
	public void setJiraCustomFields(Map<String, String> jiraCustomFields) {
		this.jiraCustomFields = jiraCustomFields;
	}
	
}
