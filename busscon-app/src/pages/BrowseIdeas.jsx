import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';

const mockIdeas = [
  { id: 1, title: 'HealthAI Scanner', shortDesc: 'AI-powered MRI scan analysis for early detection', domain: 'Healthcare', stage: 'Seed', location: 'Boston', funding: '$500k', interestScore: 85 },
  { id: 2, title: 'FinSmart Payments', shortDesc: 'Cross-border B2B payments on blockchain', domain: 'Fintech', stage: 'Series A', location: 'London', funding: '$2M', interestScore: 210 },
  { id: 3, title: 'Sustain Agri', shortDesc: 'IoT sensors for precision farming', domain: 'AgriTech', stage: 'Idea', location: 'Austin', funding: '$100k', interestScore: 12 },
];

export default function BrowseIdeas() {
  const navigate = useNavigate();
  const [filterDomain, setFilterDomain] = useState('All');

  const filteredIdeas = filterDomain === 'All' ? mockIdeas : mockIdeas.filter(i => i.domain === filterDomain);

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Deal Flow Discovery</h1>
          <p>Browse curated startups that match your investment profile</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', top: '14px', left: '10px', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search keywords..." style={{ paddingLeft: '2rem', width: '250px', marginBottom: 0 }} />
          </div>
          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} style={{ width: '150px', marginBottom: 0 }}>
            <option value="All">All Domains</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Fintech">Fintech</option>
            <option value="AgriTech">AgriTech</option>
          </select>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredIdeas.map(idea => (
          <div key={idea.id} className="card" style={{ display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>{idea.title}</h3>
              <span className="badge badge-success">{idea.interestScore} AI Match Score</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1 }}>{idea.shortDesc}</p>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <span className="badge">{idea.domain}</span>
              <span className="badge">{idea.stage}</span>
              <span className="badge">{idea.location}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Asking</span>
                <span style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>{idea.funding}</span>
              </div>
              <button 
                onClick={() => navigate(`/investor/idea/${idea.id}`)} 
                className="btn" 
                style={{ fontSize: '0.85rem' }}
              >
                Deep Dive Int. Log
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
