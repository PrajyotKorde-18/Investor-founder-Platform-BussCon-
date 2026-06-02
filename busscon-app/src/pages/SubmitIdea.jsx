import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckSquare } from 'lucide-react';
import { submitIdea } from '../utils/api';

export default function SubmitIdea() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', domain: 'Fintech', shortDescription: '', keywords: '' });
  const [similarityWarning, setSimilarityWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await submitIdea(formData, false);
      if (res.similarityWarning) {
        setSimilarityWarning(true);
        setWarningMessage(res.message);
      } else {
        alert('Idea submitted successfully and passed uniqueness checks.');
        navigate('/founder');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForceSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitIdea(formData, true);
      alert('Acknowledged risk and forced submission successfully.');
      navigate('/founder');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger-color)' }}>Similarity Rule Violation (Backend Rule Engine)</h4>
            <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>
              {warningMessage || "We found a very similar published idea in the database sector matching your keywords."}
              <br />To protect investor pipelines, please refine your idea's unique value proposition before submitting.
            </p>
            <button onClick={() => setSimilarityWarning(false)} className="btn btn-secondary" style={{ marginTop: '1rem' }}>I will revise it</button>
            <button onClick={handleForceSubmit} className="btn" style={{ marginTop: '1rem', marginLeft: '1rem', background: 'var(--danger-color)' }} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Acknowledge Risk & Force Submit'}
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}

      <form onSubmit={handleSubmit} className="card">
        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Idea Title</label>
          <input 
            type="text" 
            required 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            placeholder="e.g. NextGen Payments" 
          />
        </div>

        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Domain</label>
          <select value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})}>
            <option value="Fintech">Fintech</option>
            <option value="Healthcare">Healthcare</option>
            <option value="SaaS">Enterprise SaaS</option>
            <option value="Consumer">Consumer App</option>
            <option value="AgriTech">AgriTech</option>
            <option value="Logistics">Logistics</option>
          </select>
        </div>

        <div>
           <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Keywords (comma separated)</label>
           <input 
             type="text" 
             required 
             value={formData.keywords}
             onChange={(e) => setFormData({...formData, keywords: e.target.value})} 
             placeholder="e.g. ai, payments, b2b" 
           />
           <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '-1rem', marginBottom: '1.5rem' }}>*Used by the analytics engine to compute uniqueness score</small>
        </div>

        <div>
          <label style={{ color: 'var(--text-secondary)', display: 'block' }}>Short Pitch (Visible to investors)</label>
          <textarea 
            required 
            rows={4} 
            value={formData.shortDescription}
            onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} 
            placeholder="Describe the problem and solution..."
          ></textarea>
        </div>

        <button type="submit" className="btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={submitting}>
          <CheckSquare size={18} /> {submitting ? 'Processing Check...' : 'Run Uniqueness Check & Submit'}
        </button>
      </form>
    </div>
  );
}
