import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import FounderHome from './pages/FounderHome';
import SubmitIdea from './pages/SubmitIdea';
import FounderIdeaDetail from './pages/FounderIdeaDetail';
import InvestorHome from './pages/InvestorHome';
import BrowseIdeas from './pages/BrowseIdeas';
import InvestorIdeaDetail from './pages/InvestorIdeaDetail';
import InvestorPipeline from './pages/InvestorPipeline';
import LegalSupport from './pages/LegalSupport';
import FounderFinancials from './pages/FounderFinancials';
import InvestorAutomation from './pages/InvestorAutomation';

function App() {
  const role = localStorage.getItem('userRole') || null;

  return (
    <Router>
      <div className="app-container">
        {/* Only show navigation if logged in */}
        {role && <Navigation role={role} />}
        
        <div className="main-content">
          <Routes>
            <Route path="/" element={role ? <Navigate to={`/${role}`} /> : <Login />} />
            
            {/* Founder Routes */}
            <Route path="/founder" element={<FounderHome />} />
            <Route path="/founder/submit" element={<SubmitIdea />} />
            <Route path="/founder/idea/:id" element={<FounderIdeaDetail />} />
            <Route path="/founder/financials" element={<FounderFinancials />} />
            
            {/* Investor Routes */}
            <Route path="/investor" element={<InvestorHome />} />
            <Route path="/investor/browse" element={<BrowseIdeas />} />
            <Route path="/investor/idea/:id" element={<InvestorIdeaDetail />} />
            <Route path="/investor/pipeline" element={<InvestorPipeline />} />
            <Route path="/investor/automation" element={<InvestorAutomation />} />
            
            {/* Shared */}
            <Route path="/legal" element={<LegalSupport />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
