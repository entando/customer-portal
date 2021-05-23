package com.entando.customerportal.web.rest;

import com.entando.customerportal.CustomerPortalApp;
import com.entando.customerportal.config.TestSecurityConfiguration;
import com.entando.customerportal.domain.TicketingSystem;
import com.entando.customerportal.repository.TicketingSystemRepository;
import com.entando.customerportal.service.TicketingSystemService;

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
 * Integration tests for the {@link TicketingSystemResource} REST controller.
 */
@SpringBootTest(classes = {CustomerPortalApp.class, TestSecurityConfiguration.class})
@AutoConfigureMockMvc
@WithMockUser
public class TicketingSystemResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICE_ACCOUNT = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE_ACCOUNT = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICE_ACCOUNT_SECRET = "AAAAAAAAAA";
    private static final String UPDATED_SERVICE_ACCOUNT_SECRET = "BBBBBBBBBB";

    private static final String DEFAULT_SYSTEM_ID = "AAAAAAAAAA";
    private static final String UPDATED_SYSTEM_ID = "BBBBBBBBBB";

    @Autowired
    private TicketingSystemRepository ticketingSystemRepository;

    @Autowired
    private TicketingSystemService ticketingSystemService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTicketingSystemMockMvc;

    private TicketingSystem ticketingSystem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketingSystem createEntity(EntityManager em) {
        TicketingSystem ticketingSystem = new TicketingSystem()
            .url(DEFAULT_URL)
            .serviceAccount(DEFAULT_SERVICE_ACCOUNT)
            .serviceAccountSecret(DEFAULT_SERVICE_ACCOUNT_SECRET)
            .systemId(DEFAULT_SYSTEM_ID);
        return ticketingSystem;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TicketingSystem createUpdatedEntity(EntityManager em) {
        TicketingSystem ticketingSystem = new TicketingSystem()
            .url(UPDATED_URL)
            .serviceAccount(UPDATED_SERVICE_ACCOUNT)
            .serviceAccountSecret(UPDATED_SERVICE_ACCOUNT_SECRET)
            .systemId(UPDATED_SYSTEM_ID);
        return ticketingSystem;
    }

    @BeforeEach
    public void initTest() {
        ticketingSystem = createEntity(em);
    }

    @Test
    @Transactional
    public void createTicketingSystem() throws Exception {
        int databaseSizeBeforeCreate = ticketingSystemRepository.findAll().size();
        // Create the TicketingSystem
        restTicketingSystemMockMvc.perform(post("/api/ticketing-systems").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ticketingSystem)))
            .andExpect(status().isCreated());

        // Validate the TicketingSystem in the database
        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeCreate + 1);
        TicketingSystem testTicketingSystem = ticketingSystemList.get(ticketingSystemList.size() - 1);
        assertThat(testTicketingSystem.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testTicketingSystem.getServiceAccount()).isEqualTo(DEFAULT_SERVICE_ACCOUNT);
        assertThat(testTicketingSystem.getServiceAccountSecret()).isEqualTo(DEFAULT_SERVICE_ACCOUNT_SECRET);
        assertThat(testTicketingSystem.getSystemId()).isEqualTo(DEFAULT_SYSTEM_ID);
    }

    @Test
    @Transactional
    public void createTicketingSystemWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = ticketingSystemRepository.findAll().size();

        // Create the TicketingSystem with an existing ID
        ticketingSystem.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTicketingSystemMockMvc.perform(post("/api/ticketing-systems").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ticketingSystem)))
            .andExpect(status().isBadRequest());

        // Validate the TicketingSystem in the database
        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = ticketingSystemRepository.findAll().size();
        // set the field null
        ticketingSystem.setUrl(null);

        // Create the TicketingSystem, which fails.


        restTicketingSystemMockMvc.perform(post("/api/ticketing-systems").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ticketingSystem)))
            .andExpect(status().isBadRequest());

        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkServiceAccountIsRequired() throws Exception {
        int databaseSizeBeforeTest = ticketingSystemRepository.findAll().size();
        // set the field null
        ticketingSystem.setServiceAccount(null);

        // Create the TicketingSystem, which fails.


        restTicketingSystemMockMvc.perform(post("/api/ticketing-systems").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ticketingSystem)))
            .andExpect(status().isBadRequest());

        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkServiceAccountSecretIsRequired() throws Exception {
        int databaseSizeBeforeTest = ticketingSystemRepository.findAll().size();
        // set the field null
        ticketingSystem.setServiceAccountSecret(null);

        // Create the TicketingSystem, which fails.


        restTicketingSystemMockMvc.perform(post("/api/ticketing-systems").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ticketingSystem)))
            .andExpect(status().isBadRequest());

        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTicketingSystems() throws Exception {
        // Initialize the database
        ticketingSystemRepository.saveAndFlush(ticketingSystem);

        // Get all the ticketingSystemList
        restTicketingSystemMockMvc.perform(get("/api/ticketing-systems?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ticketingSystem.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].serviceAccount").value(hasItem(DEFAULT_SERVICE_ACCOUNT)))
            .andExpect(jsonPath("$.[*].serviceAccountSecret").value(hasItem(DEFAULT_SERVICE_ACCOUNT_SECRET)))
            .andExpect(jsonPath("$.[*].systemId").value(hasItem(DEFAULT_SYSTEM_ID)));
    }

    @Test
    @Transactional
    public void getTicketingSystem() throws Exception {
        // Initialize the database
        ticketingSystemRepository.saveAndFlush(ticketingSystem);

        // Get the ticketingSystem
        restTicketingSystemMockMvc.perform(get("/api/ticketing-systems/{id}", ticketingSystem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ticketingSystem.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.serviceAccount").value(DEFAULT_SERVICE_ACCOUNT))
            .andExpect(jsonPath("$.serviceAccountSecret").value(DEFAULT_SERVICE_ACCOUNT_SECRET))
            .andExpect(jsonPath("$.systemId").value(DEFAULT_SYSTEM_ID));
    }
    @Test
    @Transactional
    public void getNonExistingTicketingSystem() throws Exception {
        // Get the ticketingSystem
        restTicketingSystemMockMvc.perform(get("/api/ticketing-systems/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTicketingSystem() throws Exception {
        // Initialize the database
        ticketingSystemService.save(ticketingSystem);

        int databaseSizeBeforeUpdate = ticketingSystemRepository.findAll().size();

        // Update the ticketingSystem
        TicketingSystem updatedTicketingSystem = ticketingSystemRepository.findById(ticketingSystem.getId()).get();
        // Disconnect from session so that the updates on updatedTicketingSystem are not directly saved in db
        em.detach(updatedTicketingSystem);
        updatedTicketingSystem
            .url(UPDATED_URL)
            .serviceAccount(UPDATED_SERVICE_ACCOUNT)
            .serviceAccountSecret(UPDATED_SERVICE_ACCOUNT_SECRET)
            .systemId(UPDATED_SYSTEM_ID);

        restTicketingSystemMockMvc.perform(put("/api/ticketing-systems").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTicketingSystem)))
            .andExpect(status().isOk());

        // Validate the TicketingSystem in the database
        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeUpdate);
        TicketingSystem testTicketingSystem = ticketingSystemList.get(ticketingSystemList.size() - 1);
        assertThat(testTicketingSystem.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testTicketingSystem.getServiceAccount()).isEqualTo(UPDATED_SERVICE_ACCOUNT);
        assertThat(testTicketingSystem.getServiceAccountSecret()).isEqualTo(UPDATED_SERVICE_ACCOUNT_SECRET);
        assertThat(testTicketingSystem.getSystemId()).isEqualTo(UPDATED_SYSTEM_ID);
    }

    @Test
    @Transactional
    public void updateNonExistingTicketingSystem() throws Exception {
        int databaseSizeBeforeUpdate = ticketingSystemRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTicketingSystemMockMvc.perform(put("/api/ticketing-systems").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ticketingSystem)))
            .andExpect(status().isBadRequest());

        // Validate the TicketingSystem in the database
        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTicketingSystem() throws Exception {
        // Initialize the database
        ticketingSystemService.save(ticketingSystem);

        int databaseSizeBeforeDelete = ticketingSystemRepository.findAll().size();

        // Delete the ticketingSystem
        restTicketingSystemMockMvc.perform(delete("/api/ticketing-systems/{id}", ticketingSystem.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TicketingSystem> ticketingSystemList = ticketingSystemRepository.findAll();
        assertThat(ticketingSystemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
