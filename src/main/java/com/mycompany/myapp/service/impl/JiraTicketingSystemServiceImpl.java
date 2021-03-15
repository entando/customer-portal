package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.service.JiraTicketingSystemService;
import com.mycompany.myapp.service.TicketingSystemService;
import com.mycompany.myapp.domain.TicketingSystem;
import com.mycompany.myapp.domain.Ticket;
import com.mycompany.myapp.repository.TicketingSystemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

/**
 * Service Implementation for managing {@link TicketingSystem}.
 */
@Service
@Transactional
public class JiraTicketingSystemServiceImpl implements JiraTicketingSystemService {

    private final Logger log = LoggerFactory.getLogger(TicketingSystemServiceImpl.class);

    private final TicketingSystemRepository ticketingSystemRepository;

    //private final String jiraUrl;

    //private final String baseUrl;

    public JiraTicketingSystemServiceImpl(TicketingSystemRepository ticketingSystemRepository) {
        this.ticketingSystemRepository = ticketingSystemRepository;
        //this.jiraUrl = "https://jorden-test-partner-portal.atlassian.net/rest/api/2/search?jql=project=";
        //this.baseUrl = "https://jorden-test-partner-portal.atlassian.net/rest/api/latest/";
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
            e.printStackTrace();
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
            e.printStackTrace();
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
            e.printStackTrace();
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
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String createJiraTicketInOrg(String systemId, String organization, String baseUrl, String serviceAccount, String serviceAccountSecret, Ticket ticket) {
        String user = serviceAccount;
        String password = serviceAccountSecret;
        List<Integer> orgList = new ArrayList<Integer>();
        orgList.add(Integer.parseInt(organization));
        System.out.println(orgList);

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
            String jsonInputString = "{\n" +
                "    \"fields\": {\n" +
                "       \"project\":\n" +
                "       {\n" +
                "          \"key\": \"" + systemId + "\"\n" +
                "       },\n" +
                "       \"summary\": \"" + ticket.getDescription() + "\",\n" +
                "       \"description\": \"Creating of an issue using project keys and issue type names using the REST API\",\n" +
                "       \"customfield_10002\": " + orgList + ",\n" +
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
            e.printStackTrace();
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
            //JSONObject responseObject = new JSONObject(content.toString());

            return String.valueOf(status);
        }
        catch(Exception e) {
            e.printStackTrace();
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
            e.printStackTrace();
        }
        return null;
    }

}
