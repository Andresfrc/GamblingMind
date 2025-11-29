import React from 'react';
import '../styles/GameCard.css';

const GameCard = ({ game, onClick }) => {
  const gameIcons = {
    'ruleta': '🎡',
    'poker': '🃏',
    'jackpot': '777',
    'blackjack': '🎲'
  };

  const getGameName = (game) => {
    if (game.id === 'blackjack') return 'OTRO...';
    return game.nombre.split(' ')[0].toUpperCase();
  };

  return (
    <div className="game-card" onClick={onClick}>
      <div className={`game-icon ${game.id === 'jackpot' ? 'jackpot-icon' : ''}`}>
        {gameIcons[game.id] || game.emoji}
      </div>
      <div className="game-name">
        {getGameName(game)}
      </div>
    </div>
  );
};

export default GameCard;