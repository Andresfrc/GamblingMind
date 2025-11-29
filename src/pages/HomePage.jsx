import React from 'react';
import GameSelectionPage from './GameSelectionPage';

const HomePage = ({ onGameSelect }) => {
  return <GameSelectionPage onGameSelect={onGameSelect} />;
};

export default HomePage;