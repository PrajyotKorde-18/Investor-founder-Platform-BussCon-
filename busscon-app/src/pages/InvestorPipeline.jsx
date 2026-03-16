import React from 'react';

const pipeline = {
  contacted: [
    { id: 101, title: 'HealthAI Scanner', founder: 'Dr. Jane Smith', days: 2 }
  ],
  meeting: [
    { id: 102, title: 'FinSmart Payments', founder: 'Alex Chen', days: 5 }
  ],
  termSheet: [
    { id: 103, title: 'Drone Delivery Logistics', founder: 'Sam Wilson', days: 14, amount: '$1.5M' }
  ],
  dueDiligence: [],
  closed: [
    { id: 104, title: 'AutoPilot Analytics', founder: 'Maria Garcia', days: 45, amount: '$2M' }
  ]
};

export default function InvestorPipeline() {
  return (
    <div>
      <header className="page-header">
        <h1>Investor Operations - Pipeline</h1>
        <p>Manage your deal flow funnels dynamically like a CRM</p>
      </header>

      <div className="kanban-board">
        {/* Contacted Column */}
        <div className="kanban-column">
          <h3>Contacted <span className="badge">{pipeline.contacted.length}</span></h3>
          {pipeline.contacted.map(deal => (
            <div key={deal.id} className="kanban-card">
              <h4>{deal.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Founder: {deal.founder}</p>
              <p style={{ fontSize: '0.75rem', color: '#da3633', margin: '0.5rem 0 0 0' }}>Stuck for {deal.days} days</p>
            </div>
          ))}
        </div>

        {/* Meeting Column */}
        <div className="kanban-column">
          <h3>Meeting Scheduled <span className="badge">{pipeline.meeting.length}</span></h3>
          {pipeline.meeting.map(deal => (
            <div key={deal.id} className="kanban-card" style={{ borderColor: 'var(--accent-color)' }}>
              <h4>{deal.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Founder: {deal.founder}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span className="badge badge-warning">Awaiting Pitch Deck</span>
              </div>
            </div>
          ))}
        </div>

        {/* Term Sheet Column */}
        <div className="kanban-column">
          <h3>Term Sheet <span className="badge">{pipeline.termSheet.length}</span></h3>
          {pipeline.termSheet.map(deal => (
            <div key={deal.id} className="kanban-card" style={{ borderColor: 'var(--warning-color)' }}>
              <h4>{deal.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Founder: {deal.founder}</p>
              <div className="deal-amount">{deal.amount}</div>
              <button className="btn" style={{ width: '100%', marginTop: '0.5rem', padding: '0.25rem' }}>Generate Legal Docs</button>
            </div>
          ))}
        </div>

        {/* Due Diligence Column */}
        <div className="kanban-column">
          <h3>Due Diligence <span className="badge">0</span></h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>Drag deals here</p>
        </div>

        {/* Closed Won Column */}
        <div className="kanban-column">
          <h3>Closed Won <span className="badge">{pipeline.closed.length}</span></h3>
          {pipeline.closed.map(deal => (
            <div key={deal.id} className="kanban-card" style={{ background: 'rgba(35, 134, 54, 0.1)', borderColor: 'var(--success-color)' }}>
              <h4>{deal.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Founder: {deal.founder}</p>
              <div className="deal-amount">{deal.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
