package com.busscon.controller.web;

import com.busscon.model.StartupIdea;
import com.busscon.model.Interaction;
import com.busscon.model.PipelineDeal;
import com.busscon.model.AutomationRule;
import com.busscon.repository.StartupIdeaRepository;
import com.busscon.repository.InteractionRepository;
import com.busscon.repository.PipelineDealRepository;
import com.busscon.repository.AutomationRuleRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@Controller
@RequestMapping("/")
public class WebController {

    @Autowired
    private StartupIdeaRepository ideaRepository;

    @Autowired
    private InteractionRepository interactionRepository;

    @Autowired
    private PipelineDealRepository pipelineRepository;

    @Autowired
    private AutomationRuleRepository ruleRepository;

    // Login screen role select dashboard
    @GetMapping
    public String login(HttpSession session) {
        session.invalidate(); // Clear session on logout/login landing
        return "login";
    }

    // Founder Operations Home
    @GetMapping("/founder")
    public String founderHome(HttpSession session, Model model) {
        session.setAttribute("role", "founder");
        
        List<StartupIdea> ideas = ideaRepository.findAll();
        int totalViews = ideas.stream().mapToInt(StartupIdea::getViews).sum();
        long activeDeals = ideas.stream().filter(i -> "Closed".equalsIgnoreCase(i.getStatus()) || i.getInterestScore() > 50).count();

        model.addAttribute("ideas", ideas);
        model.addAttribute("totalViews", totalViews);
        model.addAttribute("activeDeals", activeDeals);
        return "founder-home";
    }

    // Submit Idea page
    @GetMapping("/founder/submit")
    public String submitIdeaPage() {
        return "submit-idea";
    }

    // Founder Startup detail analytics metric panel
    @GetMapping("/founder/idea/{id}")
    public String founderIdeaDetail(@PathVariable Long id, Model model) {
        Optional<StartupIdea> ideaOpt = ideaRepository.findById(id);
        if (ideaOpt.isEmpty()) {
            return "redirect:/founder";
        }

        StartupIdea idea = ideaOpt.get();
        // Log Viewed interaction dynamically
        idea.setViews(idea.getViews() + 1);
        ideaRepository.save(idea);
        interactionRepository.save(new Interaction(idea, "Viewed"));
        recalculateInterestScore(idea);

        // Fetch counts
        Optional<PipelineDeal> dealOpt = pipelineRepository.findByStartupIdeaId(id);
        int interestedInvestors = dealOpt.isPresent() ? 1 : 0;

        int readiness = 75;
        if (idea.getShortDescription() != null && idea.getShortDescription().length() > 50) {
            readiness += 10;
        }
        if (idea.getPreMoneyValuation() > 5000000.0) {
            readiness += 15;
        }
        readiness = Math.min(readiness, 100);

        // Generate Chart datasets
        List<Map<String, Object>> trend = new ArrayList<>();
        int totalViews = idea.getViews();
        int totalInterest = idea.getInterestScore();
        trend.add(Map.of("name", "Week 1", "views", Math.round(totalViews * 0.2), "interest", Math.round(totalInterest * 0.1)));
        trend.add(Map.of("name", "Week 2", "views", Math.round(totalViews * 0.4), "interest", Math.round(totalInterest * 0.3)));
        trend.add(Map.of("name", "Week 3", "views", Math.round(totalViews * 0.7), "interest", Math.round(totalInterest * 0.6)));
        trend.add(Map.of("name", "Week 4", "views", totalViews, "interest", totalInterest));

        model.addAttribute("idea", idea);
        model.addAttribute("views", totalViews);
        model.addAttribute("interestScore", totalInterest);
        model.addAttribute("interestedInvestors", interestedInvestors);
        model.addAttribute("readinessScore", readiness);
        model.addAttribute("trend", trend);

        return "idea-detail";
    }

    // Cap Table Modeling scenario editor
    @GetMapping("/founder/financials")
    public String financialsPage(@RequestParam(required = false) Long ideaId, Model model) {
        List<StartupIdea> ideas = ideaRepository.findAll();
        model.addAttribute("ideas", ideas);

        if (ideas.isEmpty()) {
            return "financials";
        }

        StartupIdea selectedIdea = null;
        if (ideaId != null) {
            selectedIdea = ideas.stream().filter(i -> i.getId().equals(ideaId)).findFirst().orElse(null);
        }
        if (selectedIdea == null) {
            selectedIdea = ideas.get(0);
        }

        model.addAttribute("selectedIdea", selectedIdea);
        return "financials";
    }

    // Investor Operations Dashboard
    @GetMapping("/investor")
    public String investorHome(HttpSession session, Model model) {
        session.setAttribute("role", "investor");

        List<PipelineDeal> deals = pipelineRepository.findAll();
        List<StartupIdea> ideas = ideaRepository.findAll();

        // 1. Funnel data
        Map<String, Integer> stageCounts = new LinkedHashMap<>();
        stageCounts.put("Viewed", ideas.stream().mapToInt(StartupIdea::getViews).sum());
        stageCounts.put("Contacted", 0);
        stageCounts.put("Meeting", 0);
        stageCounts.put("Term Sheet", 0);
        stageCounts.put("Closed Won", 0);

        for (PipelineDeal deal : deals) {
            String stage = deal.getStage();
            if ("contacted".equalsIgnoreCase(stage)) {
                stageCounts.put("Contacted", stageCounts.get("Contacted") + 1);
            } else if ("meeting".equalsIgnoreCase(stage)) {
                stageCounts.put("Meeting", stageCounts.get("Meeting") + 1);
            } else if ("termSheet".equalsIgnoreCase(stage)) {
                stageCounts.put("Term Sheet", stageCounts.get("Term Sheet") + 1);
            } else if ("closed".equalsIgnoreCase(stage)) {
                stageCounts.put("Closed Won", stageCounts.get("Closed Won") + 1);
            }
        }

        List<Map<String, Object>> funnel = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : stageCounts.entrySet()) {
            funnel.add(Map.of("name", entry.getKey(), "value", entry.getValue()));
        }

        // 2. Heatmap
        Map<String, Integer> domainCounts = new HashMap<>();
        for (StartupIdea idea : ideas) {
            String domain = idea.getDomain();
            domainCounts.put(domain, domainCounts.getOrDefault(domain, 0) + 1);
        }
        List<Map<String, Object>> heatmap = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : domainCounts.entrySet()) {
            heatmap.add(Map.of("name", entry.getKey(), "value", entry.getValue() * 100));
        }

        model.addAttribute("funnel", funnel);
        model.addAttribute("heatmap", heatmap);
        model.addAttribute("contactedCount", stageCounts.get("Contacted"));
        model.addAttribute("responseRate", "40%");
        model.addAttribute("dealsInSetup", stageCounts.get("Term Sheet"));
        model.addAttribute("avgDealSize", "$1.2M");

        return "investor-home";
    }

    // Deal Flow Discover list
    @GetMapping("/investor/browse")
    public String browseDeals(
            @RequestParam(required = false, defaultValue = "All") String domain,
            @RequestParam(required = false) String query,
            Model model) {
        
        List<StartupIdea> ideas;
        if (domain != null && !"All".equalsIgnoreCase(domain)) {
            if (query != null && !query.trim().isEmpty()) {
                ideas = ideaRepository.searchIdeasByDomain(query.trim(), domain);
            } else {
                ideas = ideaRepository.findByDomain(domain);
            }
        } else {
            if (query != null && !query.trim().isEmpty()) {
                ideas = ideaRepository.searchIdeas(query.trim());
            } else {
                ideas = ideaRepository.findAll();
            }
        }

        model.addAttribute("ideas", ideas);
        model.addAttribute("domain", domain);
        model.addAttribute("query", query != null ? query : "");
        return "browse";
    }

    // Investor startup interaction log detail profile page
    @GetMapping("/investor/idea/{id}")
    public String investorIdeaDetail(@PathVariable Long id, Model model) {
        Optional<StartupIdea> ideaOpt = ideaRepository.findById(id);
        if (ideaOpt.isEmpty()) {
            return "redirect:/investor/browse";
        }

        StartupIdea idea = ideaOpt.get();
        // Log automatic Viewed interaction
        idea.setViews(idea.getViews() + 1);
        ideaRepository.save(idea);
        interactionRepository.save(new Interaction(idea, "Viewed"));
        recalculateInterestScore(idea);

        model.addAttribute("idea", idea);
        return "investor-idea-detail";
    }

    // CRM Kanban pipeline board
    @GetMapping("/investor/pipeline")
    public String pipelineBoard(Model model) {
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
                board.computeIfAbsent(stage, k -> new ArrayList<>()).add(deal);
            }
        }

        model.addAttribute("board", board);
        return "pipeline";
    }

    // Automation rule config center
    @GetMapping("/investor/automation")
    public String automationCenter(Model model) {
        List<AutomationRule> rules = ruleRepository.findAll();
        model.addAttribute("rules", rules);
        return "automation";
    }

    // Legal support module view (context shared)
    @GetMapping("/legal")
    public String legalSupport(HttpSession session, Model model) {
        String role = (String) session.getAttribute("role");
        if (role == null) {
            role = "investor"; // Default fallback context
        }
        model.addAttribute("role", role);
        return "legal";
    }

    // Utility dynamic scoring calculator helper
    private void recalculateInterestScore(StartupIdea idea) {
        List<Interaction> interactions = interactionRepository.findByStartupIdeaId(idea.getId());
        int score = 0;
        for (Interaction inter : interactions) {
            switch (inter.getActionType()) {
                case "Viewed": score += 1; break;
                case "Liked": score += 3; break;
                case "MessageSent": score += 5; break;
                case "MeetingScheduled": score += 10; break;
                default: break;
            }
        }
        idea.setInterestScore(score);
        ideaRepository.save(idea);
    }
}
