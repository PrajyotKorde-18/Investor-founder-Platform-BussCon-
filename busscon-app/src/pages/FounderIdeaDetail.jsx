import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FounderDashboard from '../components/FounderDashboard';
import { ArrowLeft } from 'lucide-react';
import { fetchIdeaById } from '../utils/api';

export default function FounderIdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIdea() {
      try {
        setLoading(true);
        const data = await fetchIdeaById(id);
        setIdea(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadIdea();
  }, [id]);

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ marginBottom: 0 }}>Startup Analytics: {idea ? idea.title : `Idea #${id}`}</h1>
          <p style={{ marginTop: '0.25rem' }}>Detailed engagement metrics and investor funnel</p>
        </div>
      </header>

      <FounderDashboard ideaId={Number(id)} />
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Interested Investors Pipeline</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Investor Name</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Firm</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Connection Stage</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', color: '#fff' }}>Sarah Jenkins</td>
              <td style={{ padding: '1rem' }}>Sequoia Capital</td>
              <td style={{ padding: '1rem' }}><span className="badge badge-warning">Meeting Requested</span></td>
              <td style={{ padding: '1rem' }}>
                <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => alert('Opening Sequoia Video Room... (Mocked)')}>Start Video Call</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
