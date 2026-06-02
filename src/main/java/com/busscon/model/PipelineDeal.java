package com.busscon.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pipeline_deal")
public class PipelineDeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "startup_idea_id", nullable = false)
    private StartupIdea startupIdea;

    private String stage; // contacted, meeting, termSheet, dueDiligence, closed

    @Column(name = "days_stuck")
    private Integer daysStuck = 0;

    private String notes;

    @Column(name = "founder_name")
    private String founderName;

    // Constructors
    public PipelineDeal() {}

    public PipelineDeal(StartupIdea startupIdea, String stage, Integer daysStuck, String notes, String founderName) {
        this.startupIdea = startupIdea;
        this.stage = stage;
        this.daysStuck = daysStuck;
        this.notes = notes;
        this.founderName = founderName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StartupIdea getStartupIdea() { return startupIdea; }
    public void setStartupIdea(StartupIdea startupIdea) { this.startupIdea = startupIdea; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Integer getDaysStuck() { return daysStuck; }
    public void setDaysStuck(Integer daysStuck) { this.daysStuck = daysStuck; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getFounderName() { return founderName; }
    public void setFounderName(String founderName) { this.founderName = founderName; }
}
