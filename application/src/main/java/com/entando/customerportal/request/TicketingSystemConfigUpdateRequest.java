package com.entando.customerportal.request;

import java.util.Map;

import javax.validation.constraints.NotNull;

import com.entando.customerportal.constant.TicketingSystemConfigEnum;

public class TicketingSystemConfigUpdateRequest {
	
	@NotNull(message = "flag field is required")
	private TicketingSystemConfigEnum flag;
	
	private Map<String, String> values;

	public TicketingSystemConfigEnum getFlag() {
		return flag;
	}

	public void setFlag(TicketingSystemConfigEnum flag) {
		this.flag = flag;
	}

	public Map<String, String> getValues() {
		return values;
	}

	public void setValues(Map<String, String> values) {
		this.values = values;
	}
}
