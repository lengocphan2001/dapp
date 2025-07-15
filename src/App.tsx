import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { Web3Provider } from './components/Web3Context';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeFiDashboardPage from './pages/DeFiDashboardPage';
import DepositPage from './pages/DepositPage';
import AdminPage from './pages/AdminPage';
import TestPage from './pages/TestPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/test" element={<TestPage />} />
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/defi" element={
                <ProtectedRoute>
                  <DeFiDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/deposit" element={
                <ProtectedRoute>
                  <DepositPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/test" replace />} />
              <Route path="*" element={<Navigate to="/test" replace />} />
            </Routes>
          </div>
        </Router>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
