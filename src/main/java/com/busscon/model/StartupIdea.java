package com.busscon.model;

import jakarta.persistence.*;

@Entity
@Table(name = "startup_idea")
public class StartupIdea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "short_description", length = 1000)
    private String shortDescription;

    private String domain;
    private String stage;
    private String location;
    private String funding;

    @Column(name = "interest_score")
    private Integer interestScore = 0;

    private String status = "Published"; // Published, Closed
    private Integer views = 0;

    @Column(name = "pre_money_valuation")
    private Double preMoneyValuation = 5000000.0;

    @Column(name = "raise_amount")
    private Double raiseAmount = 1000000.0;

    @Column(name = "incentive_pool_percent")
    private Double incentivePoolPercent = 15.0;

    // Constructors
    public StartupIdea() {}

    public StartupIdea(String title, String shortDescription, String domain, String stage, String location, String funding) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.domain = domain;
        this.stage = stage;
        this.location = location;
        this.funding = funding;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getFunding() { return funding; }
    public void setFunding(String funding) { this.funding = funding; }

    public Integer getInterestScore() { return interestScore; }
    public void setInterestScore(Integer interestScore) { this.interestScore = interestScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }

    public Double getPreMoneyValuation() { return preMoneyValuation; }
    public void setPreMoneyValuation(Double preMoneyValuation) { this.preMoneyValuation = preMoneyValuation; }

    public Double getRaiseAmount() { return raiseAmount; }
    public void setRaiseAmount(Double raiseAmount) { this.raiseAmount = raiseAmount; }

    public Double getIncentivePoolPercent() { return incentivePoolPercent; }
    public void setIncentivePoolPercent(Double incentivePoolPercent) { this.incentivePoolPercent = incentivePoolPercent; }
}
