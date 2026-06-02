package com.busscon.controller;

import com.busscon.model.AutomationRule;
import com.busscon.model.PipelineDeal;
import com.busscon.model.StartupIdea;
import com.busscon.repository.AutomationRuleRepository;
import com.busscon.repository.PipelineDealRepository;
import com.busscon.repository.StartupIdeaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/automation")
public class AutomationController {

    @Autowired
    private AutomationRuleRepository ruleRepository;

    @Autowired
    private StartupIdeaRepository ideaRepository;

    @Autowired
    private PipelineDealRepository pipelineRepository;

    // Get all rules
    @GetMapping("/rules")
    public List<AutomationRule> getAllRules() {
        return ruleRepository.findAll();
    }

    // Toggle rule status (Active/Paused)
    @PutMapping("/rules/{id}/toggle")
    public ResponseEntity<?> toggleRule(@PathVariable Long id) {
        Optional<AutomationRule> ruleOpt = ruleRepository.findById(id);
        if (ruleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AutomationRule rule = ruleOpt.get();
        rule.setActive(!rule.getActive());
        AutomationRule saved = ruleRepository.save(rule);
        return ResponseEntity.ok(saved);
    }

    // Create a new rule
    @PostMapping("/rules")
    public ResponseEntity<?> createRule(@RequestBody AutomationRule rule) {
        if (rule.getIfField() == null || rule.getCondition() == null || rule.getValue() == null || rule.getThenAction() == null) {
            return ResponseEntity.badRequest().body("Missing required rule parameters.");
        }
        AutomationRule saved = ruleRepository.save(rule);
        return ResponseEntity.ok(saved);
    }

    // Execute the Rule Engine
    @PostMapping("/run")
    public ResponseEntity<?> runRuleEngine() {
        List<AutomationRule> activeRules = ruleRepository.findByActive(true);
        List<StartupIdea> ideas = ideaRepository.findAll();
        
        int rulesTriggered = 0;
        List<String> logs = new ArrayList<>();

        for (AutomationRule rule : activeRules) {
            for (StartupIdea idea : ideas) {
                boolean match = false;
                
                // Match IF condition
                if ("Domain".equalsIgnoreCase(rule.getIfField())) {
                    if ("Equals".equalsIgnoreCase(rule.getCondition())) {
                        match = idea.getDomain().equalsIgnoreCase(rule.getValue());
                    }
                } else if ("Valuation".equalsIgnoreCase(rule.getIfField())) {
                    // Try to parse values
                    try {
                        double ideaVal = idea.getPreMoneyValuation();
                        double ruleVal = Double.parseDouble(rule.getValue().replace("$", "").replace("M", "000000").replace("k", "1000"));
                        if ("Less Than".equalsIgnoreCase(rule.getCondition())) {
                            match = ideaVal < ruleVal;
                        } else if ("Greater Than".equalsIgnoreCase(rule.getCondition())) {
                            match = ideaVal > ruleVal;
                        }
                    } catch (NumberFormatException e) {
                        // ignore parsing error
                    }
                }

                // If condition matches, execute action
                if (match) {
                    rulesTriggered++;
                    logs.add("Rule #" + rule.getId() + " triggered on startup '" + idea.getTitle() + "'. Action: " + rule.getThenAction());

                    // Execute THEN Action
                    if (rule.getThenAction().contains("Pipeline")) {
                        // Auto add to contacted pipeline stage
                        Optional<PipelineDeal> existingOpt = pipelineRepository.findByStartupIdeaId(idea.getId());
                        if (existingOpt.isEmpty()) {
                            PipelineDeal deal = new PipelineDeal(idea, "contacted", 0, "Auto-added by Rule #" + rule.getId(), "System Automated");
                            pipelineRepository.save(deal);
                            logs.add(" -> Added '" + idea.getTitle() + "' to Contacted stage in pipeline CRM.");
                        }
                    } else if (rule.getThenAction().contains("Priority")) {
                        // Dynamically boost interest score!
                        idea.setInterestScore(idea.getInterestScore() + 50);
                        ideaRepository.save(idea);
                        logs.add(" -> Boosted Interest Score of '" + idea.getTitle() + "' by +50.");
                    }
                }
            }
        }

        Map<String, Object> results = new HashMap<>();
        results.put("success", true);
        results.put("rulesTriggered", rulesTriggered);
        results.put("logs", logs);
        results.put("message", "Rule engine execution completed. " + rulesTriggered + " rules triggered.");

        return ResponseEntity.ok(results);
    }
}
