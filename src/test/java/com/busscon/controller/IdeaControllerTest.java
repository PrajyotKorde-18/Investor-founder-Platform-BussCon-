package com.busscon.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.busscon.model.StartupIdea;
import com.busscon.repository.StartupIdeaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class IdeaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StartupIdeaRepository ideaRepository;

    @Autowired
    private com.busscon.repository.InteractionRepository interactionRepository;

    @Autowired
    private com.busscon.repository.PipelineDealRepository pipelineRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        interactionRepository.deleteAll();
        pipelineRepository.deleteAll();
        ideaRepository.deleteAll();
    }

    @Test
    public void testGetAllIdeasEmpty() throws Exception {
        mockMvc.perform(get("/api/ideas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void testSubmitIdeaSuccess() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("title", "InnovateAgri");
        payload.put("domain", "AgriTech");
        payload.put("shortDescription", "Precision farming automation platform.");
        payload.put("keywords", "agri, automation, farming");

        mockMvc.perform(post("/api/ideas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("InnovateAgri")))
                .andExpect(jsonPath("$.domain", is("AgriTech")))
                .andExpect(jsonPath("$.stage", is("Idea")));
    }

    @Test
    public void testSubmitIdeaSimilarityCheckViolation() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("title", "EasyPay B2B");
        payload.put("domain", "Fintech");
        payload.put("shortDescription", "Cross-border payment clearing house.");
        payload.put("keywords", "b2b, payment, transaction");

        // Should return 409 Conflict with similarityWarning: true
        mockMvc.perform(post("/api/ideas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.similarityWarning", is(true)))
                .andExpect(jsonPath("$.message", containsString("similar published idea")));
    }

    @Test
    public void testSubmitIdeaSimilarityCheckBypassedByForce() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("title", "EasyPay B2B");
        payload.put("domain", "Fintech");
        payload.put("shortDescription", "Cross-border payment clearing house.");
        payload.put("keywords", "b2b, payment, transaction");

        // Using force=true should successfully bypass similarity warnings and return 201 Created
        mockMvc.perform(post("/api/ideas")
                        .param("force", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("EasyPay B2B")));
    }

    @Test
    public void testLogInteractionAndRecalculateScore() throws Exception {
        // First create an idea
        StartupIdea idea = new StartupIdea("RoboHealth", "Surgical robot arm analytics", "Healthcare", "Seed", "Boston", "$2M");
        StartupIdea savedIdea = ideaRepository.save(idea);

        // Perform interactions: Liked (+3 pts) and MeetingScheduled (+10 pts)
        mockMvc.perform(post("/api/ideas/" + savedIdea.getId() + "/interactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("actionType", "Liked"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.interestScore", is(3)));

        mockMvc.perform(post("/api/ideas/" + savedIdea.getId() + "/interactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("actionType", "MeetingScheduled"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.interestScore", is(13)));
    }
}
