package com.mycompany.myapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.myapp.domain.EntandoVersion;
import com.mycompany.myapp.domain.PortalUser;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.ProjectSubscription;
import com.mycompany.myapp.request.SubscriptionCreationRequest;
import com.mycompany.myapp.security.AuthoritiesConstants;
import com.mycompany.myapp.security.SpringSecurityAuditorAware;
import com.mycompany.myapp.service.EntandoVersionService;
import com.mycompany.myapp.service.ProjectService;
import com.mycompany.myapp.service.ProjectSubscriptionService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ProjectSubscription}.
 */
@RestController
@RequestMapping("/api")
@PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
public class ProjectSubscriptionResource {

    private final Logger log = LoggerFactory.getLogger(ProjectSubscriptionResource.class);

    private static final String ENTITY_NAME = "custportAppProjectSubscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    @Autowired
    private JavaMailSender javaMailSender;

    private final ProjectSubscriptionService projectSubscriptionService;
    private final ProjectService projectService;
    private final EntandoVersionService entandoVersionService;

    public ProjectSubscriptionResource(ProjectSubscriptionService projectSubscriptionService, ProjectService projectService, EntandoVersionService entandoVersionService) {
        this.projectSubscriptionService = projectSubscriptionService;
        this.projectService = projectService;
        this.entandoVersionService = entandoVersionService;
    }

