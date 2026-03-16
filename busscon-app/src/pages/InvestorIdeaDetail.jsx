import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, BookmarkPlus, MessageSquare } from 'lucide-react';

export default function InvestorIdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ marginBottom: 0 }}>Startup Profile #{id}</h1>
            <p style={{ marginTop: '0.25rem' }}>Full pitch and operations details</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookmarkPlus size={16} /> Save to Pipeline
          </button>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert('Connection requested! Logging ActionType: MessageSent')}>
            <MessageSquare size={16} /> Request Connection
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ color: '#fff' }}>Detailed Description</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Our startup is addressing a multi-billion dollar opportunity. The founder has created a solution that scales effectively and bypasses traditional operational bottlenecks. 
            <br /><br />
            <strong>Traction:</strong> 12 enterprise pilots running.<br />
            <strong>Revenue:</strong> $10k MRR <br />
            <strong>Runway:</strong> 6 Months
          </p>

          <h3 style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem', color: '#fff' }}>Connected Actions</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: '#2ea043', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => alert('Opening Video meeting API mock')}>
              <Video size={16} /> Start Video Call Pitch
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: '#fff', marginTop: 0 }}>Founder Bio</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <strong>Jane Doe</strong><br />
            Ex-Google Engineer with 10 years experience building scalable enterprise architecture.
          </p>
          
          <h3 style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', color: '#fff' }}>Funding Requirements</h3>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            <li><strong>Stage:</strong> Series A</li>
            <li><strong>Amount:</strong> $2M</li>
            <li><strong>Equity offered:</strong> 15%</li>
            <li><strong>Timeline:</strong> Closing Q3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
