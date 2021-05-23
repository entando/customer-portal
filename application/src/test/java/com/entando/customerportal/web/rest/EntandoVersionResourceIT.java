package com.entando.customerportal.web.rest;

import com.entando.customerportal.CustomerPortalApp;
import com.entando.customerportal.config.TestSecurityConfiguration;
import com.entando.customerportal.domain.EntandoVersion;
import com.entando.customerportal.repository.EntandoVersionRepository;
import com.entando.customerportal.service.EntandoVersionService;

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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.entando.customerportal.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link EntandoVersionResource} REST controller.
 */
@SpringBootTest(classes = {CustomerPortalApp.class, TestSecurityConfiguration.class})
@AutoConfigureMockMvc
@WithMockUser
public class EntandoVersionResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_STATUS = false;
    private static final Boolean UPDATED_STATUS = true;

    private static final ZonedDateTime DEFAULT_START_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

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
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE);
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
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);
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
        assertThat(testEntandoVersion.isStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testEntandoVersion.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testEntandoVersion.getEndDate()).isEqualTo(DEFAULT_END_DATE);
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
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.booleanValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(sameInstant(DEFAULT_START_DATE))))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(sameInstant(DEFAULT_END_DATE))));
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
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.booleanValue()))
            .andExpect(jsonPath("$.startDate").value(sameInstant(DEFAULT_START_DATE)))
            .andExpect(jsonPath("$.endDate").value(sameInstant(DEFAULT_END_DATE)));
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
            .name(UPDATED_NAME)
            .status(UPDATED_STATUS)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restEntandoVersionMockMvc.perform(put("/api/entando-versions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedEntandoVersion)))
            .andExpect(status().isOk());

        // Validate the EntandoVersion in the database
        List<EntandoVersion> entandoVersionList = entandoVersionRepository.findAll();
        assertThat(entandoVersionList).hasSize(databaseSizeBeforeUpdate);
        EntandoVersion testEntandoVersion = entandoVersionList.get(entandoVersionList.size() - 1);
        assertThat(testEntandoVersion.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEntandoVersion.isStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEntandoVersion.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testEntandoVersion.getEndDate()).isEqualTo(UPDATED_END_DATE);
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
