import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Flame, FileText } from 'lucide-react';
import { fetchIdeas } from '../utils/api';

export default function FounderHome() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadIdeas() {
      try {
        setLoading(true);
        const data = await fetchIdeas();
        setIdeas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, []);

  const totalViews = ideas.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const activeDeals = ideas.filter(i => i.status === 'Closed' || i.interestScore > 50).length;

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Founder Operations Home</h1>
          <p>Monitor your startup portfolio performance</p>
        </div>
        <button onClick={() => navigate('/founder/submit')} className="btn">Submit Startup Idea</button>
      </header>

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading portfolio from Spring Boot backend...</p>}
      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-grid">
            <div className="metric-card">
              <div className="metric-title"><FileText size={16} /> Total Ideas</div>
              <div className="metric-value">{ideas.length}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title"><Eye size={16} /> Total Investor Views</div>
              <div className="metric-value">{totalViews}</div>
            </div>
            <div className="metric-card" style={{ borderColor: 'var(--accent-color)' }}>
              <div className="metric-title" style={{ color: 'var(--accent-color)' }}><Flame size={16} /> Active Deals</div>
              <div className="metric-value" style={{ color: 'var(--accent-color)' }}>{activeDeals}</div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>My Startup Ideas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Domain</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Views</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Interest Score</th>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea) => (
                  <tr key={idea.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>{idea.title}</td>
                    <td style={{ padding: '1rem' }}>{idea.domain}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${idea.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>
                        {idea.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{idea.views}</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{idea.interestScore}</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => navigate(`/founder/idea/${idea.id}`)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        View Analytics
                      </button>
                    </td>
                  </tr>
                ))}
                {ideas.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      You haven't submitted any startup ideas yet. Click the button above to submit your first idea!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
