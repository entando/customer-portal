package com.entando.customerportal.response.model;

import java.util.List;

public class SubscriptionListResponse {

	public SubscriptionListResponse() {}

    private Long subscriptionId;
	private String projectName;
	private List<String> partners;
	private String entandoVersion;
	private String startDate;
	private String endDate;
	private int tickets;

    public Long getSubscriptionId() {
		return subscriptionId;
	}

	public void setSubscriptionId(Long subscriptionId) {
		this.subscriptionId = subscriptionId;
	}

	public String getProjectName() {
		return projectName;
	}

    public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

    public List<String> getPartners() {
		return partners;
	}

	public void setPartners(List<String> partners) {
		this.partners = partners;
	}

	public String getEntandoVersion() {
		return entandoVersion;
	}

    public void setEntandoVersion(String entandoVersion) {
		this.entandoVersion = entandoVersion;
	}

    public String getStartDate() {
		return startDate;
	}

    public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

    public String getEndDate() {
		return endDate;
	}

    public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

    public int getTickets() {
		return tickets;
	}

	public void setTickets(int tickets) {
		this.tickets = tickets;
	}
}
