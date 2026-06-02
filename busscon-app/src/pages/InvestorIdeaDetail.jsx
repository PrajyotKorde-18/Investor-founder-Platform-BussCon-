import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, BookmarkPlus, MessageSquare } from 'lucide-react';
import { fetchIdeaById, logInteraction, addDealToPipeline } from '../utils/api';

export default function InvestorIdeaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingPipeline, setSavingPipeline] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      try {
        setLoading(true);
        // Automatically increments views and logs Viewed interaction in the backend!
        const data = await fetchIdeaById(id);
        setIdea(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadIdea();
  }, [id]);

  const handleSavePipeline = async () => {
    if (!idea) return;
    setSavingPipeline(true);
    try {
      await addDealToPipeline(idea.id, 'contacted', 'Jane Doe');
      alert(`Successfully saved '${idea.title}' to your CRM Deal Pipeline Board!`);
    } catch (err) {
      alert('Failed to save to pipeline: ' + err.message);
    } finally {
      setSavingPipeline(false);
    }
  };

  const handleConnectionRequest = async () => {
    if (!idea) return;
    try {
      const res = await logInteraction(idea.id, 'MessageSent');
      setIdea({ ...idea, interestScore: res.interestScore });
      alert("Connection request sent! Logged interaction: 'MessageSent' (Boosted Interest Score!)");
    } catch (err) {
      alert('Failed to send connection request: ' + err.message);
    }
  };

  const handleMeetingScheduled = async () => {
    if (!idea) return;
    try {
      const res = await logInteraction(idea.id, 'MeetingScheduled');
      setIdea({ ...idea, interestScore: res.interestScore });
      alert("Opening Video Pitch Room! Logged interaction: 'MeetingScheduled' (+10 Interest Score Boost!)");
    } catch (err) {
      alert('Failed to log meeting: ' + err.message);
    }
  };

  return (
    <div>
      {loading && <p style={{ color: 'var(--text-secondary)' }}>Retrieving live startup profile...</p>}
      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}

      {!loading && !error && idea && (
        <>
          <header className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 style={{ marginBottom: 0 }}>Startup Profile: {idea.title}</h1>
                <p style={{ marginTop: '0.25rem' }}>Full pitch and operations details (Interest Score: {idea.interestScore})</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleSavePipeline} 
                className="btn btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                disabled={savingPipeline}
              >
                <BookmarkPlus size={16} /> {savingPipeline ? 'Saving...' : 'Save to Pipeline'}
              </button>
              <button 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                onClick={handleConnectionRequest}
              >
                <MessageSquare size={16} /> Request Connection
              </button>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div className="card">
              <h2 style={{ color: '#fff' }}>Detailed Description</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {idea.shortDescription}
                <br /><br />
                This startup has passed all preliminary similarity checks. It has a high-quality product value proposition and operations analytics show strong momentum in the sector.
                <br /><br />
                <strong>Traction:</strong> 12 enterprise pilots running.<br />
                <strong>Revenue:</strong> $10k MRR <br />
                <strong>Runway:</strong> 6 Months
              </p>

              <h3 style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem', color: '#fff' }}>Connected Actions</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn" 
                  style={{ background: '#2ea043', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                  onClick={handleMeetingScheduled}
                >
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
                <li><strong>Domain:</strong> {idea.domain}</li>
                <li><strong>Stage:</strong> {idea.stage}</li>
                <li><strong>Amount:</strong> {idea.funding}</li>
                <li><strong>Valuation:</strong> ${idea.preMoneyValuation?.toLocaleString()}</li>
                <li><strong>Equity offered:</strong> {idea.incentivePoolPercent}%</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
