package com.mycompany.myapp.request;

import com.mycompany.myapp.domain.ProjectSubscription;

public class SubscriptionCreationRequest {
    public SubscriptionCreationRequest() { }

    private ProjectSubscription projectSubscription;

    // Would it be better to send in a full entandoVersion object or harder for the front end?
    private String entandoVersion;
    private String projectName;

    //TODO Missing some fields that are sent in front end due to unknown entity (contact name, number, email belong to both Customer and Project)

    public ProjectSubscription getProjectSubscription() {
        return projectSubscription;
    }

    public void setProjectSubscription(ProjectSubscription projectSubscription) {
        this.projectSubscription = projectSubscription;
    }

    public String getEntandoVersion() {
        return entandoVersion;
    }

    public void setEntandoVersion(String entandoVersion) {
        this.entandoVersion = entandoVersion;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
