package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.CustportApp;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import com.mycompany.myapp.domain.EntandoVersion;
import com.mycompany.myapp.repository.EntandoVersionRepository;
import com.mycompany.myapp.service.EntandoVersionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link EntandoVersionResource} REST controller.
 */
@SpringBootTest(classes = { CustportApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class EntandoVersionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private EntandoVersionRepository entandoVersionRepository;

    @Autowired
    private EntandoVersionService entandoVersionService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEntandoVersionMockMvc;

    private EntandoVersion entandoVersion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntandoVersion createEntity(EntityManager em) {
        EntandoVersion entandoVersion = new EntandoVersion()
            .name(DEFAULT_NAME);
        return entandoVersion;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EntandoVersion createUpdatedEntity(EntityManager em) {
        EntandoVersion entandoVersion = new EntandoVersion()
            .name(UPDATED_NAME);
        return entandoVersion;
    }

    @BeforeEach
    public void initTest() {
        entandoVersion = createEntity(em);
    }

    @Test
    @Transactional
    public void createEntandoVersion() throws Exception {
        int databaseSizeBeforeCreate = entandoVersionRepository.findAll().size();
        // Create the EntandoVersion
        restEntandoVersionMockMvc.perform(post("/api/entando-versions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(entandoVersion)))
            .andExpect(status().isCreated());

        // Validate the EntandoVersion in the database
        List<EntandoVersion> entandoVersionList = entandoVersionRepository.findAll();
        assertThat(entandoVersionList).hasSize(databaseSizeBeforeCreate + 1);
        EntandoVersion testEntandoVersion = entandoVersionList.get(entandoVersionList.size() - 1);
        assertThat(testEntandoVersion.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createEntandoVersionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = entandoVersionRepository.findAll().size();

        // Create the EntandoVersion with an existing ID
        entandoVersion.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEntandoVersionMockMvc.perform(post("/api/entando-versions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(entandoVersion)))
            .andExpect(status().isBadRequest());

        // Validate the EntandoVersion in the database
        List<EntandoVersion> entandoVersionList = entandoVersionRepository.findAll();
        assertThat(entandoVersionList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = entandoVersionRepository.findAll().size();
        // set the field null
        entandoVersion.setName(null);

        // Create the EntandoVersion, which fails.


        restEntandoVersionMockMvc.perform(post("/api/entando-versions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(entandoVersion)))
            .andExpect(status().isBadRequest());

        List<EntandoVersion> entandoVersionList = entandoVersionRepository.findAll();
        assertThat(entandoVersionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEntandoVersions() throws Exception {
        // Initialize the database
        entandoVersionRepository.saveAndFlush(entandoVersion);

        // Get all the entandoVersionList
        restEntandoVersionMockMvc.perform(get("/api/entando-versions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(entandoVersion.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @Test
    @Transactional
    public void getEntandoVersion() throws Exception {
        // Initialize the database
        entandoVersionRepository.saveAndFlush(entandoVersion);

        // Get the entandoVersion
        restEntandoVersionMockMvc.perform(get("/api/entando-versions/{id}", entandoVersion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(entandoVersion.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingEntandoVersion() throws Exception {
        // Get the entandoVersion
        restEntandoVersionMockMvc.perform(get("/api/entando-versions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEntandoVersion() throws Exception {
        // Initialize the database
        entandoVersionService.save(entandoVersion);

        int databaseSizeBeforeUpdate = entandoVersionRepository.findAll().size();

        // Update the entandoVersion
        EntandoVersion updatedEntandoVersion = entandoVersionRepository.findById(entandoVersion.getId()).get();
        // Disconnect from session so that the updates on updatedEntandoVersion are not directly saved in db
        em.detach(updatedEntandoVersion);
        updatedEntandoVersion
            .name(UPDATED_NAME);

        restEntandoVersionMockMvc.perform(put("/api/entando-versions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedEntandoVersion)))
            .andExpect(status().isOk());

        // Validate the EntandoVersion in the database
        List<EntandoVersion> entandoVersionList = entandoVersionRepository.findAll();
        assertThat(entandoVersionList).hasSize(databaseSizeBeforeUpdate);
        EntandoVersion testEntandoVersion = entandoVersionList.get(entandoVersionList.size() - 1);
        assertThat(testEntandoVersion.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingEntandoVersion() throws Exception {
        int databaseSizeBeforeUpdate = entandoVersionRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntandoVersionMockMvc.perform(put("/api/entando-versions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(entandoVersion)))
            .andExpect(status().isBadRequest());

        // Validate the EntandoVersion in the database
        List<EntandoVersion> entandoVersionList = entandoVersionRepository.findAll();
        assertThat(entandoVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEntandoVersion() throws Exception {
        // Initialize the database
        entandoVersionService.save(entandoVersion);

        int databaseSizeBeforeDelete = entandoVersionRepository.findAll().size();

        // Delete the entandoVersion
        restEntandoVersionMockMvc.perform(delete("/api/entando-versions/{id}", entandoVersion.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EntandoVersion> entandoVersionList = entandoVersionRepository.findAll();
        assertThat(entandoVersionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
