package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.EntandoVersion;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.enumeration.SubscriptionLevel;
import com.mycompany.myapp.security.SpringSecurityAuditorAware;
import com.mycompany.myapp.service.JiraTicketingSystemService;
import com.mycompany.myapp.domain.TicketingSystem;
import com.mycompany.myapp.domain.Ticket;
import com.mycompany.myapp.repository.TicketingSystemRepository;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service Implementation for managing {@link TicketingSystem}.
 */
@Service
@Transactional
public class JiraTicketingSystemServiceImpl implements JiraTicketingSystemService {

    @Autowired
    SpringSecurityAuditorAware springSecurityAuditorAware;

    private final Logger log = LoggerFactory.getLogger(TicketingSystemServiceImpl.class);

    private final TicketingSystemRepository ticketingSystemRepository;

    public JiraTicketingSystemServiceImpl(TicketingSystemRepository ticketingSystemRepository) {
        this.ticketingSystemRepository = ticketingSystemRepository;
    }

    /**
     * Save a ticketingSystem.
     *
     * @param ticketingSystem the entity to save.
     * @return the persisted entity.
     */
    @Override
    public TicketingSystem save(TicketingSystem ticketingSystem) {
        log.debug("Request to save TicketingSystem : {}", ticketingSystem);
        return ticketingSystemRepository.save(ticketingSystem);
    }

    /**
     * Get all the ticketingSystems.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<TicketingSystem> findAll() {
        log.debug("Request to get all TicketingSystems");
        return ticketingSystemRepository.findAll();
    }

    /**
     * Get one ticketingSystem by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<TicketingSystem> findOne(Long id) {
        log.debug("Request to get TicketingSystem : {}", id);
        return ticketingSystemRepository.findById(id);
    }

    /**
     * Delete the ticketingSystem by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete TicketingSystem : {}", id);

        ticketingSystemRepository.deleteById(id);
    }

    /**
     * Get the "systemId" ticketingSystem.
     *
     * @param systemId the systemId of the entity.
     * @return the entity.
     */
    @Override
    public TicketingSystem findTicketingSystemBySystemId(String systemId) {
        return ticketingSystemRepository.findTicketingSystemBySystemId(systemId);
    }

    /**
     * Get all the tickets corresponding to the projectCode.
     *
     * @param systemId the systemId of the ticket
     * @param baseUrl the baseUrl of the project
     *
     * @return the list of Tickets.
     */
    @Override
    public String fetchJiraTicketsBySystemId(String systemId, String baseUrl, String serviceAccount, String serviceAccountSecret) {
        String searchQuery = "search?jql=project=";
        String user = serviceAccount;
        String password = serviceAccountSecret;

        try {
            URL url = new URL(baseUrl + searchQuery + systemId);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            String auth = user + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");

            int status = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            JSONObject responseObject = new JSONObject(content.toString());

            return responseObject.toString();
        }
        catch(Exception e) {
            log.error("Fetch failure {}", systemId, e);
        }
        return null;
    }

    @Override
    public String fetchJiraTicketsBySystemIdAndOrganization(String project, String organization, String baseUrl, String serviceAccount, String serviceAccountSecret) {
        String searchQuery = "search?jql=Organizations=" + organization + "%20AND%20project=" + project;
        String user = serviceAccount;
        String password = serviceAccountSecret;

        try {
            URL url = new URL(baseUrl + searchQuery);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            String auth = user + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");

            int status = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            JSONObject responseObject = new JSONObject(content.toString());

            return responseObject.toString();
        }
        catch(Exception e) {
            log.error("Fetch failure {}", searchQuery, e);
        }
        return null;
    }

    /**
     * Get all the tickets corresponding to the projectCode.
     *
     * @param systemId the systemId of the ticket
     * @param baseUrl the baseUrl of the project
     *
     * @return the list of Tickets.
     */
    @Override
    public String fetchSingleJiraTicketBySystemId(String systemId, String baseUrl, String serviceAccount,
                                                  String serviceAccountSecret) {
        String user = serviceAccount;
        String password = serviceAccountSecret;

        try {
            URL url = new URL(baseUrl + "issue/" + systemId);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            String auth = user + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");

            int status = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            JSONObject responseObject = new JSONObject(content.toString());

            return responseObject.toString();
        }
        catch(Exception e) {
            log.error("Fetch failure {}", systemId, e);
        }
        return null;
    }

    /**
     * Creating a new Jira ticket.
     *
     * @param systemId the systemId of the ticket
     * @param baseUrl the baseUrl of the project
     *
     * @return the JSON response
     */
    @Override
    public String createJiraTicket(String systemId, String baseUrl, String serviceAccount,
                                   String serviceAccountSecret, Ticket ticket) {
        String user = serviceAccount;
        String password = serviceAccountSecret;

        try {
            URL url = new URL(baseUrl + "issue");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");

            String auth = user + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");
            con.setDoOutput(true);
            //TODO: refactor to use JSONObject, etc.
            String jsonInputString = "{\n" +
                "    \"fields\": {\n" +
                "       \"project\":\n" +
                "       {\n" +
                "          \"key\": \"" + systemId + "\"\n" +
                "       },\n" +
                "       \"summary\": \"" + ticket.getDescription() + "\",\n" +
                "       \"description\": \"Creating of an issue using project keys and issue type names using the REST API\",\n" +
                "       \"issuetype\": {\n" +
                "          \"name\": \"" + ticket.getType() + "\"\n" +
                "       },\n" +
                "       \"priority\":\n" +
                "       {\n" +
                "          \"name\": \"" + ticket.getPriority() + "\"\n" +
                "       }\n" +
                "   }\n" +
                "}";
            try(OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int status = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            JSONObject responseObject = new JSONObject(content.toString());

            return responseObject.toString();
        }
        catch(Exception e) {
            log.error("Create failure {}", systemId, e);
        }
        return null;
    }

    @Override
    public String createJiraTicketInOrg(String systemId, String organization, String baseUrl,
                                        String serviceAccount, String serviceAccountSecret,
                                        Ticket ticket, EntandoVersion version, SubscriptionLevel level) {

        String jsonInputString = null;
        try {
            URL url = new URL(baseUrl + "issue");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");

            String auth = serviceAccount + ":" + serviceAccountSecret;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");
            con.setDoOutput(true);

            String signedInUser = getJiraAccountIdOfSignedInUser(baseUrl, serviceAccount, serviceAccountSecret);

            JSONObject root = new JSONObject();
            JSONObject fields = new JSONObject();
            root.put("fields", fields);

            fields.put("project", new JSONObject().put("key", systemId));
            fields.put("summary", ticket.getSummary());
            fields.putOpt("description", ticket.getDescription());
            fields.put("issuetype", new JSONObject().put("name", ticket.getType()));
            fields.put("priority", new JSONObject().put("name", ticket.getPriority()));
            fields.put("versions", new JSONArray().put(new JSONObject().put("name", version.getName())));

            //// Custom fields
            //TODO: CP-53 Add config options for the customfield identifiers
            //Organization
            fields.put("customfield_10002", new int[]{Integer.parseInt(organization)});
            //Subscription Level
            fields.put("customfield_10038", new JSONObject().put("value", level.name()));

            //// User information
            if (signedInUser != null &&  !signedInUser.equals("")) {
                fields.put("reporter", new JSONObject().put("accountId", signedInUser));
            }

            jsonInputString = root.toString();
            if (log.isDebugEnabled()) {
                log.debug("jsonInputString: {}", jsonInputString);
            }

            try(OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = con.getResponseCode();
            if (log.isDebugEnabled()) {
                log.debug("status {}. message {}", status, con.getResponseMessage());
            }
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            JSONObject responseObject = new JSONObject(content.toString());

            return responseObject.toString();
        }
        catch(Exception e) {
            log.error("Ticket creation failed for project id {} and json {}", systemId, jsonInputString, e);
        }
        return null;
    }

    /**
     * Updating a Jira ticket.
     *
     * @param systemId the systemId of the ticket
     * @param baseUrl the baseUrl of the project
     *
     * @return the JSON response
     */
    @Override
    public String updateJiraTicket(String systemId, String baseUrl, String serviceAccount,
                                   String serviceAccountSecret, Ticket ticket) {
        String user = serviceAccount;
        String password = serviceAccountSecret;

        try {
            URL url = new URL(baseUrl + "issue/" + systemId);
            System.out.println(url.toString());
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("PUT");

            String auth = user + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");
            con.setDoOutput(true);
            String jsonInputString = "{\n" +
                "    \"fields\": {\n" +
                "       \"summary\": \"" + ticket.getDescription() + "\",\n" +
                "       \"description\": \"Creating of an issue using project keys and issue type names using the REST API\",\n" +
                "       \"issuetype\": {\n" +
                "          \"name\": \"" + ticket.getType() + "\"\n" +
                "       },\n" +
                "       \"priority\":\n" +
                "       {\n" +
                "          \"name\": \"" + ticket.getPriority() + "\"\n" +
                "       }\n" +
                "   }\n" +
                "}";
            try(OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();

            return String.valueOf(status);
        }
        catch(Exception e) {
            log.error("Update failure {}", systemId, e);
        }
        return null;
    }

    /**
     * Deleting a Jira ticket.
     *
     * @param systemId the systemId of the ticket
     * @param baseUrl the baseUrl of the project
     */
    public String deleteJiraTicket(String systemId, String baseUrl, String serviceAccount, String serviceAccountSecret){
        String user = serviceAccount;
        String password = serviceAccountSecret;

        try {
            URL url = new URL(baseUrl + "issue/" + systemId);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("DELETE");

            String auth = user + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");

            int status = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();

            return String.valueOf(status);
        }
        catch(Exception e) {
            log.error("Delete failure {}", systemId, e);
        }
        return null;
    }

    /**
     * Getting accountId of a user from Jira.
     *
     * @param serviceAccount the serviceAccount of the ticketing system
     * @param serviceAccountSecret the serviceAccountSecret of the ticketing system
     * @param baseUrl the baseUrl of the project
     */
    public String getJiraAccountIdOfSignedInUser(String baseUrl, String serviceAccount, String serviceAccountSecret) {
        String user = serviceAccount;
        String password = serviceAccountSecret;
        String signedInUser;

        if (getCurrentUserEmail().isPresent()) {
            signedInUser = getCurrentUserEmail().get();
        }
        else {
            return null;
        }

        try {
            URL url = new URL(baseUrl + "user/search?query=" + signedInUser);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            String auth = user + ":" + password;
            byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.UTF_8));
            String authHeaderValue = "Basic " + new String(encodedAuth);
            con.setRequestProperty("Authorization", authHeaderValue);
            con.setRequestProperty("Content-Type", "application/json; charset=utf8");

            int status = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            JSONArray responseObject = new JSONArray(content.toString());

            if (responseObject.length() == 0) {
                return null;
            }

            return responseObject.getJSONObject(0).getString("accountId");
        }
        catch(Exception e) {
            log.error("Account lookup failure {}", signedInUser, e);
        }
        return null;
    }

    // get signed in user's email address
    public Optional<String> getCurrentUserEmail() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(securityContext.getAuthentication())
            .map(authentication -> {
                if (authentication.getPrincipal() instanceof UserDetails) {
                    UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
                    return springSecurityUser.getUsername();
                } else if (authentication instanceof JwtAuthenticationToken) {
                    return (String) ((JwtAuthenticationToken) authentication).getToken().getClaims().get("email");
                } else if (authentication.getPrincipal() instanceof DefaultOidcUser) {
                    Map<String, Object> attributes = ((DefaultOidcUser) authentication.getPrincipal()).getAttributes();
                    if (attributes.containsKey("email")) {
                        return (String) attributes.get("email");
                    }
                } else if (authentication.getPrincipal() instanceof String) {
                    return (String) authentication.getPrincipal();
                }
                return null;
            });

    }

    /**
     * Get the default TicketingSystem
     *
     * @return
     */
    public Optional<TicketingSystem> getDefaultTicketingSystem() {
        //Centralize this logic in case it needs to be refined
        return findAll().stream().findFirst();
    }

    /**
     * Retrieve a Jira ticket and use it to populate a new Portal Ticket
     *
     * @return A populated Ticket with the details from Jira
     */
    public Ticket jiraTicketToPortalTicket(TicketingSystem ts, String jiraKey, Project project) {
        JSONObject json = new JSONObject(fetchSingleJiraTicketBySystemId(jiraKey,
            ts.getUrl(), ts.getServiceAccount(), ts.getServiceAccountSecret()));

        Ticket ticket = new Ticket();
        ticket.setSystemId(jiraKey);

        JSONObject fields = json.getJSONObject("fields");
        ticket.setSummary(getField(fields, "summary", null));
        ticket.setDescription(getField(fields, "description", null));
        ticket.setType(getField(fields, "issuetype", "name"));
        ticket.setStatus(getField(fields, "status", "name"));
        ticket.setPriority(getField(fields, "priority", "name"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSX");
        String createdDate = fields.getString("created");
        ticket.setCreateDate(ZonedDateTime.parse(createdDate, formatter));

        String updatedDate = fields.getString("updated");
        ticket.setUpdateDate(ZonedDateTime.parse(updatedDate, formatter));

        ticket.setProject(project);
        return ticket;
    }

    private String getField(JSONObject jsonObject, String key, String childKey) {
        if (jsonObject == null) {
            return null;
        }
        if (!jsonObject.has(key)) {
            return null;
        }
        if (childKey == null) {
            return (!jsonObject.isNull(key)) ? jsonObject.getString(key) : null;
        }
        JSONObject child = jsonObject.getJSONObject(key);
        return getField(child, childKey, null);
    }

}
