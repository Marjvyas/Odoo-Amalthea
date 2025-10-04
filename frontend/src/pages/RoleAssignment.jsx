import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoleAssignment.css';

const RoleAssignment = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({});

  useEffect(() => {
    fetchPendingUsers();
    fetchManagers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/pending-roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      alert('Failed to fetch pending users');
    }
  };

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/managers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(response.data.managers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setLoading(false);
    }
  };

  const assignRole = async (userId, role, managerId = null) => {
    setAssigning(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const requestBody = { role };
      if (managerId) {
        requestBody.managerId = managerId;
      }

      await axios.put(`http://localhost:5000/api/users/${userId}/assign-role`, requestBody, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove user from pending list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      alert(`Role '${role}' assigned successfully!`);
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Failed to assign role');
    } finally {
      setAssigning(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRoleAssignment = (user, role) => {
    if (role === 'Admin') {
      assignRole(user.id, role);
    } else {
      // For Employee and Manager roles, show manager selection
      const managerId = prompt(`Select a manager for ${user.name}. Enter manager ID or leave empty for no manager:`);
      if (managerId && !isNaN(managerId)) {
        assignRole(user.id, role, parseInt(managerId));
      } else if (managerId === '') {
        assignRole(user.id, role);
      }
    }
  };

  if (loading) {
    return (
      <div className="role-assignment">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading pending users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-assignment">
      <div className="role-assignment-header">
        <h1>👑 Role Assignment</h1>
        <p>Assign roles to newly registered users</p>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="no-pending-users">
          <div className="empty-state">
            <h2>🎉 All Caught Up!</h2>
            <p>No users waiting for role assignment</p>
          </div>
        </div>
      ) : (
        <div className="pending-users-section">
          <h2>📋 Users Awaiting Role Assignment ({pendingUsers.length})</h2>
          
          <div className="users-grid">
            {pendingUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h3>{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <p className="user-company">{user.company_name}</p>
                    <span className="user-status">Pending Role Assignment</span>
                  </div>
                </div>

                <div className="role-actions">
                  <h4>Assign Role:</h4>
                  <div className="role-buttons">
                    <button
                      className="role-btn employee-btn"
                      onClick={() => handleRoleAssignment(user, 'Employee')}
                      disabled={assigning[user.id]}
                    >
                      👤 Employee
                    </button>
                    <button
                      className="role-btn manager-btn"
                      onClick={() => handleRoleAssignment(user, 'Manager')}
                      disabled={assigning[user.id]}
                    >
                      👨‍💼 Manager
                    </button>
                    <button
                      className="role-btn admin-btn"
                      onClick={() => handleRoleAssignment(user, 'Admin')}
                      disabled={assigning[user.id]}
                    >
                      👑 Admin
                    </button>
                  </div>
                  {assigning[user.id] && (
                    <div className="assigning-indicator">
                      <div className="mini-spinner"></div>
                      <span>Assigning role...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {managers.length > 0 && (
        <div className="managers-reference">
          <h3>📋 Available Managers</h3>
          <div className="managers-list">
            {managers.map(manager => (
              <div key={manager.id} className="manager-item">
                <span className="manager-id">ID: {manager.id}</span>
                <span className="manager-name">{manager.name}</span>
                <span className="manager-role">{manager.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleAssignment;