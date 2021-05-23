package com.entando.customerportal.response.model;

public class EntandoVersionResponse {

    public EntandoVersionResponse() {}

    private Long id;
	private String name;
	private Boolean status = false;
	private String startDate;
	private String endDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
		return name;
	}

    public void setName(String name) {
		this.name = name;
	}

    public Boolean getStatus() {
		return status;
	}

    public void setStatus(Boolean status) {
		this.status = status;
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
