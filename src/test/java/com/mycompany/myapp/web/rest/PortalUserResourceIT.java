package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.CustportApp;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import com.mycompany.myapp.domain.PortalUser;
import com.mycompany.myapp.repository.PortalUserRepository;
import com.mycompany.myapp.service.PortalUserService;

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
 * Integration tests for the {@link PortalUserResource} REST controller.
 */
@SpringBootTest(classes = { CustportApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class PortalUserResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private PortalUserRepository portalUserRepository;

    @Autowired
    private PortalUserService portalUserService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPortalUserMockMvc;

    private PortalUser portalUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PortalUser createEntity(EntityManager em) {
        PortalUser portalUser = new PortalUser()
            .username(DEFAULT_USERNAME)
            .email(DEFAULT_EMAIL);
        return portalUser;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PortalUser createUpdatedEntity(EntityManager em) {
        PortalUser portalUser = new PortalUser()
            .username(UPDATED_USERNAME)
            .email(UPDATED_EMAIL);
        return portalUser;
    }

    @BeforeEach
    public void initTest() {
        portalUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createPortalUser() throws Exception {
        int databaseSizeBeforeCreate = portalUserRepository.findAll().size();
        // Create the PortalUser
        restPortalUserMockMvc.perform(post("/api/portal-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(portalUser)))
            .andExpect(status().isCreated());

        // Validate the PortalUser in the database
        List<PortalUser> portalUserList = portalUserRepository.findAll();
        assertThat(portalUserList).hasSize(databaseSizeBeforeCreate + 1);
        PortalUser testPortalUser = portalUserList.get(portalUserList.size() - 1);
        assertThat(testPortalUser.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testPortalUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void createPortalUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = portalUserRepository.findAll().size();

        // Create the PortalUser with an existing ID
        portalUser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPortalUserMockMvc.perform(post("/api/portal-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(portalUser)))
            .andExpect(status().isBadRequest());

        // Validate the PortalUser in the database
        List<PortalUser> portalUserList = portalUserRepository.findAll();
        assertThat(portalUserList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkUsernameIsRequired() throws Exception {
        int databaseSizeBeforeTest = portalUserRepository.findAll().size();
        // set the field null
        portalUser.setUsername(null);

        // Create the PortalUser, which fails.


        restPortalUserMockMvc.perform(post("/api/portal-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(portalUser)))
            .andExpect(status().isBadRequest());

        List<PortalUser> portalUserList = portalUserRepository.findAll();
        assertThat(portalUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPortalUsers() throws Exception {
        // Initialize the database
        portalUserRepository.saveAndFlush(portalUser);

        // Get all the portalUserList
        restPortalUserMockMvc.perform(get("/api/portal-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(portalUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }
    
    @Test
    @Transactional
    public void getPortalUser() throws Exception {
        // Initialize the database
        portalUserRepository.saveAndFlush(portalUser);

        // Get the portalUser
        restPortalUserMockMvc.perform(get("/api/portal-users/{id}", portalUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(portalUser.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }
    @Test
    @Transactional
    public void getNonExistingPortalUser() throws Exception {
        // Get the portalUser
        restPortalUserMockMvc.perform(get("/api/portal-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePortalUser() throws Exception {
        // Initialize the database
        portalUserService.save(portalUser);

        int databaseSizeBeforeUpdate = portalUserRepository.findAll().size();

        // Update the portalUser
        PortalUser updatedPortalUser = portalUserRepository.findById(portalUser.getId()).get();
        // Disconnect from session so that the updates on updatedPortalUser are not directly saved in db
        em.detach(updatedPortalUser);
        updatedPortalUser
            .username(UPDATED_USERNAME)
            .email(UPDATED_EMAIL);

        restPortalUserMockMvc.perform(put("/api/portal-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPortalUser)))
            .andExpect(status().isOk());

        // Validate the PortalUser in the database
        List<PortalUser> portalUserList = portalUserRepository.findAll();
        assertThat(portalUserList).hasSize(databaseSizeBeforeUpdate);
        PortalUser testPortalUser = portalUserList.get(portalUserList.size() - 1);
        assertThat(testPortalUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testPortalUser.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void updateNonExistingPortalUser() throws Exception {
        int databaseSizeBeforeUpdate = portalUserRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPortalUserMockMvc.perform(put("/api/portal-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(portalUser)))
            .andExpect(status().isBadRequest());

        // Validate the PortalUser in the database
        List<PortalUser> portalUserList = portalUserRepository.findAll();
        assertThat(portalUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePortalUser() throws Exception {
        // Initialize the database
        portalUserService.save(portalUser);

        int databaseSizeBeforeDelete = portalUserRepository.findAll().size();

        // Delete the portalUser
        restPortalUserMockMvc.perform(delete("/api/portal-users/{id}", portalUser.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PortalUser> portalUserList = portalUserRepository.findAll();
        assertThat(portalUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
