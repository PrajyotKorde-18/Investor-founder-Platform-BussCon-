import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Search, Layers, FileText, LogOut, BarChart2, DollarSign, Settings } from 'lucide-react';

export default function Navigation({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <BarChart2 color="#58a6ff" size={28} />
        BussCon
      </div>
      
      <nav style={{ flex: 1 }}>
        {role === 'founder' && (
          <>
            <NavLink to="/founder" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
              <Home size={20} /> Dashboard
            </NavLink>
            <NavLink to="/founder/submit" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <PlusCircle size={20} /> Submit Idea
            </NavLink>
            <NavLink to="/founder/financials" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <DollarSign size={20} /> Financial Model
            </NavLink>
          </>
        )}

        {role === 'investor' && (
          <>
            <NavLink to="/investor" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
              <Home size={20} /> Operations Board
            </NavLink>
            <NavLink to="/investor/browse" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Search size={20} /> Browse Ideas
            </NavLink>
            <NavLink to="/investor/pipeline" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Layers size={20} /> Pipelines & Deals
            </NavLink>
            <NavLink to="/investor/automation" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Settings size={20} /> Automation Rules
            </NavLink>
          </>
        )}

        <NavLink to="/legal" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FileText size={20} /> Legal Support
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', padding: '0 1.5rem' }}>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
