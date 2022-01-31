package com.entando.customerportal.request;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.entando.customerportal.constant.TicketingSystemConfigEnum;

public class TicketingSystemConfigUpdateRequest {
	
	@NotNull(message = "flag field is required")
	private TicketingSystemConfigEnum flag;
	private List<ConfigFields> values;
	
	public TicketingSystemConfigEnum getFlag() {
		return flag;
	}

	public void setFlag(TicketingSystemConfigEnum flag) {
		this.flag = flag;
	}

	public List<ConfigFields> getValues() {
		return values;
	}

	public void setValues(List<ConfigFields> values) {
		this.values = values;
	}
}
