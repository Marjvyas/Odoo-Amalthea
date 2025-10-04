import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './pages/Dashboard';
import ExpenseSubmission from './pages/ExpenseSubmission';
import MyExpenses from './pages/MyExpenses';
import Settings from './pages/Settings';
import AuthGuard from './components/AuthGuard';

// Home page component
const HomePage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ExpenseFlow</h1>
          <h2>Smart Expense Management</h2>
          <p>Streamline your expense reimbursement process with automated approvals, OCR receipt scanning, and multi-level workflows.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <a href="/login" style={{
            flex: 1,
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'transform 0.3s ease'
          }}>
            Sign In
          </a>
          <a href="/register" style={{
            flex: 1,
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'transform 0.3s ease'
          }}>
            Register
          </a>
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Key Features:</h3>
          <ul style={{ color: '#718096', lineHeight: '1.6' }}>
            <li>Multi-level approval workflows</li>
            <li>OCR receipt scanning</li>
            <li>Role-based permissions</li>
            <li>Real-time currency conversion</li>
            <li>Conditional approval rules</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />
        <Route path="/expenses/submit" element={
          <AuthGuard>
            <ExpenseSubmission />
          </AuthGuard>
        } />
        <Route path="/expenses/my-expenses" element={
          <AuthGuard>
            <MyExpenses />
          </AuthGuard>
        } />
        <Route path="/settings" element={
          <AuthGuard>
            <Settings />
          </AuthGuard>
        } />
      </Routes>
    </div>
  );
}

export default App;