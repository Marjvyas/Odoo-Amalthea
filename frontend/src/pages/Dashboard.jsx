import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalExpenses: 12,
    pendingApprovals: 3,
    approvedThisMonth: 8,
    totalAmount: 25750.50
  });

  const [recentExpenses, setRecentExpenses] = useState([
    {
      id: 1,
      description: 'Client Dinner - Project Kickoff',
      amount: 1250.00,
      status: 'pending',
      date: '2025-10-03',
      category: 'Meals'
    },
    {
      id: 2,
      description: 'Flight to Mumbai - Business Meeting',
      amount: 5500.00,
      status: 'approved',
      date: '2025-10-02',
      category: 'Travel'
    },
    {
      id: 3,
      description: 'Office Supplies - Stationery',
      amount: 850.00,
      status: 'rejected',
      date: '2025-10-01',
      category: 'Office Supplies'
    },
    {
      id: 4,
      description: 'Hotel Stay - Conference',
      amount: 3200.00,
      status: 'approved',
      date: '2025-09-30',
      category: 'Accommodation'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#48bb78';
      case 'rejected': return '#f56565';
      case 'pending': return '#ed8936';
      default: return '#718096';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'pending': return '⏳';
      default: return '📄';
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation />
      <div className="main-content">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's an overview of your expense activity.</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                📊
              </div>
              <div className="stat-content">
                <h3>{stats.totalExpenses}</h3>
                <p>Total Expenses</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' }}>
                ⏳
              </div>
              <div className="stat-content">
                <h3>{stats.pendingApprovals}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                ✅
              </div>
              <div className="stat-content">
                <h3>{stats.approvedThisMonth}</h3>
                <p>Approved This Month</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                💰
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalAmount.toLocaleString()}</h3>
                <p>Total Amount</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button 
                className="action-btn primary"
                onClick={() => navigate('/expenses/submit')}
              >
                <span className="action-icon">➕</span>
                <div>
                  <span className="action-title">Submit New Expense</span>
                  <span className="action-subtitle">Create a new expense claim</span>
                </div>
              </button>
              
              <button 
                className="action-btn secondary"
                onClick={() => navigate('/expenses/my-expenses')}
              >
                <span className="action-icon">📋</span>
                <div>
                  <span className="action-title">View My Expenses</span>
                  <span className="action-subtitle">Track your submissions</span>
                </div>
              </button>
              
              <button 
                className="action-btn tertiary"
                onClick={() => navigate('/expenses/approvals')}
              >
                <span className="action-icon">✅</span>
                <div>
                  <span className="action-title">Pending Approvals</span>
                  <span className="action-subtitle">Review team expenses</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="recent-expenses">
            <div className="section-header">
              <h2>Recent Expenses</h2>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/expenses/my-expenses')}
              >
                View All
              </button>
            </div>
            
            <div className="expenses-table">
              <div className="table-header">
                <span>Description</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="table-row">
                  <div className="expense-description">
                    <span className="expense-title">{expense.description}</span>
                    <span className="expense-category">{expense.category}</span>
                  </div>
                  <span className="expense-amount">₹{expense.amount.toLocaleString()}</span>
                  <div className="expense-status">
                    <span 
                      className="status-badge"
                      style={{ 
                        background: getStatusColor(expense.status) + '20',
                        color: getStatusColor(expense.status)
                      }}
                    >
                      {getStatusIcon(expense.status)} {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </span>
                  </div>
                  <span className="expense-date">{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section (Placeholder) */}
          <div className="charts-section">
            <div className="chart-card">
              <h3>Monthly Expense Trends</h3>
              <div className="chart-placeholder">
                <p>📈 Chart visualization would go here</p>
                <p>Shows expense trends over the last 6 months</p>
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Expense Categories</h3>
              <div className="chart-placeholder">
                <p>🥧 Pie chart would go here</p>
                <p>Breakdown by expense categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;