import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://village-connect-backend-1wow.onrender.com/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if user is admin
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        const user = response.data;
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          setError('Access denied. Admin login only.');
          logout();
        }
      } catch (err) {
        setError('Failed to verify admin access');
        logout();
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Admin Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#ffebee', borderRadius: '5px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Admin Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

