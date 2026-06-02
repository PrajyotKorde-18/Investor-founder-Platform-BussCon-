-- Seed data for Startup Ideas
INSERT INTO startup_idea (id, title, short_description, domain, stage, location, funding, interest_score, status, views, pre_money_valuation, raise_amount, incentive_pool_percent) VALUES
(1, 'HealthAI Scanner', 'AI-powered MRI scan analysis for early detection', 'Healthcare', 'Seed', 'Boston', '$500k', 85, 'Published', 42, 5000000.0, 5000000.0, 15.0),
(2, 'FinSmart Payments', 'Cross-border B2B payments on blockchain', 'Fintech', 'Series A', 'London', '$2M', 210, 'Published', 120, 8000000.0, 2000000.0, 10.0),
(3, 'Sustain Agri', 'IoT sensors for precision farming', 'AgriTech', 'Idea', 'Austin', '$100k', 12, 'Published', 15, 3000000.0, 500000.0, 20.0),
(4, 'Drone Delivery Logistics', 'Last-mile automated drone courier services', 'Logistics', 'Seed', 'San Francisco', '$1.5M', 95, 'Published', 80, 6000000.0, 1500000.0, 12.0),
(5, 'AutoPilot Analytics', 'No-code analytics for SaaS operations dashboard', 'SaaS', 'Series A', 'New York', '$2M', 180, 'Closed', 160, 10000000.0, 2000000.0, 15.0);

-- Seed data for Interactions (Used for dynamically computing interest score)
INSERT INTO interaction (id, startup_idea_id, action_type, interaction_date) VALUES
(1, 1, 'Viewed', '2026-03-01'),
(2, 1, 'Viewed', '2026-03-02'),
(3, 1, 'Liked', '2026-03-03'),
(4, 1, 'MessageSent', '2026-03-05'),
(5, 1, 'MeetingScheduled', '2026-03-10'),
-- More views for Fintech to populate charts
(6, 2, 'Viewed', '2026-03-01'),
(7, 2, 'Liked', '2026-03-02'),
(8, 2, 'MessageSent', '2026-03-04'),
(9, 2, 'MeetingScheduled', '2026-03-08'),
(10, 2, 'MeetingScheduled', '2026-03-12');

-- Seed data for Pipeline Deals (Kanban board)
INSERT INTO pipeline_deal (id, startup_idea_id, stage, days_stuck, notes, founder_name) VALUES
(1, 1, 'contacted', 2, 'Initial intro email sent.', 'Dr. Jane Smith'),
(2, 2, 'meeting', 5, 'Pitch meeting scheduled for Friday.', 'Alex Chen'),
(3, 4, 'termSheet', 14, 'Awaiting signature on Term Sheet outline.', 'Sam Wilson'),
(4, 5, 'closed', 45, 'Deal successfully closed and funded!', 'Maria Garcia');

-- Seed data for Automation Rules
INSERT INTO automation_rule (id, if_field, condition, rule_value, then_action, active) VALUES
(1, 'Domain', 'Equals', 'Fintech', 'Tag as High Priority', true),
(2, 'Valuation', 'Less Than', '2000000', 'Add to Pipeline (Contacted)', false);

-- Restart database auto-increment sequences to sync with seeded IDs
ALTER TABLE startup_idea ALTER COLUMN id RESTART WITH 6;
ALTER TABLE interaction ALTER COLUMN id RESTART WITH 11;
ALTER TABLE pipeline_deal ALTER COLUMN id RESTART WITH 5;
ALTER TABLE automation_rule ALTER COLUMN id RESTART WITH 3;

