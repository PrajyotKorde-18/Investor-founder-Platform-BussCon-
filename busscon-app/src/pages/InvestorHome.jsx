import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Activity, Target, Layers } from 'lucide-react';

const funnelData = [
  { name: 'Viewed', value: 45 },
  { name: 'Contacted', value: 20 },
  { name: 'Meeting', value: 8 },
  { name: 'Term Sheet', value: 3 },
  { name: 'Closed Won', value: 1 },
];

const domainData = [
  { name: 'Fintech', value: 400 },
  { name: 'HealthTech', value: 300 },
  { name: 'SaaS', value: 300 },
  { name: 'Consumer', value: 200 },
];
const COLORS = ['#58a6ff', '#2ea043', '#f85149', '#d29922'];

export default function InvestorHome() {
  return (
    <div>
      <header className="page-header">
        <h1>Investor Operations Dashboard</h1>
        <p>Your Forma.ai style portfolio and pipeline overview</p>
      </header>

      <div className="dashboard-grid">
        <div className="metric-card">
          <div className="metric-title"><Briefcase size={16} /> Startups Contacted</div>
          <div className="metric-value">20</div>
        </div>
        <div className="metric-card">
          <div className="metric-title"><Activity size={16} /> Response Rate</div>
          <div className="metric-value" style={{color: 'var(--success-color)'}}>40%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title"><Layers size={16} /> Deals in Setup</div>
          <div className="metric-value">3</div>
        </div>
        <div className="metric-card" style={{borderColor: 'var(--accent-color)'}}>
          <div className="metric-title" style={{color: 'var(--accent-color)'}}><Target size={16} /> Avg Deal Size</div>
          <div className="metric-value" style={{color: 'var(--accent-color)'}}>$1.2M</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="chart-container" style={{ flex: '1 1 500px' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-secondary)' }}>Funding Stage Distribution</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--border-color)' }}
                  itemStyle={{ color: 'var(--accent-color)' }}
                />
                <Bar dataKey="value" fill="var(--accent-color)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container" style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-secondary)' }}>Portfolio Domain Heatmap</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={domainData} innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--border-color)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            {domainData.map((entry, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[index] }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
