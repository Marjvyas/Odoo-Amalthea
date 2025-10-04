import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ userRole = 'Admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: 'John Doe', role: userRole });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const menuItems = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: '📊', 
      roles: ['Admin', 'Manager', 'Employee'] 
    },
    { 
      path: '/expenses/submit', 
      name: 'Submit Expense', 
      icon: '➕', 
      roles: ['Employee', 'Manager', 'Admin'] 
    },
    { 
      path: '/expenses/my-expenses', 
      name: 'My Expenses', 
      icon: '📋', 
      roles: ['Employee', 'Manager', 'Admin'] 
    },
    { 
      path: '/expenses/approvals', 
      name: 'Approvals', 
      icon: '✅', 
      roles: ['Manager', 'Admin'] 
    },
    { 
      path: '/users', 
      name: 'User Management', 
      icon: '👥', 
      roles: ['Admin'] 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      icon: '⚙️', 
      roles: ['Admin', 'Manager', 'Employee'] 
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${isMenuOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <h2 className="logo">ExpenseFlow</h2>
          <span className="logo-subtitle">Expense Management</span>
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul className="nav-menu">
          {filteredMenuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <button
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;