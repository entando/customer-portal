package com.entando.customerportal.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;
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
import org.springframework.util.CollectionUtils;

import com.entando.customerportal.constant.CustportAppConstant;
import com.entando.customerportal.domain.EntandoVersion;
import com.entando.customerportal.domain.Project;
import com.entando.customerportal.domain.Ticket;
import com.entando.customerportal.domain.TicketingSystem;
import com.entando.customerportal.domain.TicketingSystemConfig;
import com.entando.customerportal.domain.enumeration.SubscriptionLevel;
import com.entando.customerportal.repository.TicketingSystemConfigRepository;
import com.entando.customerportal.repository.TicketingSystemRepository;
import com.entando.customerportal.request.JiraCustomFieldRequest;
import com.entando.customerportal.security.SpringSecurityAuditorAware;
import com.entando.customerportal.service.JiraTicketingSystemService;
import com.fasterxml.jackson.databind.ObjectMapper;

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

    @Autowired
    private TicketingSystemConfigRepository ticketingSystemConfigRepository;

    private Integer versionsId;
    private Integer organizationsId;
    private Integer subscriptionLevelId;

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

    @Override
    public String createJiraTicketInOrg(String systemId, String organization, String baseUrl,
                                        String serviceAccount, String serviceAccountSecret,
                                        Ticket ticket, EntandoVersion version, SubscriptionLevel level) {

        String jsonInputString = null;
        HttpURLConnection con = null;
        try {
            URL url = new URL(baseUrl + "issue");
            con = (HttpURLConnection) url.openConnection();
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

            // Jira Custom fields: fetch from db
            JiraCustomFieldRequest customFields = getJiraCustomFields();
            if(Objects.nonNull(customFields)) {
            	versionsId = customFields.getVersionId() != null ? customFields.getVersionId().intValue() : null;
                organizationsId =  customFields.getOrganizationId() != null ? customFields.getOrganizationId().intValue() : null;
                subscriptionLevelId = customFields.getSubscriptionLevelId() != null ? customFields.getSubscriptionLevelId().intValue() : null;
            }

            if (versionsId == -1) {
                fields.put("versions", new JSONArray().put(new JSONObject().put("name", version.getName())));
            } else if (versionsId > 0) {
                fields.put("customfield_" + versionsId, new JSONObject().put("value", version.getName()));
            }

            //Organization
            if (organizationsId > 0) {
                fields.put("customfield_" + organizationsId, new int[]{Integer.parseInt(organization)});
            }

            //Subscription Level
            if (subscriptionLevelId > 0) {
                fields.put("customfield_" + subscriptionLevelId, new JSONObject().put("value", level.name()));
            }

            //// User information
            if (signedInUser != null && !signedInUser.equals("")) {
                fields.put("reporter", new JSONObject().put("accountId", signedInUser));
            }

            jsonInputString = root.toString();
            if (log.isDebugEnabled()) {
                log.debug("jsonInputString: {}", jsonInputString);
            }

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = con.getResponseCode();
            if (log.isDebugEnabled()) {
                log.debug("status {}. message {}", status, con.getResponseMessage());
            }
            if (status != HttpURLConnection.HTTP_CREATED) {
                StringWriter writer = new StringWriter();
                IOUtils.copy(con.getErrorStream(), writer, StandardCharsets.UTF_8);
                log.warn("status {}, error {}, details {}", status,
                    con.getResponseMessage(),
                    writer.toString());
            } else {
                StringWriter writer = new StringWriter();
                IOUtils.copy(con.getInputStream(), writer, StandardCharsets.UTF_8);
                JSONObject responseObject = new JSONObject(writer.toString());
                return responseObject.toString();
            }
        } catch (Exception e) {
            log.error("Ticket creation failed for project id {} and json {}", systemId, jsonInputString, e);
        } finally {
            if (con != null) {
                con.disconnect();
            }
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
            log.debug(url.toString());
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
        String signedInUser;
        if (getCurrentUserEmail().isPresent()) {
            signedInUser = getCurrentUserEmail().get();
        }
        else {
            return null;
        }

        String result = null;
        try {
            log.debug("Looking up user accountId by email {}", signedInUser);

            HttpResponse<JsonNode> response = Unirest.get(baseUrl + "user/search")
                .basicAuth(serviceAccount, serviceAccountSecret)
                .header("Accept", "application/json")
                .queryString("query", signedInUser)
                .asJson();

            JSONArray responseObject = response.getBody().getArray();

            if (responseObject.length() == 1) {
                result = responseObject.getJSONObject(0).getString("accountId");
            } else if (responseObject.length() > 1) {
                log.warn("Too many accounts found for user {}", signedInUser);
            } else {
                log.debug("No account found in response");
            }
        }
        catch(Exception e) {
            log.error("Account lookup failure {}", signedInUser, e);
        }
        log.debug("accountId: {}", result);
        return result;
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
     */
    public Optional<TicketingSystem> getDefaultTicketingSystem() {
        //Note: Centralize this logic in case it needs to be refined
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

        //Jira can support longer fields than the simple Spring Data frontend cache so do a simple truncation on some fields
        ticket.setSummary(getField(fields, "summary", null, CustportAppConstant.DEFAULT_STRING_FIELD_LENGTH));
        ticket.setDescription(getField(fields, "description", null, CustportAppConstant.DEFAULT_STRING_FIELD_LENGTH));
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
        return getField(jsonObject, key, childKey, 0);
    }

    private String getField(JSONObject jsonObject, String key, String childKey, int maxLength) {
        if (jsonObject == null) {
            return null;
        }
        if (!jsonObject.has(key)) {
            return null;
        }
        if (childKey == null) {
            if (jsonObject.isNull(key)) {
                return null;
            }
            String result = jsonObject.getString(key);
            if ((maxLength > 0) && (result.length() > maxLength)) {
                result = result.substring(0, maxLength);
            }
            return result;
        }
        JSONObject child = jsonObject.getJSONObject(key);
        return getField(child, childKey, null, maxLength);
    }

    /**
     * Fetch Jira custom fields from DB.
     * @return
     */
    private JiraCustomFieldRequest getJiraCustomFields() {
    	List<TicketingSystemConfig> list = ticketingSystemConfigRepository.findAll();
    	if(!CollectionUtils.isEmpty(list)) {
    		return stringToObject(list.get(0).getJiraCustomField());
    	}
    	return null;
    }

    /**
     * Convert Jira custom field json string into java object.
     * @param jsonString
     * @return
     */
    private JiraCustomFieldRequest stringToObject(String jsonString) {
    	JiraCustomFieldRequest[] customFieldObjs = null;
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			customFieldObjs = objectMapper.readValue(jsonString, JiraCustomFieldRequest[].class);
		} catch (IOException e) {
			log.error("Conversion of json string to object failure {}", jsonString, e);
		}
		if(customFieldObjs != null && customFieldObjs.length > 0) {
			return customFieldObjs[0];
		}
		return null;
	}

}
