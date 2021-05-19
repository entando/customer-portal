package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class EntandoVersionTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EntandoVersion.class);
        EntandoVersion entandoVersion1 = new EntandoVersion();
        entandoVersion1.setId(1L);
        EntandoVersion entandoVersion2 = new EntandoVersion();
        entandoVersion2.setId(entandoVersion1.getId());
        assertThat(entandoVersion1).isEqualTo(entandoVersion2);
        entandoVersion2.setId(2L);
        assertThat(entandoVersion1).isNotEqualTo(entandoVersion2);
        entandoVersion1.setId(null);
        assertThat(entandoVersion1).isNotEqualTo(entandoVersion2);
    }
}
