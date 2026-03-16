import React, { useState } from 'react';
import { ToggleLeft, Plus, Play, Settings } from 'lucide-react';

export default function InvestorAutomation() {
  const [rules, setRules] = useState([
    { id: 1, ifField: 'Domain', condition: 'Equals', value: 'Fintech', thenAction: 'Tag as High Priority', active: true },
    { id: 2, ifField: 'Valuation', condition: 'Less Than', value: '$2M', thenAction: 'Add to Pipeline (Contacted)', active: false },
  ]);

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>Process Automation & Rule Builder</h1>
          <p>Define logic to automatically execute deal flow operations</p>
        </div>
        <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Play size={16} /> Run Rule Engine Now
        </button>
      </header>

      <div style={{ background: 'rgba(35, 134, 54, 0.1)', border: '1px solid var(--success-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <Settings color="var(--success-color)" />
        <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>
          <strong>Continuous Process Improvement:</strong> Use this rule builder to automate the manual operation of filtering and tagging startups. 
          When a startup matches your rule criteria, the action triggers automatically, mirroring enterprise operations software.
        </p>
      </div>

      <div className="card">
        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          Automated Pipeline Rules
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> New Rule
          </button>
        </h3>

        {rules.map(rule => (
          <div key={rule.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-color)', background: rule.active ? 'transparent' : 'rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, opacity: rule.active ? 1 : 0.5 }}>
              <div style={{ background: 'var(--panel-bg)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>IF</span> {rule.ifField}
              </div>
              
              <div style={{ color: 'var(--text-secondary)' }}>{rule.condition}</div>
              
              <div style={{ background: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--accent-color)', color: '#fff' }}>
                "{rule.value}"
              </div>
              
              <div style={{ color: 'var(--success-color)', fontWeight: 'bold', margin: '0 1rem' }}>THEN</div>
              
              <div style={{ background: 'var(--panel-bg)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                {rule.thenAction}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: rule.active ? 'var(--success-color)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {rule.active ? 'ACTIVE' : 'PAUSED'}
              </span>
              <button 
                onClick={() => toggleRule(rule.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: rule.active ? 'var(--success-color)' : 'var(--text-secondary)' }}
              >
                <ToggleLeft size={32} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
