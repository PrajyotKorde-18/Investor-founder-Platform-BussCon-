package com.busscon.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "interaction")
public class Interaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "startup_idea_id", nullable = false)
    private StartupIdea startupIdea;

    @Column(name = "action_type", nullable = false)
    private String actionType; // Viewed, Liked, MessageSent, MeetingScheduled

    @Column(name = "interaction_date", nullable = false)
    private LocalDate interactionDate = LocalDate.now();

    // Constructors
    public Interaction() {}

    public Interaction(StartupIdea startupIdea, String actionType) {
        this.startupIdea = startupIdea;
        this.actionType = actionType;
        this.interactionDate = LocalDate.now();
    }

    public Interaction(StartupIdea startupIdea, String actionType, LocalDate interactionDate) {
        this.startupIdea = startupIdea;
        this.actionType = actionType;
        this.interactionDate = interactionDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StartupIdea getStartupIdea() { return startupIdea; }
    public void setStartupIdea(StartupIdea startupIdea) { this.startupIdea = startupIdea; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public LocalDate getInteractionDate() { return interactionDate; }
    public void setInteractionDate(LocalDate interactionDate) { this.interactionDate = interactionDate; }
}
