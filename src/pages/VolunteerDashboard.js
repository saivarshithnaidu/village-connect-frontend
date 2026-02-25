import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FiAlertCircle, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://village-connect-backend-1wow.onrender.com/api';

const VolunteerDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'volunteer') {
      fetchProblems();
    } else if (user && user.role !== 'volunteer') {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems`);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
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
      <h1>Volunteer Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        View verified problems and propose solutions to help the community.
      </p>

      {problems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <FiAlertCircle style={{ fontSize: '48px', color: '#999', marginBottom: '20px' }} />
          <p>No verified problems available at the moment.</p>
        </div>
      ) : (
        <div>
          {problems.map(problem => (
            <div key={problem._id} className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <Link to={`/problems/${problem._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ margin: 0, marginBottom: '10px', color: '#2196F3', cursor: 'pointer' }}>
                      {problem.title}
                    </h3>
                  </Link>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span className={`badge ${getStatusBadge(problem.status)}`}>
                      {problem.status}
                    </span>
                    <span className={`badge ${getPriorityBadge(problem.priority)}`}>
                      {problem.priority}
                    </span>
                    <span className="badge badge-info">{problem.category}</span>
                  </div>
                </div>
              </div>

              <p style={{ color: '#666', marginBottom: '15px' }}>
                {problem.description.length > 200
                  ? `${problem.description.substring(0, 200)}...`
                  : problem.description}
              </p>

              <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                <strong>Reported by:</strong> {problem.reportedBy?.name || 'Unknown'} |
                <strong> Posted:</strong> {new Date(problem.createdAt).toLocaleDateString()}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/problems/${problem._id}`} className="btn btn-primary">
                  <FiEye /> View Details & Propose Solution
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;

