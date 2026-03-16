import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateInterestScore, calculateFundingReadiness } from '../utils/analytics';
import { TrendingUp, Users, CheckCircle, Eye } from 'lucide-react';

// Mock data acting similarly to a database pulled record of InteractionLog
const mockInteractions = [
  { action_type: 'Viewed', date: '2026-03-01' },
  { action_type: 'Viewed', date: '2026-03-02' },
  { action_type: 'Liked', date: '2026-03-03' },
  { action_type: 'MessageSent', date: '2026-03-05' },
  { action_type: 'MeetingScheduled', date: '2026-03-10' },
];

const mockChartData = [
  { name: 'Week 1', views: 4, interest: 10 },
  { name: 'Week 2', views: 8, interest: 25 },
  { name: 'Week 3', views: 15, interest: 45 },
  { name: 'Week 4', views: 22, interest: 80 },
];

export default function FounderDashboard() {
  const [interestScore, setInterestScore] = useState(0);
  const [readinessScore, setReadinessScore] = useState(0);

  useEffect(() => {
    // Uses the "Rule Engine" utility to calculate the score
    const score = calculateInterestScore(mockInteractions);
    setInterestScore(score);

    // Business rule: Checking how ready the startup is for funding
    const checklist = {
      pitchDeck: true,
      financials: true,
      traction: false,
      team: true
    };
    setReadinessScore(calculateFundingReadiness(checklist));
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="metric-card">
          <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={16} /> Total Views
          </div>
          <div className="metric-value">22</div>
        </div>
        <div className="metric-card" style={{ borderColor: 'var(--accent-color)' }}>
          <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
            <TrendingUp size={16} /> Interest Score
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-color)' }}>{interestScore}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} /> Interested Investors
          </div>
          <div className="metric-value">3</div>
        </div>
        <div className="metric-card">
          <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> Readiness Score
          </div>
          <div className="metric-value">{readinessScore}%</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">Interest & Engagement Trend</div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" stroke="#8b949e" />
              <YAxis stroke="#8b949e" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                itemStyle={{ color: '#58a6ff' }}
              />
              <Line type="monotone" dataKey="interest" name="Interest Score" stroke="#58a6ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="views" name="Views" stroke="#8b949e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
