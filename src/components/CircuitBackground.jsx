import React from 'react';
import '../styles/CircuitBackground.css';

const CircuitBackground = () => {
  return (
    <svg className="circuit-background">
      <defs>
        <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 50 50 L 100 50" stroke="#b8a863" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="3" fill="#b8a863" />
          <path d="M 150 0 L 150 100 L 100 100" stroke="#b8a863" strokeWidth="2" fill="none" />
          <circle cx="150" cy="100" r="3" fill="#b8a863" />
          <path d="M 0 150 L 50 150 L 50 200" stroke="#b8a863" strokeWidth="2" fill="none" />
          <circle cx="50" cy="150" r="3" fill="#b8a863" />
          <path d="M 100 0 L 100 30 L 150 30" stroke="#b8a863" strokeWidth="2" fill="none" />
          <circle cx="100" cy="30" r="3" fill="#b8a863" />
          <path d="M 0 100 L 30 100 L 30 150" stroke="#b8a863" strokeWidth="2" fill="none" />
          <circle cx="30" cy="100" r="3" fill="#b8a863" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
};

export default CircuitBackground;


