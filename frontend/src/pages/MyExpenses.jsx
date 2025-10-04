import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import './MyExpenses.css';

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: 'Client Dinner - Project Kickoff',
      amount: 1250.00,
      status: 'pending',
      date: '2025-10-03',
      category: 'Meals',
      submittedAt: '2025-10-03T14:30:00',
      approver: 'Sarah Manager',
      notes: 'Business dinner with new client to discuss project requirements'
    },
    {
      id: 2,
      description: 'Flight to Mumbai - Business Meeting',
      amount: 5500.00,
      status: 'approved',
      date: '2025-10-02',
      category: 'Travel',
      submittedAt: '2025-10-02T09:15:00',
      approver: 'Sarah Manager',
      approvedAt: '2025-10-02T16:45:00'
    },
    {
      id: 3,
      description: 'Office Supplies - Stationery',
      amount: 850.00,
      status: 'rejected',
      date: '2025-10-01',
      category: 'Office Supplies',
      submittedAt: '2025-10-01T11:20:00',
      approver: 'Sarah Manager',
      rejectedAt: '2025-10-01T17:30:00',
      rejectionReason: 'Please submit with proper receipts'
    },
    {
      id: 4,
      description: 'Hotel Stay - Conference in Delhi',
      amount: 3200.00,
      status: 'approved',
      date: '2025-09-30',
      category: 'Accommodation',
      submittedAt: '2025-09-30T10:00:00',
      approver: 'Sarah Manager',
      approvedAt: '2025-09-30T14:20:00'
    },
    {
      id: 5,
      description: 'Software License - Design Tools',
      amount: 2400.00,
      status: 'approved',
      date: '2025-09-28',
      category: 'Software/Subscriptions',
      submittedAt: '2025-09-28T13:45:00',
      approver: 'Sarah Manager',
      approvedAt: '2025-09-29T09:15:00'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.status === filter;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

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

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const approvedAmount = expenses.filter(e => e.status === 'approved').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="my-expenses-container">
      <Navigation />
      <div className="main-content">
        <div className="expenses-content">
          <div className="page-header">
            <h1>My Expenses</h1>
            <p>Track all your expense submissions and their approval status.</p>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon" style={{ background: '#667eea20', color: '#667eea' }}>
                📊
              </div>
              <div className="summary-content">
                <h3>₹{totalAmount.toLocaleString()}</h3>
                <p>Total Submitted</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon" style={{ background: '#48bb7820', color: '#48bb78' }}>
                ✅
              </div>
              <div className="summary-content">
                <h3>₹{approvedAmount.toLocaleString()}</h3>
                <p>Approved Amount</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon" style={{ background: '#ed893620', color: '#ed8936' }}>
                ⏳
              </div>
              <div className="summary-content">
                <h3>₹{pendingAmount.toLocaleString()}</h3>
                <p>Pending Approval</p>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="expenses-controls">
            <div className="filters">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>

            <button className="new-expense-btn">
              ➕ New Expense
            </button>
          </div>

          {/* Expenses List */}
          <div className="expenses-list">
            {sortedExpenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No expenses found</h3>
                <p>No expenses match your current filters.</p>
                <button className="empty-action-btn">Submit Your First Expense</button>
              </div>
            ) : (
              <div className="expenses-grid">
                {sortedExpenses.map((expense) => (
                  <div key={expense.id} className="expense-card">
                    <div className="expense-header">
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
                      <div className="expense-amount">
                        ₹{expense.amount.toLocaleString()}
                      </div>
                    </div>

                    <div className="expense-content">
                      <h3 className="expense-title">{expense.description}</h3>
                      <div className="expense-meta">
                        <span className="expense-category">{expense.category}</span>
                        <span className="expense-date">{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                      
                      {expense.notes && (
                        <p className="expense-notes">{expense.notes}</p>
                      )}

                      <div className="expense-details">
                        <div className="detail-item">
                          <span className="detail-label">Submitted:</span>
                          <span className="detail-value">
                            {new Date(expense.submittedAt).toLocaleDateString()} at {new Date(expense.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">Approver:</span>
                          <span className="detail-value">{expense.approver}</span>
                        </div>

                        {expense.approvedAt && (
                          <div className="detail-item">
                            <span className="detail-label">Approved:</span>
                            <span className="detail-value">
                              {new Date(expense.approvedAt).toLocaleDateString()} at {new Date(expense.approvedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        )}

                        {expense.rejectedAt && (
                          <div className="detail-item">
                            <span className="detail-label">Rejected:</span>
                            <span className="detail-value">
                              {new Date(expense.rejectedAt).toLocaleDateString()} at {new Date(expense.rejectedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        )}

                        {expense.rejectionReason && (
                          <div className="detail-item rejection-reason">
                            <span className="detail-label">Reason:</span>
                            <span className="detail-value">{expense.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="expense-actions">
                      <button className="action-btn view-btn">👁️ View Details</button>
                      {expense.status === 'rejected' && (
                        <button className="action-btn resubmit-btn">🔄 Resubmit</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyExpenses;