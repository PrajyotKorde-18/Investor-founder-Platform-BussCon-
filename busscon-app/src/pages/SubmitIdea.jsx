import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckSquare } from 'lucide-react';

export default function SubmitIdea() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', domain: 'Fintech', shortDescription: '', keywords: '' });
  const [similarityWarning, setSimilarityWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Idea Uniqueness Rule Engine Simulation
    // If the keywords contain 'payments' and domain is Fintech, trigger uniqueness warning
    if (formData.domain === 'Fintech' && formData.keywords.toLowerCase().includes('payment')) {
      setSimilarityWarning(true);
      return;
    }
    
    // Otherwise, simulate successful submission
    alert('Idea submitted successfully and passed uniqueness checks.');
    navigate('/founder');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header">
        <h1>Submit Startup Idea</h1>
        <p>Your idea will be checked against our uniqueness database.</p>
      </header>

      {similarityWarning && (
        <div style={{ background: 'rgba(218, 54, 51, 0.15)', border: '1px solid var(--danger-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <ShieldAlert color="var(--danger-color)" />
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger-color)' }}>Similarity Rule Violation</h4>
            <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>
              We found a very similar published idea in the <strong>{formData.domain}</strong> sector matching your keywords. 
              To protect investor pipelines, please refine your idea's unique value proposition before submitting.
            </p>
            <button onClick={() => setSimilarityWarning(false)} className="btn btn-secondary" style={{ marginTop: '1rem' }}>I will revise it</button>
            <button onClick={() => { alert('Submitted with risk flag'); navigate('/founder'); }} className="btn" style={{ marginTop: '1rem', marginLeft: '1rem', background: 'var(--danger-color)' }}>Acknowledge Risk & Force Submit</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Idea Title</label>
          <input type="text" required onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. NextGen Payments" />
        </div>

        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Domain</label>
          <select value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})}>
            <option value="Fintech">Fintech</option>
            <option value="Healthcare">Healthcare</option>
            <option value="SaaS">Enterprise SaaS</option>
            <option value="Consumer">Consumer App</option>
          </select>
        </div>

        <div>
           <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Keywords (comma separated)</label>
           <input type="text" required onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="e.g. ai, payments, b2b" />
           <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '-1rem', marginBottom: '1.5rem' }}>*Used by the analytics engine to compute uniqueness score</small>
        </div>

        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Short Pitch (Visible to investors)</label>
          <textarea required rows={4} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} placeholder="Describe the problem and solution..."></textarea>
        </div>

        <button type="submit" className="btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <CheckSquare size={18} /> Run Uniqueness Check & Submit
        </button>
      </form>
    </div>
  );
}
