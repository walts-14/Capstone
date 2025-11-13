// src/Components/LivesRunOut.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import brokenHeart from '../../assets/Heartbroken.png';    // your broken-heart asset
import dashboardIcon from '../../assets/dashboardlogo.png'; // your dashboard icon
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
       {/* Responsive styles for smooth transition */}
      <style>{`
        /* Tablet sidenav and logo - show between 640px-1024px */
        @media (min-width: 640px) and (max-width: 768px) {
          .lro-overlay {
            width: 100vw !important;
            height: 100vh !important;
            padding: 10vw 10vw 230vw 10vw !important;
          }
          .lro-modal {
            display: flex; ;
            flex-direction: column;
            justify-content: center; /* horizontal */
            align-items: center;     /* vertical */
            width: 60vw !important;
            height: 60vh !important;
            margin-top: 80vh !important;
          }
          .lro-button {
            font-size: 1.5rem !important;
            height: 5rem !important;
          }
          .lro-button img{
            width: 40px !important;
            height: 40px !important;
          }
          .lro-icon {
            width: 110px;
            margin-bottom: 0rem;
          }
          .lro-title {
            margin: 0.5rem 0;
            font-size: 2.5rem;
            color: #ffffff;
          }
          .lro-text {
            color: #ddd;
            margin-bottom: 1rem;
            line-height: 1.4;
            font-size: 1.5rem;
          }
          
        }
        
        /* Mobile sidenav - only show below 640px */
        @media (max-width: 639px) {
          .lro-overlay {
            width: 100vw !important;
            height: 60vh !important;
            padding: 10vw 10vw 230vw 10vw !important;
          }
          .lro-modal {
            display: flex; ;
            flex-direction: column;
            justify-content: center; /* horizontal */
            align-items: center;     /* vertical */
            height: 60vh !important;
            margin-top: 80vh !important;
            padding: 0px 5px 0px 5px !important;
            border-radius: 30px !important;
           
          }
          .lro-modal h2 {
            font-size: 2rem !important;
          }
          .lro-modal p { 
            font-size: 1rem !important;
          }
          .lro-modal img {
            width: 6rem !important;
            height: 6rem !important;
          }

          .lro-button {
            font-size: 1.5rem !important;
            width: 12rem!important;
            height: 4rem!important;
            padding: 0px 5px 0px 5px !important;
          }
           .lro-button img {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }
          
        }
        
        /* Desktop sidenav - show above 1024px */
        @media (min-width: 1024px) {
            .lro-overlay {
            width: 100vw !important;
            height: 100vh !important;
            padding: 10vw 10vw 230vw 10vw !important;
          }
          .lro-modal {
            display: flex; ;
            flex-direction: column;
            justify-content: center; /* horizontal */
            align-items: center;     /* vertical */
            width: 52vw !important;
            height: 66vh !important;
            margin-top: 80vh !important;
          }
          .lro-button {
            font-size: 1.5rem !important;
            height: 5rem !important;
          }
          .lro-button img{
            width: 40px !important;
            height: 40px !important;
          }
          .lro-icon {
            width: 110px;
            margin-bottom: 0rem;
          }
          .lro-title {
            margin: 0.5rem 0;
            font-size: 2.5rem;
            color: #ffffff;
          }
          .lro-text {
            color: #ddd;
            margin-bottom: 1rem;
            line-height: 1.4;
            font-size: 1.5rem;
          }
        }

      `}</style>
    </div>
);
}
