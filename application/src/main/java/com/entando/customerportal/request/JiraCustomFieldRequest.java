package com.entando.customerportal.request;

import java.util.Objects;

public class JiraCustomFieldRequest {

	private Long cversionsId;
	private Long organizationsId;
	private Long subscriptionLevelId;

	public Long getCversionsId() {
		return cversionsId;
	}
	public void setCversionsId(Long cversionsId) {
		this.cversionsId = cversionsId;
	}
	public Long getOrganizationsId() {
		return organizationsId;
	}
	public void setOrganizationsId(Long organizationsId) {
		this.organizationsId = organizationsId;
	}
	public Long getSubscriptionLevelId() {
		return subscriptionLevelId;
	}
	public void setSubscriptionLevelId(Long subscriptionLevelId) {
		this.subscriptionLevelId = subscriptionLevelId;
	}
	@Override
	public int hashCode() {
		return Objects.hash(cversionsId, organizationsId, subscriptionLevelId);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		JiraCustomFieldRequest other = (JiraCustomFieldRequest) obj;
		return Objects.equals(cversionsId, other.cversionsId) && Objects.equals(organizationsId, other.organizationsId)
				&& Objects.equals(subscriptionLevelId, other.subscriptionLevelId);
	}
	@Override
	public String toString() {
		return "JiraCustomFieldRequest [cversionsId=" + cversionsId + ", organizationsId=" + organizationsId
				+ ", subscriptionLevelId=" + subscriptionLevelId + "]";
	}
}
