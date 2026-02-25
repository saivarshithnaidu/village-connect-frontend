import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FiThumbsUp, FiArrowLeft } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solutionForm, setSolutionForm] = useState({ title: '', description: '', estimatedCost: '', estimatedTime: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProblem();
    if (user && user.role !== 'villager') {
      fetchSolutions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems/${id}`);
      setProblem(response.data);
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${API_URL}/solutions?problem=${id}`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      alert('Please login to upvote');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/problems/${id}/upvote`);
      setProblem(response.data);
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to propose a solution');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/solutions`, {
        ...solutionForm,
        problem: id
      });
      setSolutions([...solutions, response.data]);
      setSolutionForm({ title: '', description: '', estimatedCost: '', estimatedTime: '' });
      alert('Solution proposed successfully!');
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Failed to submit solution');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!problem) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Problem not found</div>;
  }

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge-info',
      'in-progress': 'badge-warning',
      resolved: 'badge-success',
      closed: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/problems" className="btn btn-outline" style={{ marginBottom: '20px' }}>
        <FiArrowLeft /> Back to Problems
      </Link>

      <div className="card">
        <div className="problem-header">
          <div style={{ flex: 1 }}>
            <h1 className="problem-title">{problem.title}</h1>
            <div className="problem-meta">
              <span className={`badge ${getStatusBadge(problem.status)}`}>
                {problem.status}
              </span>
              <span className="badge badge-info">{problem.category}</span>
              <span className="badge badge-warning">{problem.priority}</span>
            </div>
          </div>
        </div>
        <p className="problem-description" style={{ fontSize: '16px', marginBottom: '20px' }}>
          {problem.description}
        </p>
        <div className="problem-footer">
          <button
            className={`upvote-btn ${user && problem.upvotes.some(id => id.toString() === (user.id || user._id).toString()) ? 'active' : ''}`}
            onClick={handleUpvote}
          >
            <FiThumbsUp /> {problem.upvotes?.length || 0} Upvotes
          </button>
          <div>
            <strong>Reported by:</strong> {problem.reportedBy?.name || 'Unknown'} on{' '}
            {new Date(problem.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Hide solutions section for villagers */}
      {user && user.role !== 'villager' && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h2>Proposed Solutions ({solutions.length})</h2>
          
          {user && (
            <form onSubmit={handleSubmitSolution} style={{ marginTop: '20px', marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
              <h3>Propose a Solution</h3>
              <div className="form-group">
                <label>Solution Title *</label>
                <input
                  type="text"
                  value={solutionForm.title}
                  onChange={(e) => setSolutionForm({ ...solutionForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={solutionForm.description}
                  onChange={(e) => setSolutionForm({ ...solutionForm, description: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Estimated Cost</label>
                  <input
                    type="number"
                    value={solutionForm.estimatedCost}
                    onChange={(e) => setSolutionForm({ ...solutionForm, estimatedCost: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Time</label>
                  <input
                    type="text"
                    value={solutionForm.estimatedTime}
                    onChange={(e) => setSolutionForm({ ...solutionForm, estimatedTime: e.target.value })}
                    placeholder="e.g., 2 weeks"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Submit Solution</button>
            </form>
          )}

          {solutions.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No solutions proposed yet. Be the first to suggest one!
            </p>
          ) : (
            solutions.map(solution => (
              <div key={solution._id} style={{ marginTop: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3>{solution.title}</h3>
                  <span className={`badge ${solution.status === 'approved' ? 'badge-success' : solution.status === 'implemented' ? 'badge-success' : 'badge-warning'}`}>
                    {solution.status}
                  </span>
                </div>
                <p style={{ marginBottom: '10px', color: '#555' }}>{solution.description}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  {solution.estimatedCost && <span>💰 Cost: ₹{solution.estimatedCost}</span>}
                  {solution.estimatedTime && <span>⏱️ Time: {solution.estimatedTime}</span>}
                  <span>👍 {solution.upvotes?.length || 0} Upvotes</span>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Proposed by {solution.proposedBy?.name || 'Unknown'} on {new Date(solution.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;

