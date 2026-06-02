package com.busscon.controller;

import com.busscon.model.PipelineDeal;
import com.busscon.model.StartupIdea;
import com.busscon.repository.PipelineDealRepository;
import com.busscon.repository.StartupIdeaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/pipeline")
public class PipelineController {

    @Autowired
    private PipelineDealRepository pipelineRepository;

    @Autowired
    private StartupIdeaRepository ideaRepository;

    // Get kanban pipeline board (grouped by stage)
    @GetMapping
    public Map<String, List<PipelineDeal>> getPipelineBoard() {
        List<PipelineDeal> allDeals = pipelineRepository.findAll();
        
        Map<String, List<PipelineDeal>> board = new LinkedHashMap<>();
        board.put("contacted", new ArrayList<>());
        board.put("meeting", new ArrayList<>());
        board.put("termSheet", new ArrayList<>());
        board.put("dueDiligence", new ArrayList<>());
        board.put("closed", new ArrayList<>());

        for (PipelineDeal deal : allDeals) {
            String stage = deal.getStage();
            if (board.containsKey(stage)) {
                board.get(stage).add(deal);
            } else {
                // If stage isn't predefined, default it to contacted or list it
                board.computeIfAbsent(stage, k -> new ArrayList<>()).add(deal);
            }
        }

        return board;
    }

    // Add a deal to the pipeline (e.g., when bookmarking/saving an idea)
    @PostMapping
    public ResponseEntity<?> addDealToPipeline(@RequestBody Map<String, Object> payload) {
        Long ideaId = Long.valueOf(payload.get("ideaId").toString());
        String stage = payload.getOrDefault("stage", "contacted").toString();
        String founderName = payload.getOrDefault("founderName", "Unknown Founder").toString();

        Optional<StartupIdea> ideaOpt = ideaRepository.findById(ideaId);
        if (ideaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Check if deal already exists
        Optional<PipelineDeal> existingDealOpt = pipelineRepository.findByStartupIdeaId(ideaId);
        if (existingDealOpt.isPresent()) {
            PipelineDeal existingDeal = existingDealOpt.get();
            existingDeal.setStage(stage);
            return ResponseEntity.ok(pipelineRepository.save(existingDeal));
        }

        StartupIdea idea = ideaOpt.get();
        PipelineDeal deal = new PipelineDeal(idea, stage, 0, "Saved from Discover page", founderName);
        PipelineDeal saved = pipelineRepository.save(deal);
        
        return ResponseEntity.ok(saved);
    }

    // Move a deal's stage (Kanban Drag and Drop API)
    @PutMapping("/{id}/stage")
    public ResponseEntity<?> updateDealStage(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        
        Optional<PipelineDeal> dealOpt = pipelineRepository.findById(id);
        if (dealOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String newStage = payload.get("stage");
        if (newStage == null) {
            return ResponseEntity.badRequest().body("Stage is required.");
        }

        PipelineDeal deal = dealOpt.get();
        deal.setStage(newStage);
        
        // If moved to closed, update status of underlying startup idea
        if ("closed".equalsIgnoreCase(newStage)) {
            StartupIdea idea = deal.getStartupIdea();
            idea.setStatus("Closed");
            ideaRepository.save(idea);
        }

        PipelineDeal saved = pipelineRepository.save(deal);
        return ResponseEntity.ok(saved);
    }
}
