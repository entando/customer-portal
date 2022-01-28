package com.entando.customerportal.request;

import javax.validation.constraints.NotNull;
import com.entando.customerportal.constant.TicketingSystemConfigEnum;

public class TicketingSystemConfigRequest {
	
	@NotNull(message = "flag field is required")
	TicketingSystemConfigEnum flag;
	
	String value;

	public TicketingSystemConfigEnum getFlag() {
		return flag;
	}

	public void setFlag(TicketingSystemConfigEnum flag) {
		this.flag = flag;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
	
	
}
