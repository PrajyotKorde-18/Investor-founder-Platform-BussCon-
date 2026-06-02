import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, DollarSign, PieChart as PieChartIcon, Save } from 'lucide-react';
import { fetchIdeas, updateFinancials } from '../utils/api';

const COLORS = ['#58a6ff', '#2ea043', '#d29922', '#f85149'];

export default function FounderFinancials() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState('');
  const [valuation, setValuation] = useState(5000000);
  const [raiseAmount, setRaiseAmount] = useState(1000000);
  const [incentivePoolPercent, setIncentivePoolPercent] = useState(15);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch ideas list on load
  useEffect(() => {
    async function loadIdeas() {
      try {
        setLoading(true);
        const data = await fetchIdeas();
        setIdeas(data);
        if (data.length > 0) {
          setSelectedIdeaId(data[0].id.toString());
          setValuation(data[0].preMoneyValuation || 5000000);
          setRaiseAmount(data[0].raiseAmount || 1000000);
          setIncentivePoolPercent(data[0].incentivePoolPercent || 15);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, []);

  // Sync inputs when selected idea changes
  const handleIdeaChange = (e) => {
    const id = e.target.value;
    setSelectedIdeaId(id);
    const idea = ideas.find(i => i.id.toString() === id);
    if (idea) {
      setValuation(idea.preMoneyValuation || 5000000);
      setRaiseAmount(idea.raiseAmount || 1000000);
      setIncentivePoolPercent(idea.incentivePoolPercent || 15);
    }
  };

  // Financial Modeling Calculations
  const postMoneyValuation = valuation + raiseAmount;
  const investorEquityPercent = postMoneyValuation > 0 ? (raiseAmount / postMoneyValuation) * 100 : 0;
  const founderEquityPercent = Math.max(0, 100 - investorEquityPercent - incentivePoolPercent);

  const capTableData = [
    { name: 'Founder Shares', value: founderEquityPercent },
    { name: 'Investor Shares', value: investorEquityPercent },
    { name: 'Incentive Comp Pool', value: incentivePoolPercent },
  ];

  // Modeling the future value of the incentive pool (comp modeling)
  const incentivePoolValue = (postMoneyValuation * (incentivePoolPercent / 100));

  // Save changes back to Spring Boot database
  const handleSaveScenario = async () => {
    if (!selectedIdeaId) return;
    setSaving(true);
    try {
      await updateFinancials(Number(selectedIdeaId), {
        preMoneyValuation: valuation,
        raiseAmount,
        incentivePoolPercent
      });
      // Update local ideas list state
      setIdeas(ideas.map(i => i.id.toString() === selectedIdeaId ? {
        ...i,
        preMoneyValuation: valuation,
        raiseAmount,
        incentivePoolPercent
      } : i));
      alert('Financial scenario saved successfully to Spring Boot database!');
    } catch (err) {
      alert('Error saving scenario: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Financial & Incentive Modelling</h1>
          <p>Model your cap table and employee incentive compensation pool</p>
        </div>
        
        {!loading && ideas.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ margin: 0, color: 'var(--text-secondary)' }}>Select Idea:</label>
            <select value={selectedIdeaId} onChange={handleIdeaChange} style={{ width: '220px', marginBottom: 0 }}>
              {ideas.map(idea => (
                <option key={idea.id} value={idea.id}>{idea.title}</option>
              ))}
            </select>
            <button 
              onClick={handleSaveScenario} 
              className="btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Scenario'}
            </button>
          </div>
        )}
      </header>

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading financial profiles...</p>}
      {!loading && ideas.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Please submit a startup idea first to model financials.</p>}

      {!loading && ideas.length > 0 && (
        <>
          <div className="dashboard-grid">
            <div className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                <Calculator size={18} color="var(--accent-color)" /> Scenario Inputs
              </h3>
              
              <label style={{ display: 'block', color: 'var(--text-secondary)', marginTop: '1rem' }}>Pre-Money Valuation ($)</label>
              <input 
                type="number" 
                value={valuation} 
                onChange={(e) => setValuation(Number(e.target.value))}
                style={{ marginBottom: '1rem' }}
              />

              <label style={{ display: 'block', color: 'var(--text-secondary)' }}>Target Raise Amount ($)</label>
              <input 
                type="number" 
                value={raiseAmount} 
                onChange={(e) => setRaiseAmount(Number(e.target.value))}
                style={{ marginBottom: '1rem' }}
              />

              <label style={{ display: 'block', color: 'var(--text-secondary)' }}>Employee Incentive Comp Pool (%)</label>
              <input 
                type="number" 
                value={incentivePoolPercent} 
                onChange={(e) => setIncentivePoolPercent(Number(e.target.value))}
                style={{ marginBottom: '1rem' }}
              />
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, marginBottom: '2rem' }}>
                <DollarSign size={18} color="var(--success-color)" /> Financial Model Outputs
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Post-Money Valuation</span>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>${postMoneyValuation.toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Investor Equity</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{investorEquityPercent.toFixed(2)}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', background: 'rgba(210, 153, 34, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--warning-color)' }}>
                <span style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>Total Incentive Comp Value</span>
                <span style={{ fontWeight: 'bold', color: 'var(--warning-color)' }}>${incentivePoolValue.toLocaleString()}</span>
              </div>
              <small style={{ color: 'var(--text-secondary)' }}>* This pool is used to model performance stock options for early hires, mirroring sales incentive plan design.</small>
            </div>
          </div>

          <div className="chart-container">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, color: '#fff' }}>
              <PieChartIcon size={18} /> Cap Table Distribution
            </h3>
            <div style={{ height: 300, display: 'flex' }}>
              <ResponsiveContainer width="50%">
                <PieChart>
                  <Pie data={capTableData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {capTableData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }} />
                </PieChart>
              </ResponsiveContainer>
              
              <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                {capTableData.map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '4px', backgroundColor: COLORS[index] }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{entry.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{entry.value.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
