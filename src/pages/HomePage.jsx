import React from 'react';
import GameSelectionPage from './GameSelectionPage';
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = ({ onGameSelect }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground />
      <GameSelectionPage onGameSelect={onGameSelect} />
    </div>
  );
};

export default HomePage;