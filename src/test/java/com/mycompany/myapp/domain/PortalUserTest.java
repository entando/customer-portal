package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class PortalUserTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PortalUser.class);
        PortalUser portalUser1 = new PortalUser();
        portalUser1.setId(1L);
        PortalUser portalUser2 = new PortalUser();
        portalUser2.setId(portalUser1.getId());
        assertThat(portalUser1).isEqualTo(portalUser2);
        portalUser2.setId(2L);
        assertThat(portalUser1).isNotEqualTo(portalUser2);
        portalUser1.setId(null);
        assertThat(portalUser1).isNotEqualTo(portalUser2);
    }
}
