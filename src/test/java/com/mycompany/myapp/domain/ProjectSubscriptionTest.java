package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class ProjectSubscriptionTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectSubscription.class);
        ProjectSubscription projectSubscription1 = new ProjectSubscription();
        projectSubscription1.setId(1L);
        ProjectSubscription projectSubscription2 = new ProjectSubscription();
        projectSubscription2.setId(projectSubscription1.getId());
        assertThat(projectSubscription1).isEqualTo(projectSubscription2);
        projectSubscription2.setId(2L);
        assertThat(projectSubscription1).isNotEqualTo(projectSubscription2);
        projectSubscription1.setId(null);
        assertThat(projectSubscription1).isNotEqualTo(projectSubscription2);
    }
}
