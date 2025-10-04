import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    phone: '+91 9876543210',
    department: 'Finance'
  });

  const [company, setCompany] = useState({
    name: 'Acme Corporation',
    country: 'India',
    currency: 'INR',
    address: '123 Business Street, Mumbai, India',
    timezone: 'Asia/Kolkata'
  });

  const [approvalRules, setApprovalRules] = useState({
    managerApprovalRequired: true,
    autoApprovalLimit: 5000,
    multiLevelApproval: true,
    percentageRule: 60,
    specificApprovers: ['CFO', 'Director']
  });

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCompanyChange = (e) => {
    setCompany(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApprovalRuleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApprovalRules(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (section) => {
    console.log(`Saving ${section}:`, section === 'profile' ? profile : section === 'company' ? company : approvalRules);
    alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'company', name: 'Company', icon: '🏢' },
    { id: 'approval', name: 'Approval Rules', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="settings-container">
      <Navigation />
      <div className="main-content">
        <div className="settings-content">
          <div className="page-header">
            <h1>Settings</h1>
            <p>Manage your profile, company settings, and approval workflows.</p>
          </div>

          <div className="settings-layout">
            {/* Sidebar Tabs */}
            <div className="settings-sidebar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-name">{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="settings-main">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Profile Settings</h2>
                    <p>Update your personal information and preferences.</p>
                  </div>

                  <div className="settings-card">
                    <div className="profile-avatar">
                      <div className="avatar-circle">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <button className="change-avatar-btn">Change Photo</button>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Department</label>
                        <input
                          type="text"
                          name="department"
                          value={profile.department}
                          onChange={handleProfileChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Role</label>
                        <input
                          type="text"
                          name="role"
                          value={profile.role}
                          disabled
                          className="form-input disabled"
                        />
                        <small>Contact your administrator to change your role</small>
                      </div>
                    </div>

                    <div className="section-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleSave('profile')}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Settings */}
              {activeTab === 'company' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Company Settings</h2>
                    <p>Configure your organization's basic information.</p>
                  </div>

                  <div className="settings-card">
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label>Company Name</label>
                        <input
                          type="text"
                          name="name"
                          value={company.name}
                          onChange={handleCompanyChange}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Country</label>
                        <select
                          name="country"
                          value={company.country}
                          onChange={handleCompanyChange}
                          className="form-input"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Default Currency</label>
                        <select
                          name="currency"
                          value={company.currency}
                          onChange={handleCompanyChange}
                          className="form-input"
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                          <option value="CAD">Canadian Dollar (C$)</option>
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label>Address</label>
                        <textarea
                          name="address"
                          value={company.address}
                          onChange={handleCompanyChange}
                          className="form-input"
                          rows="3"
                        />
                      </div>

                      <div className="form-group">
                        <label>Timezone</label>
                        <select
                          name="timezone"
                          value={company.timezone}
                          onChange={handleCompanyChange}
                          className="form-input"
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                      </div>
                    </div>

                    <div className="section-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleSave('company')}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval Rules */}
              {activeTab === 'approval' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Approval Rules</h2>
                    <p>Configure how expenses are approved in your organization.</p>
                  </div>

                  <div className="settings-card">
                    <div className="approval-options">
                      <div className="option-group">
                        <h3>Basic Settings</h3>
                        
                        <div className="checkbox-group">
                          <input
                            type="checkbox"
                            id="managerApproval"
                            name="managerApprovalRequired"
                            checked={approvalRules.managerApprovalRequired}
                            onChange={handleApprovalRuleChange}
                          />
                          <label htmlFor="managerApproval">
                            Require manager approval for all expenses
                          </label>
                        </div>

                        <div className="form-group">
                          <label>Auto-approval limit (₹)</label>
                          <input
                            type="number"
                            name="autoApprovalLimit"
                            value={approvalRules.autoApprovalLimit}
                            onChange={handleApprovalRuleChange}
                            className="form-input"
                          />
                          <small>Expenses below this amount are auto-approved</small>
                        </div>
                      </div>

                      <div className="option-group">
                        <h3>Advanced Rules</h3>
                        
                        <div className="checkbox-group">
                          <input
                            type="checkbox"
                            id="multiLevel"
                            name="multiLevelApproval"
                            checked={approvalRules.multiLevelApproval}
                            onChange={handleApprovalRuleChange}
                          />
                          <label htmlFor="multiLevel">
                            Enable multi-level approval workflow
                          </label>
                        </div>

                        <div className="form-group">
                          <label>Percentage approval rule (%)</label>
                          <input
                            type="number"
                            name="percentageRule"
                            value={approvalRules.percentageRule}
                            onChange={handleApprovalRuleChange}
                            min="1"
                            max="100"
                            className="form-input"
                          />
                          <small>If this percentage of approvers approve, expense is approved</small>
                        </div>

                        <div className="form-group">
                          <label>Specific Approvers</label>
                          <div className="approver-tags">
                            {approvalRules.specificApprovers.map(approver => (
                              <span key={approver} className="approver-tag">
                                {approver} ×
                              </span>
                            ))}
                            <button className="add-approver-btn">+ Add Approver</button>
                          </div>
                          <small>These roles can override normal approval flow</small>
                        </div>
                      </div>
                    </div>

                    <div className="section-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleSave('approval')}
                      >
                        Save Rules
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Notification Settings</h2>
                    <p>Choose how you want to be notified about expense activities.</p>
                  </div>

                  <div className="settings-card">
                    <div className="notification-groups">
                      <div className="notification-group">
                        <h3>Email Notifications</h3>
                        <div className="notification-options">
                          <div className="checkbox-group">
                            <input type="checkbox" id="emailApproval" defaultChecked />
                            <label htmlFor="emailApproval">When expenses are approved/rejected</label>
                          </div>
                          <div className="checkbox-group">
                            <input type="checkbox" id="emailSubmission" defaultChecked />
                            <label htmlFor="emailSubmission">When new expenses are submitted (Managers)</label>
                          </div>
                          <div className="checkbox-group">
                            <input type="checkbox" id="emailReminder" />
                            <label htmlFor="emailReminder">Reminder for pending approvals</label>
                          </div>
                        </div>
                      </div>

                      <div className="notification-group">
                        <h3>Dashboard Notifications</h3>
                        <div className="notification-options">
                          <div className="checkbox-group">
                            <input type="checkbox" id="dashboardUpdates" defaultChecked />
                            <label htmlFor="dashboardUpdates">Show real-time updates</label>
                          </div>
                          <div className="checkbox-group">
                            <input type="checkbox" id="dashboardSummary" defaultChecked />
                            <label htmlFor="dashboardSummary">Daily expense summary</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleSave('notifications')}
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;