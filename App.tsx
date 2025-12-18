
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ReportIssue from './pages/ReportIssue.tsx';
import Login from './pages/Login.tsx';
import { mockUser, adminUser, mockRepairs } from './mockData.ts';
import { AuthState, RepairRequest } from './types.ts';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const [repairs, setRepairs] = useState<RepairRequest[]>([]);

  useEffect(() => {
    const savedRepairs = localStorage.getItem('printexpert_repairs');
    if (savedRepairs) {
        setRepairs(JSON.parse(savedRepairs));
    } else {
        setRepairs(mockRepairs);
    }

    const savedAuth = localStorage.getItem('printexpert_auth');
    if (savedAuth) {
        setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const handleLogin = (email: string, pass: string) => {
    let userToLogin = null;
    
    if (email === 'admin' && pass === 'admin') {
      userToLogin = adminUser;
    } else {
      userToLogin = { ...mockUser, email: email || mockUser.email, id: 'u' + Math.random() };
    }

    const newAuth: AuthState = { user: userToLogin, isAuthenticated: true };
    setAuth(newAuth);
    localStorage.setItem('printexpert_auth', JSON.stringify(newAuth));
  };

  const handleLogout = () => {
    const newAuth: AuthState = { user: null, isAuthenticated: false };
    setAuth(newAuth);
    localStorage.removeItem('printexpert_auth');
  };

  const handleUpdateRepair = (updatedRepair: RepairRequest) => {
    const updated = repairs.map(r => r.id === updatedRepair.id ? updatedRepair : r);
    setRepairs(updated);
    localStorage.setItem('printexpert_repairs', JSON.stringify(updated));
  };

  const handleAddRepair = (repair: RepairRequest) => {
    const repairWithClient = { ...repair, clientName: auth.user?.name };
    const updated = [repairWithClient, ...repairs];
    setRepairs(updated);
    localStorage.setItem('printexpert_repairs', JSON.stringify(updated));
  };

  const handleImport = (imported: RepairRequest[]) => {
    setRepairs(imported);
    localStorage.setItem('printexpert_repairs', JSON.stringify(imported));
  };

  return (
    <Router>
      <Layout auth={auth} onLogout={handleLogout}>
        {auth.isAuthenticated && auth.user?.role === 'admin' && (
          <div className="bg-indigo-600 text-white text-center text-xs py-1 font-bold uppercase tracking-widest">
            Tryb Administratora Systemu
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              auth.isAuthenticated ? (
                auth.user?.role === 'admin' ? 
                  <AdminDashboard repairs={repairs} onUpdateRepair={handleUpdateRepair} onImportRepairs={handleImport} /> : 
                  <Dashboard repairs={repairs.filter(r => r.clientId === auth.user?.id)} />
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/report" 
            element={auth.isAuthenticated ? <ReportIssue clientId={auth.user?.id || ''} onAddRepair={handleAddRepair} /> : <Navigate to="/login" />} 
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Login onLogin={(e, p) => handleLogin(e, p)} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
