import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FiHome, FiLogOut, FiUser, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Village Connect
        </Link>
        <div className="navbar-links">
          <Link to="/">
            <FiHome /> Home
          </Link>
          <Link to="/problems">Problems</Link>
          <Link to="/solutions">Solutions</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <FiShield /> Admin
                </Link>
              )}
              {user.role === 'volunteer' && (
                <Link to="/volunteer/dashboard">
                  Volunteer Dashboard
                </Link>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FiUser /> {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ margin: 0 }}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ margin: 0 }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

