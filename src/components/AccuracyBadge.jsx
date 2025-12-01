import React from 'react';
import '../styles/AccuracyBadge.css';

const AccuracyBadge = ({ isCorrect, reason, stats }) => {
  if (isCorrect === null) return null;

  return (
    <div className={`accuracy-container`}>
      <div className={`accuracy-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
        <span className="accuracy-icon">
          {isCorrect ? '✅' : '❌'}
        </span>
        <span className="accuracy-text">
          {isCorrect ? 'PREDICCIÓN CORRECTA' : 'PREDICCIÓN INCORRECTA'}
        </span>
      </div>
      
      {reason && (
        <div className="accuracy-reason">
          {reason}
        </div>
      )}

      {stats && stats.total > 0 && (
        <div className="accuracy-stats">
          <span className="stat-label">Precisión:</span>
          <span className={`stat-value ${stats.percentage >= 50 ? 'good' : 'poor'}`}>
            {stats.correct}/{stats.total} ({stats.percentage}%)
          </span>
        </div>
      )}
    </div>
  );
};

export default AccuracyBadge;
