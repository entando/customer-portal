package com.entando.customerportal.request;

public class EntandoVersionRequest {
	public EntandoVersionRequest() { }

    private String name;
    private String startDate;
    private String endDate;

    public String getName() {
		return name;
	}

    public void setName(String name) {
		this.name = name;
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
