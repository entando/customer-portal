package com.mycompany.myapp.request;

import com.mycompany.myapp.domain.ProjectSubscription;

public class SubscriptionCreationRequest {
    public SubscriptionCreationRequest() { }

    private ProjectSubscription projectSubscription;

    private Long entandoVersionId;
    private Long projectId;
    private boolean renewal;

    public ProjectSubscription getProjectSubscription() {
        return projectSubscription;
    }

    public void setProjectSubscription(ProjectSubscription projectSubscription) {
        this.projectSubscription = projectSubscription;
    }

    public Long getEntandoVersionId() {
        return entandoVersionId;
    }

    public void setEntandoVersionId(Long entandoVersionId) {
        this.entandoVersionId = entandoVersionId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public boolean isRenewal() {
        return renewal;
    }

    public void setRenewal(boolean renewal) {
        this.renewal = renewal;
    }
}
