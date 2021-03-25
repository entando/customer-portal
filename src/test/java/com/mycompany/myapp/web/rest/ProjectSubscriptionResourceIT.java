package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.CustportApp;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import com.mycompany.myapp.domain.ProjectSubscription;
import com.mycompany.myapp.repository.ProjectSubscriptionRepository;
import com.mycompany.myapp.service.ProjectSubscriptionService;

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

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.domain.enumeration.SubscriptionLevel;
import com.mycompany.myapp.domain.enumeration.Status;
/**
 * Integration tests for the {@link ProjectSubscriptionResource} REST controller.
 */
@SpringBootTest(classes = { CustportApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class ProjectSubscriptionResourceIT {

    private static final SubscriptionLevel DEFAULT_LEVEL = SubscriptionLevel.GOLD;
    private static final SubscriptionLevel UPDATED_LEVEL = SubscriptionLevel.PLATINUM;

    private static final Status DEFAULT_STATUS = Status.REQUESTED;
    private static final Status UPDATED_STATUS = Status.ACTIVE;

    private static final Integer DEFAULT_LENGTH_IN_MONTHS = 1;
    private static final Integer UPDATED_LENGTH_IN_MONTHS = 2;

    private static final ZonedDateTime DEFAULT_START_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    @Autowired
    private ProjectSubscriptionRepository projectSubscriptionRepository;

    @Autowired
    private ProjectSubscriptionService projectSubscriptionService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProjectSubscriptionMockMvc;

    private ProjectSubscription projectSubscription;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectSubscription createEntity(EntityManager em) {
        ProjectSubscription projectSubscription = new ProjectSubscription()
            .level(DEFAULT_LEVEL)
            .status(DEFAULT_STATUS)
            .lengthInMonths(DEFAULT_LENGTH_IN_MONTHS)
            .startDate(DEFAULT_START_DATE)
            .notes(DEFAULT_NOTES);
        return projectSubscription;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProjectSubscription createUpdatedEntity(EntityManager em) {
        ProjectSubscription projectSubscription = new ProjectSubscription()
            .level(UPDATED_LEVEL)
            .status(UPDATED_STATUS)
            .lengthInMonths(UPDATED_LENGTH_IN_MONTHS)
            .startDate(UPDATED_START_DATE)
            .notes(UPDATED_NOTES);
        return projectSubscription;
    }

    @BeforeEach
    public void initTest() {
        projectSubscription = createEntity(em);
    }

    @Test
    @Transactional
    public void createProjectSubscription() throws Exception {
        int databaseSizeBeforeCreate = projectSubscriptionRepository.findAll().size();
        // Create the ProjectSubscription
        restProjectSubscriptionMockMvc.perform(post("/api/project-subscriptions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(projectSubscription)))
            .andExpect(status().isCreated());

        // Validate the ProjectSubscription in the database
        List<ProjectSubscription> projectSubscriptionList = projectSubscriptionRepository.findAll();
        assertThat(projectSubscriptionList).hasSize(databaseSizeBeforeCreate + 1);
        ProjectSubscription testProjectSubscription = projectSubscriptionList.get(projectSubscriptionList.size() - 1);
        assertThat(testProjectSubscription.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testProjectSubscription.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testProjectSubscription.getLengthInMonths()).isEqualTo(DEFAULT_LENGTH_IN_MONTHS);
        assertThat(testProjectSubscription.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testProjectSubscription.getNotes()).isEqualTo(DEFAULT_NOTES);
    }

    @Test
    @Transactional
    public void createProjectSubscriptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = projectSubscriptionRepository.findAll().size();

        // Create the ProjectSubscription with an existing ID
        projectSubscription.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProjectSubscriptionMockMvc.perform(post("/api/project-subscriptions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(projectSubscription)))
            .andExpect(status().isBadRequest());

        // Validate the ProjectSubscription in the database
        List<ProjectSubscription> projectSubscriptionList = projectSubscriptionRepository.findAll();
        assertThat(projectSubscriptionList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkLevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectSubscriptionRepository.findAll().size();
        // set the field null
        projectSubscription.setLevel(null);

        // Create the ProjectSubscription, which fails.


        restProjectSubscriptionMockMvc.perform(post("/api/project-subscriptions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(projectSubscription)))
            .andExpect(status().isBadRequest());

        List<ProjectSubscription> projectSubscriptionList = projectSubscriptionRepository.findAll();
        assertThat(projectSubscriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = projectSubscriptionRepository.findAll().size();
        // set the field null
        projectSubscription.setStatus(null);

        // Create the ProjectSubscription, which fails.


        restProjectSubscriptionMockMvc.perform(post("/api/project-subscriptions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(projectSubscription)))
            .andExpect(status().isBadRequest());

        List<ProjectSubscription> projectSubscriptionList = projectSubscriptionRepository.findAll();
        assertThat(projectSubscriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProjectSubscriptions() throws Exception {
        // Initialize the database
        projectSubscriptionRepository.saveAndFlush(projectSubscription);

        // Get all the projectSubscriptionList
        restProjectSubscriptionMockMvc.perform(get("/api/project-subscriptions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(projectSubscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].lengthInMonths").value(hasItem(DEFAULT_LENGTH_IN_MONTHS)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(sameInstant(DEFAULT_START_DATE))))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)));
    }
    
    @Test
    @Transactional
    public void getProjectSubscription() throws Exception {
        // Initialize the database
        projectSubscriptionRepository.saveAndFlush(projectSubscription);

        // Get the projectSubscription
        restProjectSubscriptionMockMvc.perform(get("/api/project-subscriptions/{id}", projectSubscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(projectSubscription.getId().intValue()))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.lengthInMonths").value(DEFAULT_LENGTH_IN_MONTHS))
            .andExpect(jsonPath("$.startDate").value(sameInstant(DEFAULT_START_DATE)))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES));
    }
    @Test
    @Transactional
    public void getNonExistingProjectSubscription() throws Exception {
        // Get the projectSubscription
        restProjectSubscriptionMockMvc.perform(get("/api/project-subscriptions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProjectSubscription() throws Exception {
        // Initialize the database
        projectSubscriptionService.save(projectSubscription);

        int databaseSizeBeforeUpdate = projectSubscriptionRepository.findAll().size();

        // Update the projectSubscription
        ProjectSubscription updatedProjectSubscription = projectSubscriptionRepository.findById(projectSubscription.getId()).get();
        // Disconnect from session so that the updates on updatedProjectSubscription are not directly saved in db
        em.detach(updatedProjectSubscription);
        updatedProjectSubscription
            .level(UPDATED_LEVEL)
            .status(UPDATED_STATUS)
            .lengthInMonths(UPDATED_LENGTH_IN_MONTHS)
            .startDate(UPDATED_START_DATE)
            .notes(UPDATED_NOTES);

        restProjectSubscriptionMockMvc.perform(put("/api/project-subscriptions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedProjectSubscription)))
            .andExpect(status().isOk());

        // Validate the ProjectSubscription in the database
        List<ProjectSubscription> projectSubscriptionList = projectSubscriptionRepository.findAll();
        assertThat(projectSubscriptionList).hasSize(databaseSizeBeforeUpdate);
        ProjectSubscription testProjectSubscription = projectSubscriptionList.get(projectSubscriptionList.size() - 1);
        assertThat(testProjectSubscription.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testProjectSubscription.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testProjectSubscription.getLengthInMonths()).isEqualTo(UPDATED_LENGTH_IN_MONTHS);
        assertThat(testProjectSubscription.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testProjectSubscription.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    @Transactional
    public void updateNonExistingProjectSubscription() throws Exception {
        int databaseSizeBeforeUpdate = projectSubscriptionRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProjectSubscriptionMockMvc.perform(put("/api/project-subscriptions").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(projectSubscription)))
            .andExpect(status().isBadRequest());

        // Validate the ProjectSubscription in the database
        List<ProjectSubscription> projectSubscriptionList = projectSubscriptionRepository.findAll();
        assertThat(projectSubscriptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProjectSubscription() throws Exception {
        // Initialize the database
        projectSubscriptionService.save(projectSubscription);

        int databaseSizeBeforeDelete = projectSubscriptionRepository.findAll().size();

        // Delete the projectSubscription
        restProjectSubscriptionMockMvc.perform(delete("/api/project-subscriptions/{id}", projectSubscription.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProjectSubscription> projectSubscriptionList = projectSubscriptionRepository.findAll();
        assertThat(projectSubscriptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
