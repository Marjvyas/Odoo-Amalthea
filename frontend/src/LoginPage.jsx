import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../authService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // State to hold the form input values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State to manage loading feedback and display errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { email, password } = formData;

  // Update state as the user types in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the browser from refreshing
    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      // Call the login function from our service
      await authService.login(email, password);
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      // If the service throws an error, display it to the user
      setError(err.message);
    } finally {
      setLoading(false); // Ensure the loading indicator is turned off
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ExpenseFlow</h1>
          <h2>Welcome Back</h2>
          <p>Sign in to your expense management account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? (
              <span className="loading-spinner">🔄</span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account? 
            <a href="/register" className="auth-link">Create one here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;