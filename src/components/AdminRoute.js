import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== 'admin') {
    return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Access Denied</h2>
      <p>You need admin privileges to access this page.</p>
    </div>;
  }

  return children;
};

export default AdminRoute;

