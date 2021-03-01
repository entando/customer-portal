package com.mycompany.myapp.response.model;

public class SubscriptionRowResponse {

	public SubscriptionRowResponse() {}
	
	private String projectName;
	private String partnerName;
	private String entandoVersion;
	private String startDate;
	private String endDate;
	private int tickets;
	
	public String getProjectName() {
		return projectName;
	}
	
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	
	public String getPartnerName() {
		return partnerName;
	}
	
	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
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
