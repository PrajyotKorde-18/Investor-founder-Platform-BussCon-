import React, { useState, useEffect } from 'react';
import { fetchPipelineBoard, updateDealStage } from '../utils/api';
import { ChevronLeft, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STAGES = ['contacted', 'meeting', 'termSheet', 'dueDiligence', 'closed'];
const STAGE_LABELS = {
  contacted: 'Contacted',
  meeting: 'Meeting Scheduled',
  termSheet: 'Term Sheet',
  dueDiligence: 'Due Diligence',
  closed: 'Closed Won'
};

export default function InvestorPipeline() {
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState({
    contacted: [],
    meeting: [],
    termSheet: [],
    dueDiligence: [],
    closed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPipeline() {
    try {
      setLoading(true);
      const data = await fetchPipelineBoard();
      
      // Ensure all stages are present in the response
      const sanitized = {
        contacted: data.contacted || [],
        meeting: data.meeting || [],
        termSheet: data.termSheet || [],
        dueDiligence: data.dueDiligence || [],
        closed: data.closed || []
      };
      setPipeline(sanitized);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPipeline();
  }, []);

  const handleMoveStage = async (dealId, currentStage, direction) => {
    const currentIndex = STAGES.indexOf(currentStage);
    let newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= STAGES.length) return;

    const newStage = STAGES[newIndex];
    try {
      await updateDealStage(dealId, newStage);
      
      // Local optimistic state update for instantaneous feedback
      const movedDeal = pipeline[currentStage].find(d => d.id === dealId);
      if (movedDeal) {
        movedDeal.stage = newStage;
        setPipeline({
          ...pipeline,
          [currentStage]: pipeline[currentStage].filter(d => d.id !== dealId),
          [newStage]: [...(pipeline[newStage] || []), movedDeal]
        });
      }
    } catch (err) {
      alert('Failed to update stage: ' + err.message);
      loadPipeline(); // Reload board state on failure
    }
  };

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Investor Operations - Pipeline</h1>
          <p>Manage your deal flow funnels dynamically like a CRM</p>
        </div>
        <button 
          onClick={loadPipeline} 
          className="btn btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} /> Refresh CRM
        </button>
      </header>

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Syncing CRM pipeline with database...</p>}
      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="kanban-board">
          {STAGES.map(stage => {
            const deals = pipeline[stage] || [];
            return (
              <div key={stage} className="kanban-column">
                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {STAGE_LABELS[stage]} 
                  <span className="badge">{deals.length}</span>
                </h3>
                
                {deals.map(deal => (
                  <div 
                    key={deal.id} 
                    className="kanban-card" 
                    style={{ 
                      borderColor: stage === 'meeting' ? 'var(--accent-color)' : 
                                   stage === 'termSheet' ? 'var(--warning-color)' : 
                                   stage === 'closed' ? 'var(--success-color)' : 'var(--border-color)',
                      background: stage === 'closed' ? 'rgba(35, 134, 54, 0.1)' : 'var(--panel-bg)'
                    }}
                  >
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{deal.startupIdea?.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Founder: {deal.founderName || 'Jane Doe'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: deal.daysStuck > 7 ? 'var(--danger-color)' : 'var(--text-secondary)', margin: '0.5rem 0' }}>
                      Stuck for {deal.daysStuck || 0} days
                    </p>

                    {deal.startupIdea?.funding && (
                      <div className="deal-amount" style={{ fontWeight: 'bold', color: 'var(--success-color)', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                        {deal.startupIdea.funding} Asking
                      </div>
                    )}

                    {stage === 'termSheet' && (
                      <button 
                        onClick={() => navigate('/legal')} 
                        className="btn" 
                        style={{ width: '100%', marginTop: '0.5rem', padding: '0.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      >
                        <FileText size={12} /> Generate Legal Docs
                      </button>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                      <button 
                        onClick={() => handleMoveStage(deal.id, stage, -1)}
                        disabled={stage === 'contacted'}
                        className="btn-secondary"
                        style={{ padding: '2px 8px', borderRadius: '4px', cursor: stage === 'contacted' ? 'not-allowed' : 'pointer', opacity: stage === 'contacted' ? 0.3 : 1 }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        onClick={() => handleMoveStage(deal.id, stage, 1)}
                        disabled={stage === 'closed'}
                        className="btn-secondary"
                        style={{ padding: '2px 8px', borderRadius: '4px', cursor: stage === 'closed' ? 'not-allowed' : 'pointer', opacity: stage === 'closed' ? 0.3 : 1 }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {deals.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
                    No deals
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
