package com.busscon.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.busscon.model.PipelineDeal;
import com.busscon.model.StartupIdea;
import com.busscon.repository.PipelineDealRepository;
import com.busscon.repository.StartupIdeaRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PipelineController.class)
public class PipelineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PipelineDealRepository pipelineRepository;

    @MockBean
    private StartupIdeaRepository ideaRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetPipelineBoard() throws Exception {
        StartupIdea idea1 = new StartupIdea("HealthAI", "MRI analysis", "Healthcare", "Seed", "Boston", "$500k");
        StartupIdea idea2 = new StartupIdea("FinSmart", "Blockchain payments", "Fintech", "Series A", "London", "$2M");

        PipelineDeal deal1 = new PipelineDeal(idea1, "contacted", 2, "Intro sent", "Dr. Jane Smith");
        PipelineDeal deal2 = new PipelineDeal(idea2, "meeting", 5, "Pitch scheduled", "Alex Chen");

        Mockito.when(pipelineRepository.findAll()).thenReturn(Arrays.asList(deal1, deal2));

        mockMvc.perform(get("/api/pipeline"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contacted", hasSize(1)))
                .andExpect(jsonPath("$.meeting", hasSize(1)))
                .andExpect(jsonPath("$.contacted[0].founderName", is("Dr. Jane Smith")))
                .andExpect(jsonPath("$.meeting[0].notes", is("Pitch scheduled")));
    }

    @Test
    public void testUpdateDealStage() throws Exception {
        StartupIdea idea = new StartupIdea("SustainAgri", "IoT sensors", "AgriTech", "Idea", "Austin", "$100k");
        PipelineDeal deal = new PipelineDeal(idea, "contacted", 2, "Intro sent", "Sam Wilson");
        deal.setId(10L);

        Mockito.when(pipelineRepository.findById(10L)).thenReturn(Optional.of(deal));
        Mockito.when(pipelineRepository.save(any(PipelineDeal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(put("/api/pipeline/10/stage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("stage", "meeting"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stage", is("meeting")));
        
        // Verify stage was updated in the object
        Mockito.verify(pipelineRepository, Mockito.times(1)).save(any(PipelineDeal.class));
    }

    @Test
    public void testUpdateDealStageNotFound() throws Exception {
        Mockito.when(pipelineRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/pipeline/99/stage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("stage", "meeting"))))
                .andExpect(status().isNotFound());
    }
}
