import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiThumbsUp } from 'react-icons/fi';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchSolutions();
  }, [filter]);

  const fetchSolutions = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);

      const response = await axios.get(`${API_URL}/solutions?${params}`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (solutionId) => {
    if (!user) {
      alert('Please login to upvote');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/solutions/${solutionId}/upvote`);
      setSolutions(solutions.map(s => s._id === solutionId ? response.data : s));
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Proposed Solutions</h1>

      <div className="filters" style={{ marginBottom: '30px' }}>
        <select
          className="filter-select"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="implemented">Implemented</option>
        </select>
      </div>

      {solutions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>No solutions found.</p>
        </div>
      ) : (
        solutions.map(solution => (
          <div key={solution._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '10px' }}>{solution.title}</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className={`badge ${solution.status === 'approved' || solution.status === 'implemented' ? 'badge-success' : solution.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {solution.status}
                  </span>
                  <Link to={`/problems/${solution.problem._id}`} style={{ color: '#2196F3', textDecoration: 'none' }}>
                    Problem: {solution.problem.title}
                  </Link>
                </div>
              </div>
            </div>
            <p style={{ color: '#555', marginBottom: '15px', lineHeight: '1.6' }}>
              {solution.description}
            </p>
            <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {solution.estimatedCost && <span>💰 Cost: ₹{solution.estimatedCost}</span>}
              {solution.estimatedTime && <span>⏱️ Time: {solution.estimatedTime}</span>}
            </div>
            <div className="problem-footer">
              <button
                className={`upvote-btn ${user && solution.upvotes.some(id => id.toString() === (user.id || user._id).toString()) ? 'active' : ''}`}
                onClick={() => handleUpvote(solution._id)}
              >
                <FiThumbsUp /> {solution.upvotes?.length || 0} Upvotes
              </button>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Proposed by {solution.proposedBy?.name || 'Unknown'} on {new Date(solution.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Solutions;

