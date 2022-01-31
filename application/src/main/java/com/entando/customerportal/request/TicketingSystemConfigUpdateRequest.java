package com.entando.customerportal.request;

import java.util.Objects;
import java.util.Set;

import com.entando.customerportal.constant.TicketingSystemConfigEnum;

public class TicketingSystemConfigUpdateRequest {
	
	private TicketingSystemConfigEnum flag;
	private Set<ConfigFields> values;
	
	public TicketingSystemConfigEnum getFlag() {
		return flag;
	}

	public void setFlag(TicketingSystemConfigEnum flag) {
		this.flag = flag;
	}

	public Set<ConfigFields> getValues() {
		return values;
	}

	public void setValues(Set<ConfigFields> values) {
		this.values = values;
	}

	@Override
	public int hashCode() {
		return Objects.hash(flag, values);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TicketingSystemConfigUpdateRequest other = (TicketingSystemConfigUpdateRequest) obj;
		return flag == other.flag && Objects.equals(values, other.values);
	}

	@Override
	public String toString() {
		return "TicketingSystemConfigUpdateRequest [flag=" + flag + ", values=" + values + "]";
	}
}
