import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL;

const VillagerDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [completionMessage, setCompletionMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'villager') {
      fetchAssignedProblems();
    } else if (user && user.role !== 'villager') {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAssignedProblems = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems/assigned/me`);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching assigned problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (problemId) => {
    if (!completionMessage.trim()) {
      alert('Please provide a completion message');
      return;
    }

    try {
      await axios.put(`${API_URL}/problems/${problemId}/complete`, {
        completionMessage
      });
      alert('Problem marked as completed! Waiting for admin verification.');
      setCompletionMessage('');
      setSelectedProblem(null);
      fetchAssignedProblems();
    } catch (error) {
      console.error('Error completing problem:', error);
      alert(error.response?.data?.message || 'Failed to complete problem');
    }
  };

  const getStatusBadge = (status, isCompleted, isVerified) => {
    if (isCompleted && isVerified) {
      return <span className="badge badge-success">Verified & Resolved</span>;
    }
    if (isCompleted && !isVerified) {
      return <span className="badge badge-warning">Completed - Pending Verification</span>;
    }
    const badges = {
      open: 'badge-info',
      'in-progress': 'badge-warning',
      resolved: 'badge-success',
      closed: 'badge-danger'
    };
    return <span className={`badge ${badges[status] || 'badge-info'}`}>{status}</span>;
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>My Assigned Problems</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Here are the problems assigned to you by the admin. Complete them and send a message to the admin for verification.
      </p>

      {problems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <FiAlertCircle style={{ fontSize: '48px', color: '#999', marginBottom: '20px' }} />
          <p>No problems assigned to you yet.</p>
        </div>
      ) : (
        <div>
          {problems.map(problem => (
            <div key={problem._id} className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: '10px' }}>{problem.title}</h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {getStatusBadge(problem.status, problem.isCompletedByVillager, problem.isVerified)}
                    <span className="badge badge-info">{problem.category}</span>
                    <span className="badge badge-warning">{problem.priority}</span>
                  </div>
                </div>
              </div>

              <p style={{ color: '#666', marginBottom: '15px' }}>{problem.description}</p>

              <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                <strong>Reported by:</strong> {problem.reportedBy?.name || 'Unknown'} |
                <strong> Assigned on:</strong> {new Date(problem.updatedAt).toLocaleDateString()}
              </div>

              {problem.isCompletedByVillager && problem.completionMessage && (
                <div style={{ padding: '10px', background: '#e8f5e9', borderRadius: '5px', marginBottom: '15px' }}>
                  <strong>Your completion message:</strong> {problem.completionMessage}
                  {!problem.isVerified && (
                    <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                      ⏳ Waiting for admin verification
                    </div>
                  )}
                </div>
              )}

              {!problem.isCompletedByVillager && (
                <div>
                  {selectedProblem === problem._id ? (
                    <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '5px' }}>
                      <div className="form-group">
                        <label>Completion Message *</label>
                        <textarea
                          value={completionMessage}
                          onChange={(e) => setCompletionMessage(e.target.value)}
                          placeholder="Describe how you solved this problem..."
                          rows="4"
                          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleComplete(problem._id)}
                          className="btn btn-success"
                        >
                          <FiCheckCircle /> Mark as Completed
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProblem(null);
                            setCompletionMessage('');
                          }}
                          className="btn btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedProblem(problem._id)}
                      className="btn btn-primary"
                    >
                      <FiCheckCircle /> Mark as Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VillagerDashboard;

