import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'villager',
    phone: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await register(formData);

      if (result.success) {
        const userData = result.user;
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.role === 'volunteer') {
          navigate('/volunteer/dashboard');
        } else if (userData.role === 'villager') {
          navigate('/villager/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Create Account</h2>
        {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#ffebee', borderRadius: '5px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>I am a *</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="role"
                  value="villager"
                  checked={formData.role === 'villager'}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '8px' }}
                />
                Villager
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="role"
                  value="volunteer"
                  checked={formData.role === 'volunteer'}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '8px' }}
                />
                Volunteer
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  required
                  style={{ marginRight: '8px' }}
                />
                Admin
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

