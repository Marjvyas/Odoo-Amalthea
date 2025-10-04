import axios from 'axios';

// The base URL of your backend server
const API_URL = 'http://localhost:5000/api/auth/';

/**
 * Sends a login request to the backend API.
 * On success, it saves the received JWT to the browser's local storage.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response data from the server.
 */
const login = async (email, password) => {
  try {
    // Send the POST request to the login endpoint
    const response = await axios.post(API_URL + 'login', {
      email,
      password,
    });

    // If the response contains a token, save it
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    // Create a user-friendly error message from the server's response
    const message = error.response?.data?.errors?.[0]?.msg || 'Login failed. Please check your credentials.';
    // Throw an error to be caught by the component
    throw new Error(message);
  }
};

const register = async (name, email, password, companyName = 'Default Company', country = 'India') => {
  try {
    const response = await axios.post(API_URL + 'signup', {
      name,
      email,
      password,
      companyName,
      country,
    });
    
    // If the response contains a token, save it
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.errors?.[0]?.msg || 'Registration failed. Please try again.';
    throw new Error(message);
  }
};

const authService = {
  login,
  register,
};

export default authService;