import React from 'react';
import { DownloadCloud, Info } from 'lucide-react';

export default function LegalSupport() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header">
        <h1>Legal Support Module</h1>
        <p>Pre-approved templates for closing deals securely</p>
      </header>

      <div style={{ background: 'rgba(88, 166, 255, 0.1)', border: '1px solid var(--accent-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <Info color="var(--accent-color)" />
        <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>
          These automated templates are linked to the <strong>Term Sheet</strong> deal pipeline stage. 
          When an investor moves a deal to Term Sheet, they are automatically prompted to use these standard forms, saving operational friction.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>1. Mutual Non-Disclosure Agreement (NDA)</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Standard IP protection for discussing Idea details.</p>
        </div>
        <button className="btn btn-secondary"><DownloadCloud size={16} /></button>
      </div>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>2. Simple Term Sheet Outline</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Base template covering valuation, equity, and cap tables.</p>
        </div>
        <button className="btn btn-secondary"><DownloadCloud size={16} /></button>
      </div>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>3. Basic Shareholder Agreement</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Standardized board rights and clauses for Closed Won phase.</p>
        </div>
        <button className="btn btn-secondary"><DownloadCloud size={16} /></button>
      </div>
    </div>
  );
}
