import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiZap, FiTrendingUp } from 'react-icons/fi';
import '../App.css';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Village Connect</h1>
          <p>Bridging Problems and Solutions in Your Community</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/problems" className="btn btn-primary" style={{ fontSize: '18px', padding: '12px 30px' }}>
              Report a Problem
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '20px', color: '#333' }}>
            How It Works
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <FiAlertCircle />
              <h3>Report Problems</h3>
              <p>Share issues affecting your village community. From infrastructure to health, education, and more.</p>
            </div>
            <div className="feature-card">
              <FiZap />
              <h3>Propose Solutions</h3>
              <p>Contribute your ideas and solutions. Community members can upvote the best proposals.</p>
            </div>
            <div className="feature-card">
              <FiTrendingUp />
              <h3>Track Progress</h3>
              <p>Monitor the status of reported problems and see solutions being implemented.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

