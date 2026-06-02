import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchIdeas } from '../utils/api';

export default function BrowseIdeas() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [filterDomain, setFilterDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadIdeas() {
      try {
        setLoading(true);
        const data = await fetchIdeas(filterDomain, searchQuery);
        setIdeas(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Debounce search slightly to avoid excessive calls
    const handler = setTimeout(() => {
      loadIdeas();
    }, 200);

    return () => clearTimeout(handler);
  }, [filterDomain, searchQuery]);

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
            <input 
              type="text" 
              placeholder="Search keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2rem', width: '250px', marginBottom: 0 }} 
            />
          </div>
          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} style={{ width: '150px', marginBottom: 0 }}>
            <option value="All">All Domains</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Fintech">Fintech</option>
            <option value="AgriTech">AgriTech</option>
            <option value="Logistics">Logistics</option>
            <option value="SaaS">SaaS</option>
          </select>
        </div>
      </header>

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Retrieving live deals from Spring Boot backend...</p>}
      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {ideas.map(idea => (
            <div key={idea.id} className="card" style={{ display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#fff' }}>{idea.title}</h3>
                <span className="badge badge-success">{idea.interestScore} AI Match Score</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1 }}>{idea.shortDescription}</p>
              
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
          {ideas.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>No startups matched your search query.</p>
          )}
        </div>
      )}
    </div>
  );
}
