import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FiThumbsUp, FiPlus } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'https://village-connect-backend-1wow.onrender.com/api';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProblems = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await axios.get(`${API_URL}/problems?${params}`);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (problemId) => {
    if (!user) {
      alert('Please login to upvote');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/problems/${problemId}/upvote`);
      setProblems(problems.map(p => p._id === problemId ? response.data : p));
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge-info',
      'in-progress': 'badge-warning',
      resolved: 'badge-success',
      closed: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge-info',
      medium: 'badge-warning',
      high: 'badge-danger',
      urgent: 'badge-danger'
    };
    return badges[priority] || 'badge-info';
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div className="problems-header">
        <h1>Community Problems</h1>
        {user && user.role === 'villager' && (
          <Link to="/problems/create" className="btn btn-primary">
            <FiPlus /> Report Problem
          </Link>
        )}
      </div>

      <div className="filters">
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="agriculture">Agriculture</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="transport">Transport</option>
          <option value="other">Other</option>
        </select>
        <select
          className="filter-select"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {problems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>No problems found. Be the first to report one!</p>
        </div>
      ) : (
        problems.map(problem => (
          <div key={problem._id} className="card problem-card">
            <div className="problem-header">
              <div style={{ flex: 1 }}>
                <Link to={`/problems/${problem._id}`} style={{ textDecoration: 'none' }}>
                  <h3 className="problem-title">{problem.title}</h3>
                </Link>
                <div className="problem-meta">
                  <span className={`badge ${getStatusBadge(problem.status)}`}>
                    {problem.status}
                  </span>
                  <span className={`badge ${getPriorityBadge(problem.priority)}`}>
                    {problem.priority}
                  </span>
                  <span className="badge badge-info">{problem.category}</span>
                  <span>By {problem.reportedBy?.name || 'Unknown'}</span>
                </div>
              </div>
            </div>
            <p className="problem-description">
              {problem.description.length > 200
                ? `${problem.description.substring(0, 200)}...`
                : problem.description}
            </p>
            <div className="problem-footer">
              <button
                className={`upvote-btn ${user && problem.upvotes.some(id => id.toString() === (user.id || user._id).toString()) ? 'active' : ''}`}
                onClick={() => handleUpvote(problem._id)}
              >
                <FiThumbsUp /> {problem.upvotes?.length || 0} Upvotes
              </button>
              <Link to={`/problems/${problem._id}`} className="btn btn-outline">
                View Details
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Problems;

