package com.entando.customerportal.request;

import com.entando.customerportal.domain.TicketingSystem;

/**
 * Wrap the TicketingSystem so the secret can be provided for updates without including it in the JSON
 */
public class TicketingSystemRequest {
    public TicketingSystemRequest() {
    }

    private String secret;
    private TicketingSystem ticketingSystem;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public TicketingSystem getTicketingSystem() {
        return ticketingSystem;
    }

    public void setTicketingSystem(TicketingSystem ticketingSystem) {
        this.ticketingSystem = ticketingSystem;
    }
}
