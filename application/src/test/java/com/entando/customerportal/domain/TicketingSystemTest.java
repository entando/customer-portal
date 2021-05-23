package com.entando.customerportal.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

import com.entando.customerportal.web.rest.TestUtil;

public class TicketingSystemTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TicketingSystem.class);
        TicketingSystem ticketingSystem1 = new TicketingSystem();
        ticketingSystem1.setId(1L);
        TicketingSystem ticketingSystem2 = new TicketingSystem();
        ticketingSystem2.setId(ticketingSystem1.getId());
        assertThat(ticketingSystem1).isEqualTo(ticketingSystem2);
        ticketingSystem2.setId(2L);
        assertThat(ticketingSystem1).isNotEqualTo(ticketingSystem2);
        ticketingSystem1.setId(null);
        assertThat(ticketingSystem1).isNotEqualTo(ticketingSystem2);
    }
}
