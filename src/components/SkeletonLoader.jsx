import React from 'react';
import '../styles/SkeletonLoader.css';

const SkeletonLoader = ({ count = 3, variant = 'card' }) => {
  if (variant === 'card') {
    return (
      <div className="skeleton-container">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-header"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'details') {
    return (
      <div className="skeleton-details">
        <div className="skeleton-line full"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
