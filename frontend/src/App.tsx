import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadDiscovery from './pages/LeadDiscovery';
import LeadDatabase from './pages/LeadDatabase';
import OutreachGenerator from './pages/OutreachGenerator';

// Set mock mode for development/prototype
if (!import.meta.env.VITE_USE_MOCK_DATA) {
  (import.meta.env as any).VITE_USE_MOCK_DATA = 'true';
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/discovery" element={<LeadDiscovery />} />
          <Route path="/database" element={<LeadDatabase />} />
          <Route path="/outreach" element={<OutreachGenerator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;