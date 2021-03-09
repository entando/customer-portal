package com.mycompany.myapp.request;

import com.mycompany.myapp.domain.ProjectSubscription;

public class SubscriptionCreationRequest {
    public SubscriptionCreationRequest() { }

    private ProjectSubscription projectSubscription;

    // Would it be better to send in a full entandoVersion object or harder for the front end?
    private Long entandoVersionId;
    private Long projectId;

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
}
