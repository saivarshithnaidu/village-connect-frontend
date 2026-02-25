import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiAlertCircle, FiZap } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'https://village-connect-backend-1wow.onrender.com/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchProblems();
    fetchSolutions();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/problems`);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const verifyProblem = async (problemId) => {
    try {
      await axios.put(`${API_URL}/problems/${problemId}/verify`);
      fetchProblems();
      fetchStats();
    } catch (error) {
      console.error('Error verifying problem:', error);
      alert('Failed to verify problem');
    }
  };

  const assignProblem = async (problemId, villagerId) => {
    try {
      await axios.put(`${API_URL}/admin/problems/${problemId}/assign`, { assignedTo: villagerId });
      fetchProblems();
      alert('Problem assigned successfully');
    } catch (error) {
      console.error('Error assigning problem:', error);
      alert('Failed to assign problem');
    }
  };

  const verifyCompletion = async (problemId) => {
    try {
      await axios.put(`${API_URL}/problems/${problemId}/verify-completion`);
      fetchProblems();
      fetchStats();
      alert('Problem completion verified and made visible to village');
    } catch (error) {
      console.error('Error verifying completion:', error);
      alert('Failed to verify completion');
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/solutions`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const updateProblemStatus = async (problemId, status) => {
    try {
      await axios.put(`${API_URL}/problems/${problemId}/status`, { status });
      fetchProblems();
      fetchStats();
    } catch (error) {
      console.error('Error updating problem status:', error);
      alert('Failed to update status');
    }
  };

  const updateSolutionStatus = async (solutionId, status) => {
    try {
      await axios.put(`${API_URL}/solutions/${solutionId}/status`, { status });
      fetchSolutions();
      fetchStats();
    } catch (error) {
      console.error('Error updating solution status:', error);
      alert('Failed to update status');
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/role`, { role });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update role');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Admin Dashboard</h1>

      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <FiUsers style={{ fontSize: '32px', color: '#2196F3', marginBottom: '10px' }} />
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <FiAlertCircle style={{ fontSize: '32px', color: '#f44336', marginBottom: '10px' }} />
            <div className="stat-number">{stats.totalProblems}</div>
            <div className="stat-label">Total Problems</div>
          </div>
          <div className="stat-card">
            <FiZap style={{ fontSize: '32px', color: '#4CAF50', marginBottom: '10px' }} />
            <div className="stat-number">{stats.solvedProblems || 0}</div>
            <div className="stat-label">Solved Problems</div>
          </div>
          <div className="stat-card">
            <FiAlertCircle style={{ fontSize: '32px', color: '#ff9800', marginBottom: '10px' }} />
            <div className="stat-number">{stats.unsolvedProblems || 0}</div>
            <div className="stat-label">Unsolved Problems</div>
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <h2>Problems Management</h2>
        <div className="card">
          {problems
            .sort((a, b) => {
              // Sort unverified problems first, then completed by villager
              if (a.isCompletedByVillager && !a.isVerified && !b.isCompletedByVillager) return -1;
              if (b.isCompletedByVillager && !b.isVerified && !a.isCompletedByVillager) return 1;
              if (a.isVerified !== b.isVerified) {
                return a.isVerified ? 1 : -1;
              }
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .slice(0, 15)
            .map(problem => (
              <div key={problem._id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, marginBottom: '5px' }}>{problem.title}</h3>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '5px' }}>
                      {!problem.isVerified && (
                        <span className="badge badge-warning">Unverified</span>
                      )}
                      {problem.isCompletedByVillager && !problem.isVerified && (
                        <span className="badge badge-info">Completed by Villager - Needs Verification</span>
                      )}
                      {problem.assignedTo && (
                        <span className="badge badge-success">Assigned to {problem.assignedTo?.name}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {problem.isCompletedByVillager && !problem.isVerified && (
                      <button
                        onClick={() => verifyCompletion(problem._id)}
                        className="btn btn-success"
                        style={{ padding: '5px 15px', fontSize: '14px' }}
                      >
                        Verify Completion
                      </button>
                    )}
                    {!problem.isVerified && !problem.isCompletedByVillager && (
                      <button
                        onClick={() => verifyProblem(problem._id)}
                        className="btn btn-primary"
                        style={{ padding: '5px 15px', fontSize: '14px' }}
                      >
                        Verify
                      </button>
                    )}
                    {!problem.assignedTo && problem.isVerified && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            assignProblem(problem._id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{ padding: '5px' }}
                        defaultValue=""
                      >
                        <option value="">Assign to Villager</option>
                        {users.filter(u => u.role === 'villager').map(villager => (
                          <option key={villager._id} value={villager._id}>{villager.name}</option>
                        ))}
                      </select>
                    )}
                    <select
                      value={problem.status}
                      onChange={(e) => updateProblemStatus(problem._id, e.target.value)}
                      style={{ padding: '5px' }}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <p style={{ color: '#666', marginBottom: '10px' }}>{problem.description.substring(0, 100)}...</p>
                {problem.completionMessage && (
                  <div style={{ padding: '10px', background: '#e8f5e9', borderRadius: '5px', marginBottom: '10px' }}>
                    <strong>Completion Message:</strong> {problem.completionMessage}
                  </div>
                )}
                <div style={{ fontSize: '14px', color: '#666' }}>
                  By {problem.reportedBy?.name} | {problem.category}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Solutions</h2>
        <div className="card">
          {solutions.slice(0, 5).map(solution => (
            <div key={solution._id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3>{solution.title}</h3>
                <select
                  value={solution.status}
                  onChange={(e) => updateSolutionStatus(solution._id, e.target.value)}
                  style={{ padding: '5px' }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="implemented">Implemented</option>
                </select>
              </div>
              <p style={{ color: '#666', marginBottom: '10px' }}>{solution.description.substring(0, 100)}...</p>
              <div style={{ fontSize: '14px', color: '#666' }}>
                By {solution.proposedBy?.name} | Problem: {solution.problem?.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Users</h2>
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                {/* <th style={{ padding: '10px', textAlign: 'left' }}>Village</th> */}
                <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{user.name}</td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  {/* <td style={{ padding: '10px' }}>{user.village || '-'}</td> */}
                  <td style={{ padding: '10px' }}>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      style={{ padding: '5px' }}
                    >
                      <option value="villager">Villager</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span className="badge badge-info">{user.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

