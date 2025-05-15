// src/Components/LivesRunOut.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import brokenHeart from '../assets/Heartbroken.png';    // your broken-heart asset
import dashboardIcon from '../assets/dashboardlogo.png'; // your dashboard icon
import './LivesRunOut.css';

export default function LivesRunOut() {
  const navigate = useNavigate();

  return (
    <div className="lro-overlay" onClick={() => navigate('/dashboard')}>
      <div className="lro-modal" onClick={e => e.stopPropagation()}>
        <img
          src={brokenHeart}
          alt="Out of Lives"
          className="lro-icon"
        />
        <h2 className="lro-title">Out of Lives!</h2>
        <p className="lro-text">
          You’ve used all your lives for today.<br/>
          Take a break, then come back stronger.
        </p>
        <button
          className="lro-button"
          onClick={() => navigate('/dashboard')}
        >
          <img src={dashboardIcon} alt="" className="lro-btn-icon" />
          Dashboard
        </button>
      </div>
    </div>
);
}
