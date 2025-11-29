import React, { useState, useRef } from 'react';
import '../styles/GameCard.css';

const GameCard = ({ game, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef(null);

  const gameData = {
    'ruleta': { 
      icon: '🎡', 
      color: '#dc143c',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #dc143c 100%)',
      particles: '🔴⚪⚫'
    },
    'poker': { 
      icon: '🃏', 
      color: '#2e7d32',
      gradient: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      particles: '♠️♥️♦️♣️'
    },
    'jackpot': { 
      icon: '777', 
      color: '#ffc107',
      gradient: 'linear-gradient(135deg, #ffd54f 0%, #ffc107 100%)',
      particles: '💰💎✨'
    },
    'blackjack': { 
      icon: '♠️', 
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      particles: '🎴🃏🎰'
    }
  };

  const currentGame = gameData[game.id] || gameData['ruleta'];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const getGameName = () => {
    if (game.id === 'blackjack') return 'BLACKJACK';
    return game.nombre.split(' ')[0].toUpperCase();
  };

  return (
    <div
      ref={cardRef}
      className="game-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'translateY(-20px) scale(1.05)' : 'translateY(0) scale(1)'}`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }}
    >
      <div className="game-card">
        <div 
          className="card-gradient"
          style={{
            background: currentGame.gradient,
            opacity: isHovered ? 0.15 : 0.05
          }}
        />

        <div 
          className="card-shine"
          style={{
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)'
          }}
        />

        {isHovered && (
          <div className="floating-particles">
            {currentGame.particles.split('').map((particle, i) => (
              <span
                key={i}
                className="particle"
                style={{
                  left: `${20 + i * 30}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              >
                {particle}
              </span>
            ))}
          </div>
        )}

        <div className="card-content">
          <div className={`game-icon ${game.id === 'jackpot' ? 'jackpot-icon' : ''}`}>
            {currentGame.icon}
          </div>
          
          <div className="game-name">
            {getGameName()}
          </div>

          {isHovered && (
            <div className="play-indicator">
              <span>▶ PLAY</span>
            </div>
          )}
        </div>

        <div 
          className="border-glow"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: `0 0 40px ${currentGame.color}40`
          }}
        />
      </div>
    </div>
  );
};

export default GameCard;