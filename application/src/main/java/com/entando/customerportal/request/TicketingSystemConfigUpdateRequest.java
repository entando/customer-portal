package com.entando.customerportal.request;

import java.util.Objects;
import java.util.Set;

public class TicketingSystemConfigUpdateRequest {

	private TicketingSystemConfigEnum flag;
	private Set<ConfigFields> values;
	private JiraCustomFieldRequest jiraCustomFields;

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

	public JiraCustomFieldRequest getJiraCustomFields() {
		return jiraCustomFields;
	}

	public void setJiraCustomFields(JiraCustomFieldRequest jiraCustomFields) {
		this.jiraCustomFields = jiraCustomFields;
	}

	@Override
	public int hashCode() {
		return Objects.hash(flag, jiraCustomFields, values);
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
		return flag == other.flag && Objects.equals(jiraCustomFields, other.jiraCustomFields)
				&& Objects.equals(values, other.values);
	}

	@Override
	public String toString() {
		return "TicketingSystemConfigUpdateRequest [flag=" + flag + ", values=" + values + ", jiraCustomFields="
				+ jiraCustomFields + "]";
	}

	public enum TicketingSystemConfigEnum {
		TICKET_TYPE, SUBSCRIPTION_LEVEL, PRODUCT_NAME, JIRA_CUSTOM_FIELD;
	}
}
