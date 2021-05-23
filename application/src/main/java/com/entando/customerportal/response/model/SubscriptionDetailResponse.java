package com.entando.customerportal.response.model;

public class SubscriptionDetailResponse {

    public SubscriptionDetailResponse() {}

    private String projectName;
	private String description;
	private String level;
	private String partner;
	private String startDate;
	private String endDate;

    public String getProjectName() {
		return projectName;
	}

    public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

    public String getDescription() {
		return description;
	}

    public void setDescription(String description) {
		this.description = description;
	}

    public String getLevel() {
		return level;
	}

    public void setLevel(String level) {
		this.level = level;
	}

    public String getPartner() {
		return partner;
	}

    public void setPartner(String partner) {
		this.partner = partner;
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
}
