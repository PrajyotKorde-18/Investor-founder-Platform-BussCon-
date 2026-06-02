package com.busscon.controller;

import com.busscon.model.StartupIdea;
import com.busscon.model.Interaction;
import com.busscon.repository.StartupIdeaRepository;
import com.busscon.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ideas")
public class IdeaController {

    @Autowired
    private StartupIdeaRepository ideaRepository;

    @Autowired
    private InteractionRepository interactionRepository;

    // Get all ideas, supporting filtering and searching
    @GetMapping
    public List<StartupIdea> getAllIdeas(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String query) {
        
        if (domain != null && !domain.trim().isEmpty() && !"All".equalsIgnoreCase(domain)) {
            if (query != null && !query.trim().isEmpty()) {
                return ideaRepository.searchIdeasByDomain(query.trim(), domain);
            } else {
                return ideaRepository.findByDomain(domain);
            }
        } else {
            if (query != null && !query.trim().isEmpty()) {
                return ideaRepository.searchIdeas(query.trim());
            } else {
                return ideaRepository.findAll();
            }
        }
    }

    // Get idea details
    @GetMapping("/{id}")
    public ResponseEntity<?> getIdeaById(@PathVariable Long id) {
        Optional<StartupIdea> ideaOpt = ideaRepository.findById(id);
        if (ideaOpt.isPresent()) {
            // Log an automatic view interaction
            StartupIdea idea = ideaOpt.get();
            idea.setViews(idea.getViews() + 1);
            ideaRepository.save(idea);
            
            interactionRepository.save(new Interaction(idea, "Viewed"));
            recalculateInterestScore(idea);
            
            return ResponseEntity.ok(idea);
        }
        return ResponseEntity.notFound().build();
    }

    // Submit idea (with Rule Engine Uniqueness Check)
    @PostMapping
    public ResponseEntity<?> submitIdea(
            @RequestBody Map<String, String> payload,
            @RequestParam(defaultValue = "false") boolean force) {
        
        String title = payload.get("title");
        String domain = payload.get("domain");
        String shortDesc = payload.get("shortDescription");
        String keywords = payload.getOrDefault("keywords", "");

        if (title == null || domain == null || shortDesc == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields."));
        }

        // Simulating the Uniqueness Rule Engine
        // If domain is Fintech and keywords contain 'payment' (case insensitive), trigger similarity warning
        if (!force && "Fintech".equalsIgnoreCase(domain) && keywords.toLowerCase().contains("payment")) {
            Map<String, Object> response = new HashMap<>();
            response.put("similarityWarning", true);
            response.put("message", "We found a very similar published idea in the Fintech sector matching your keywords.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // Create the idea
        StartupIdea idea = new StartupIdea();
        idea.setTitle(title);
        idea.setDomain(domain);
        idea.setShortDescription(shortDesc);
        idea.setFunding("$100k"); // Default placeholder asking funding
        idea.setStage("Idea");
        idea.setLocation("Silicon Valley"); // Default
        idea.setStatus("Published");
        idea.setViews(0);
        idea.setInterestScore(0);
        
        StartupIdea saved = ideaRepository.save(idea);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update financials modeling scenario
    @PutMapping("/{id}/financials")
    public ResponseEntity<?> updateFinancials(
            @PathVariable Long id,
            @RequestBody Map<String, Double> payload) {
        
        Optional<StartupIdea> ideaOpt = ideaRepository.findById(id);
        if (ideaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StartupIdea idea = ideaOpt.get();
        if (payload.containsKey("preMoneyValuation")) {
            idea.setPreMoneyValuation(payload.get("preMoneyValuation"));
        }
        if (payload.containsKey("raiseAmount")) {
            idea.setRaiseAmount(payload.get("raiseAmount"));
        }
        if (payload.containsKey("incentivePoolPercent")) {
            idea.setIncentivePoolPercent(payload.get("incentivePoolPercent"));
        }

        StartupIdea saved = ideaRepository.save(idea);
        return ResponseEntity.ok(saved);
    }

    // Log a dynamic interaction & trigger score recalculation
    @PostMapping("/{id}/interactions")
    public ResponseEntity<?> logInteraction(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        
        Optional<StartupIdea> ideaOpt = ideaRepository.findById(id);
        if (ideaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String actionType = payload.get("actionType");
        if (actionType == null) {
            return ResponseEntity.badRequest().body("ActionType is required.");
        }

        StartupIdea idea = ideaOpt.get();
        Interaction interaction = new Interaction(idea, actionType, LocalDate.now());
        interactionRepository.save(interaction);

        // Update view count if it's a view
        if ("Viewed".equalsIgnoreCase(actionType)) {
            idea.setViews(idea.getViews() + 1);
        }

        // Trigger Rule Engine to recalculate the score
        recalculateInterestScore(idea);

        return ResponseEntity.ok(Map.of("message", "Interaction logged successfully.", "interestScore", idea.getInterestScore()));
    }

    // Business Logic Rule Engine: Calculates & updates the interest score
    private void recalculateInterestScore(StartupIdea idea) {
        List<Interaction> interactions = interactionRepository.findByStartupIdeaId(idea.getId());
        int score = 0;
        for (Interaction inter : interactions) {
            switch (inter.getActionType()) {
                case "Viewed":
                    score += 1;
                    break;
                case "Liked":
                    score += 3;
                    break;
                case "MessageSent":
                    score += 5;
                    break;
                case "MeetingScheduled":
                    score += 10;
                    break;
                default:
                    break;
            }
        }
        idea.setInterestScore(score);
        ideaRepository.save(idea);
    }
}