    /**
     * {@code POST  /project-subscriptions} : Create a new projectSubscription.
     *
     * @param subscriptionCreationRequest the projectSubscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectSubscription, or with status {@code 400 (Bad Request)} if the projectSubscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     * @throws MessagingException
     */
    @PostMapping("/project-subscriptions")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<ProjectSubscription> createProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest subscriptionCreationRequest) throws URISyntaxException, MessagingException {
        log.debug("REST request to save ProjectSubscription : {}", subscriptionCreationRequest);
        ProjectSubscription projectSubscription = subscriptionCreationRequest.getProjectSubscription();

        if (projectSubscription == null || projectSubscription.getId() != null) {
            throw new BadRequestAlertException("A new projectSubscription cannot already have an ID", ENTITY_NAME, "idexists");
        } else if (subscriptionCreationRequest.getEntandoVersionId() == null) {
            throw new BadRequestAlertException("Missing entando version id", ENTITY_NAME, "missingEntandoVersionId");
        } else if (subscriptionCreationRequest.getProjectId() == null) {
            throw new BadRequestAlertException("Missing project id ", ENTITY_NAME, "missingProjectId");
        }

        Optional<Project> associatedProjectOpt = projectService.findOne(subscriptionCreationRequest.getProjectId());
        if (!associatedProjectOpt.isPresent()) {
            throw new BadRequestAlertException("There was no project found with that id", ENTITY_NAME, "projectNotFound");
        }

        Optional<EntandoVersion> entandoVersionOpt = entandoVersionService.findOne(subscriptionCreationRequest.getEntandoVersionId());
        if (!entandoVersionOpt.isPresent()) {
            throw new BadRequestAlertException("There was no entando version found with that id", ENTITY_NAME, "entandoVersionNotFound");
        }

        associatedProjectOpt.ifPresent(project -> projectSubscription.setProject(project));
        entandoVersionOpt.ifPresent(entandoVersion -> projectSubscription.setEntandoVersion(entandoVersion));

        ProjectSubscription result = projectSubscriptionService.save(projectSubscription);

        //send an email to entando team only when this request is from customers
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserRole = authentication.getAuthorities().stream()
                  .anyMatch(r -> r.getAuthority().equals(AuthoritiesConstants.CUSTOMER));

        /*
        if (hasUserRole) {
            String from = "jordengerovac@gmail.com"; // email required
            String to = "jordengerovac@gmail.com"; // email required
            String password = "74ylOr96$j7";


            //JavaMailSenderImpl sender = new JavaMailSenderImpl();

            //sender.setUsername("jordengerovac@gmail.com");
            //sender.setPassword("74ylOr96$j7");
            //sender.setHost("smtp.gmail.com");
            //sender.setPort(587);


            Properties props = new Properties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.debug", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");
            Session session = Session.getInstance(props,
            new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(from, password);
                }
            });

            try {

                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(from));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
                message.setSubject("Subscription Notification");
                message.setText("<b>Hi</b>,<br><i>This is a notification for new subscription.</i>");

                Transport.send(message);

                System.out.println("Done");

            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }

            //
            //MimeMessage message = sender.createMimeMessage();
            //MimeMessageHelper helper = new MimeMessageHelper(message);
            //helper.setSubject("Subscription Notification");
            //helper.setFrom(from);
            //helper.setTo(to);

            // put HTML
            //helper.setText("<b>Hi</b>,<br><i>This is a notification for new subscription.</i>", true);
            //sender.send(message);
            //
        }
        */

        return ResponseEntity.created(new URI("/api/project-subscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-subscriptions} : Updates an existing projectSubscription.
     *
     * @param subscriptionCreationRequest the projectSubscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectSubscription,
     * or with status {@code 400 (Bad Request)} if the projectSubscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectSubscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-subscriptions")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<ProjectSubscription> updateProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest subscriptionCreationRequest) throws URISyntaxException {
        ProjectSubscription projectSubscription = subscriptionCreationRequest.getProjectSubscription();
        log.debug("REST request to update ProjectSubscription : {}", projectSubscription);

        if (projectSubscription == null || projectSubscription.getId() == null || !projectSubscriptionService.findOne(projectSubscription.getId()).isPresent()) {
            throw new BadRequestAlertException("Invalid Project Subscription id", ENTITY_NAME, "projectSubscriptionIdNull");
        }

        // projectId and entandoVersioId are currently excluded for this update. commented out for null exception.
        /*
        else if (subscriptionCreationRequest.getEntandoVersionId() == null) {
            throw new BadRequestAlertException("Missing entando version id", ENTITY_NAME, "missingEntandoVersionId");
        } else if (subscriptionCreationRequest.getProjectId() == null) {
            throw new BadRequestAlertException("Missing project id ", ENTITY_NAME, "missingProjectId");
        }

        // projectId and entandoVersioId are currently excluded for this update. commented out for null exception.

        Optional<Project> associatedProjectOpt = projectService.findOne(subscriptionCreationRequest.getProjectId());
        if (!associatedProjectOpt.isPresent()) {
            throw new BadRequestAlertException("There was no project found with that id", ENTITY_NAME, "projectNotFound");
        }

        Optional<EntandoVersion> entandoVersionOpt = entandoVersionService.findOne(subscriptionCreationRequest.getEntandoVersionId());
        if (!entandoVersionOpt.isPresent()) {
            throw new BadRequestAlertException("There was no entando version found with that id", ENTITY_NAME, "entandoVersionNotFound");
        }

        associatedProjectOpt.ifPresent(project -> projectSubscription.setProject(project));
        entandoVersionOpt.ifPresent(entandoVersion -> projectSubscription.setEntandoVersion(entandoVersion));
        */

        ProjectSubscription result = projectSubscriptionService.save(projectSubscription);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, projectSubscription.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /project-subscriptions} : get all the projectSubscriptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectSubscriptions in body.
     */
    @GetMapping("/project-subscriptions")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public List<ProjectSubscription> getAllProjectSubscriptions() {
        log.debug("REST request to get all ProjectSubscriptions");
        return projectSubscriptionService.findAll();
    }

    /**
     * {@code GET  /project-subscriptions/:id} : get the "id" projectSubscription.
     *
     * @param id the id of the projectSubscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectSubscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-subscriptions/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ADMIN_OR_SUPPORT)
    public ResponseEntity<ProjectSubscription> getProjectSubscription(@PathVariable Long id) {
        log.debug("REST request to get ProjectSubscription : {}", id);
        Optional<ProjectSubscription> projectSubscription = projectSubscriptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(projectSubscription);
    }

    /**
     * {@code DELETE  /project-subscriptions/:id} : delete the "id" projectSubscription.
     *
     * @param id the id of the projectSubscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-subscriptions/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<Void> deleteProjectSubscription(@PathVariable Long id) {
        log.debug("REST request to delete ProjectSubscription : {}", id);

        projectSubscriptionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code GET  /project-subscriptions/:id} : get the "id" projectSubscription.
     *
     * @param id the id of the projectSubscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectSubscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-subscriptions/mysubscription/{id}")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<ProjectSubscription> getMyProjectSubscription(@PathVariable Long id) {
        log.debug("REST request to get ProjectSubscription : {}", id);
        Optional<ProjectSubscription> projectSubscription = projectSubscriptionService.findOne(id);

        String currentUser = springSecurityAuditorAware.getCurrentUserLogin().get();
        Project project = projectSubscription.get().getProject();
        Set<PortalUser> projectUsers = projectService.getProjectUsers(project.getId());
        for(PortalUser user : projectUsers) {
            if (user.getUsername().equals(currentUser)) {
                return ResponseUtil.wrapOrNotFound(projectSubscription);
            }
        }
        return null;
    }

    @PutMapping("project-subscriptions/renew")
    @PreAuthorize(AuthoritiesConstants.HAS_ANY_PORTAL_ROLE)
    public ResponseEntity<ProjectSubscription> renewProjectSubscription(@Valid @RequestBody SubscriptionCreationRequest subscriptionCreationRequest) throws URISyntaxException {
        //ProjectSubscription projectSubscription = subscriptionCreationRequest.getProjectSubscription();
        long entandoVersionId = subscriptionCreationRequest.getEntandoVersionId();
        long projectId = subscriptionCreationRequest.getProjectId();
        ProjectSubscription renewSubscription = subscriptionCreationRequest.getProjectSubscription();

        log.debug("REST request to renew a subscription : entandoVersionId {}. projectVersionId {}", entandoVersionId, projectId);

        Optional<ProjectSubscription> subscriptionToRenewOpt = projectSubscriptionService.findLatestExpiredSubscription(entandoVersionId, projectId);
        if (!subscriptionToRenewOpt.isPresent()) {
            return ResponseUtil.wrapOrNotFound(subscriptionToRenewOpt);
        }

        ProjectSubscription subscriptionToRenew = subscriptionToRenewOpt.get();
        subscriptionToRenew.setLengthInMonths(renewSubscription.getLengthInMonths());
        subscriptionToRenew.setLevel(renewSubscription.getLevel());
        subscriptionToRenew.setStartDate(renewSubscription.getStartDate());

        ProjectSubscription result = projectSubscriptionService.save(subscriptionToRenew);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
}
