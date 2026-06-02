import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle, Eye } from 'lucide-react';
import { fetchFounderAnalytics } from '../utils/api';

export default function FounderDashboard({ ideaId }) {
  const [metrics, setMetrics] = useState({
    views: 0,
    interestScore: 0,
    interestedInvestors: 0,
    readinessScore: 0,
    trend: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const targetId = ideaId || 1; // Default to idea #1 if not specified

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await fetchFounderAnalytics(targetId);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [targetId]);

  return (
    <div className="dashboard">
      {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading analytics trend metrics...</p>}
      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-grid">
            <div className="metric-card">
              <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={16} /> Total Views
              </div>
              <div className="metric-value">{metrics.views}</div>
            </div>
            <div className="metric-card" style={{ borderColor: 'var(--accent-color)' }}>
              <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
                <TrendingUp size={16} /> Interest Score
              </div>
              <div className="metric-value" style={{ color: 'var(--accent-color)' }}>{metrics.interestScore}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} /> Interested Investors
              </div>
              <div className="metric-value">{metrics.interestedInvestors}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} /> Readiness Score
              </div>
              <div className="metric-value">{metrics.readinessScore}%</div>
            </div>
          </div>

          <div className="chart-container" style={{ marginTop: '2rem' }}>
            <div className="chart-header" style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#fff' }}>Interest & Engagement Trend</div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={metrics.trend}>
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
        </>
      )}
    </div>
  );
}
