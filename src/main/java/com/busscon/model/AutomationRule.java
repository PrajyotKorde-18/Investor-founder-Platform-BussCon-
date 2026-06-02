package com.busscon.model;

import jakarta.persistence.*;

@Entity
@Table(name = "automation_rule")
public class AutomationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "if_field")
    private String ifField; // Domain, Valuation, Stage, etc.

    private String condition; // Equals, Less Than, Greater Than

    @Column(name = "rule_value")
    private String value;

    @Column(name = "then_action")
    private String thenAction; // Tag as High Priority, Add to Pipeline (Contacted), etc.

    private Boolean active = true;

    // Constructors
    public AutomationRule() {}

    public AutomationRule(String ifField, String condition, String value, String thenAction, Boolean active) {
        this.ifField = ifField;
        this.condition = condition;
        this.value = value;
        this.thenAction = thenAction;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIfField() { return ifField; }
    public void setIfField(String ifField) { this.ifField = ifField; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getThenAction() { return thenAction; }
    public void setThenAction(String thenAction) { this.thenAction = thenAction; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
