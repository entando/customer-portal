package com.mycompany.myapp.service.impl;

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
public class TicketingSystemServiceImpl implements TicketingSystemService {

    private final Logger log = LoggerFactory.getLogger(TicketingSystemServiceImpl.class);

    private final TicketingSystemRepository ticketingSystemRepository;

    public TicketingSystemServiceImpl(TicketingSystemRepository ticketingSystemRepository) {
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
     * Get all the tickets corresponding to the projectCode.
     *
     * @param projectCode the project code of the Jira project.
     * @return the list of Tickets.
     */
    @Override
    public JSONObject fetchTicketsByProject(String projectCode) {
        System.out.println("Fetching tickets...");
        String user = "jorden.gerovac@veriday.com";
        String password = "auNcZgYD3Ai0QsIuBLih864B";
        /*
        1)
        String encoding = Base64Encoder.encode(user + ":" + password);
        HttpPost httpPost = new HttpPost("https://jorden-test-partner-portal.atlassian.net/rest/api/2/search?jql=project="
         + projectCode);
        httpPost.setHeader(HttpHeaders.AUTHORIZATION, "Basic " + encoding);

        System.out.println("executing request " + httpPost.getRequestLine());
        HttpResponse response = httpClient.execute(httpPost);
        HttpEntity entity = response.getEntity();



        2)
        */
        try {
            URL url = new URL("https://jorden-test-partner-portal.atlassian.net/rest/api/2/search?jql=project="
             + projectCode);
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

            System.out.println(content.toString());
            return responseObject;
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
