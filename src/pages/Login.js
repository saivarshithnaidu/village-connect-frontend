import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(formData.email, formData.password);

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
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Login</h2>
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
            Login
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

