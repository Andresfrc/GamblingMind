import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeTransition.css';

const ThemeTransition = () => {
  const { isTransitioning } = useTheme();

  if (!isTransitioning) return null;

  return <div className="theme-transition-overlay" />;
};

export default ThemeTransition;
