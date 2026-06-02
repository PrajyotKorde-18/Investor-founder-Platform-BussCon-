import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Plus, Play, Settings } from 'lucide-react';
import { fetchAutomationRules, toggleAutomationRule, runAutomationEngine, createAutomationRule } from '../utils/api';

export default function InvestorAutomation() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engineLogs, setEngineLogs] = useState([]);
  const [running, setRunning] = useState(false);

  // New rule form states
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState({ ifField: 'Domain', condition: 'Equals', value: '', thenAction: 'Tag as High Priority' });

  async function loadRules() {
    try {
      setLoading(true);
      const data = await fetchAutomationRules();
      setRules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  const handleToggle = async (id) => {
    try {
      const updated = await toggleAutomationRule(id);
      setRules(rules.map(r => r.id === id ? { ...r, active: updated.active } : r));
    } catch (err) {
      alert('Failed to toggle rule: ' + err.message);
    }
  };

  const handleRunEngine = async () => {
    setRunning(true);
    try {
      const results = await runAutomationEngine();
      setEngineLogs(results.logs || []);
      alert(`Success! Spring Boot Rule Engine completed.\n- Rules Triggered: ${results.rulesTriggered}\nCheck the execution logs console below.`);
    } catch (err) {
      alert('Rule engine execution error: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!newRule.value) return;

    try {
      const created = await createAutomationRule({
        ...newRule,
        active: true
      });
      setRules([...rules, created]);
      setShowForm(false);
      setNewRule({ ifField: 'Domain', condition: 'Equals', value: '', thenAction: 'Tag as High Priority' });
    } catch (err) {
      alert('Failed to create rule: ' + err.message);
    }
  };

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Process Automation & Rule Builder</h1>
          <p>Define logic to automatically execute deal flow operations</p>
        </div>
        <button 
          onClick={handleRunEngine} 
          className="btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: running ? 'var(--text-secondary)' : 'var(--accent-color)' }}
          disabled={running}
        >
          <Play size={16} /> {running ? 'Running Engine...' : 'Run Rule Engine Now'}
        </button>
      </header>

      <div style={{ background: 'rgba(35, 134, 54, 0.1)', border: '1px solid var(--success-color)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <Settings color="var(--success-color)" />
        <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>
          <strong>Continuous Process Improvement:</strong> Use this rule builder to automate the manual operation of filtering and tagging startups. 
          When a startup matches your rule criteria, the action triggers automatically, mirroring enterprise operations software.
        </p>
      </div>

      {showForm && (
        <form onSubmit={handleCreateRule} className="card" style={{ marginBottom: '2rem', border: '1px solid var(--accent-color)' }}>
          <h3 style={{ marginTop: 0 }}>Create New Automation Rule</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)' }}>IF Field</label>
              <select value={newRule.ifField} onChange={(e) => setNewRule({...newRule, ifField: e.target.value})}>
                <option value="Domain">Domain</option>
                <option value="Valuation">Valuation</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)' }}>Condition</label>
              <select value={newRule.condition} onChange={(e) => setNewRule({...newRule, condition: e.target.value})}>
                <option value="Equals">Equals</option>
                <option value="Less Than">Less Than</option>
                <option value="Greater Than">Greater Than</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)' }}>Value</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Fintech or 2000000" 
                value={newRule.value} 
                onChange={(e) => setNewRule({...newRule, value: e.target.value})} 
                style={{ marginBottom: 0 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)' }}>THEN Action</label>
              <select value={newRule.thenAction} onChange={(e) => setNewRule({...newRule, thenAction: e.target.value})}>
                <option value="Tag as High Priority">Tag as High Priority (+50 score)</option>
                <option value="Add to Pipeline (Contacted)">Add to Pipeline (Contacted stage)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn">Save Rule</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Syncing automation rules...</p>}
      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}

      {!loading && !error && (
        <div className="card">
          <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Automated Pipeline Rules
            <button onClick={() => setShowForm(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
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
                  onClick={() => handleToggle(rule.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: rule.active ? 'var(--success-color)' : 'var(--text-secondary)' }}
                >
                  {rule.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {engineLogs.length > 0 && (
        <div className="card" style={{ marginTop: '2rem', background: '#0d1117', border: '1px solid #30363d' }}>
          <h3 style={{ marginTop: 0, color: 'var(--accent-color)', fontFamily: 'monospace' }}>Rule Engine Console Output</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {engineLogs.map((log, index) => (
              <div key={index} style={{ color: log.includes('triggered') ? '#58a6ff' : '#2ea043', marginBottom: '0.25rem' }}>
                &gt; {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
