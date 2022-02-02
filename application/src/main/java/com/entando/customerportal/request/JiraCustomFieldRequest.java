package com.entando.customerportal.request;

import java.util.Objects;

public class JiraCustomFieldRequest {

	private Long versionId;
	private Long organizationId;
	private Long subscriptionLevelId;

	public Long getVersionId() {
		return versionId;
	}
	public void setVersionId(Long versionId) {
		this.versionId = versionId;
	}
	public Long getOrganizationId() {
		return organizationId;
	}
	public void setOrganizationId(Long organizationId) {
		this.organizationId = organizationId;
	}
	public Long getSubscriptionLevelId() {
		return subscriptionLevelId;
	}
	public void setSubscriptionLevelId(Long subscriptionLevelId) {
		this.subscriptionLevelId = subscriptionLevelId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(organizationId, subscriptionLevelId, versionId);
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
		return Objects.equals(organizationId, other.organizationId)
				&& Objects.equals(subscriptionLevelId, other.subscriptionLevelId)
				&& Objects.equals(versionId, other.versionId);
	}
	@Override
	public String toString() {
		return "JiraCustomFieldRequest [versionId=" + versionId + ", organizationId=" + organizationId
				+ ", subscriptionLevelId=" + subscriptionLevelId + "]";
	}
}
