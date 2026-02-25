import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CreateProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/problems`, formData);
      navigate(`/problems/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create problem');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <button onClick={() => navigate('/problems')} className="btn btn-outline" style={{ marginBottom: '20px' }}>
        <FiArrowLeft /> Back
      </button>

      <div className="form-container">
        <h2 className="form-title">Report a Problem</h2>
        {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#ffebee', borderRadius: '5px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Problem Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief description of the problem"
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Provide detailed information about the problem..."
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="infrastructure">Infrastructure</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="agriculture">Agriculture</option>
                <option value="water">Water</option>
                <option value="electricity">Electricity</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Submit Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProblem;

