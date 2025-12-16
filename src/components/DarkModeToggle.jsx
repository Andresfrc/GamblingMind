import React from 'react';
import { useTheme } from '../context/useTheme';
import '../styles/DarkModeToggle.css';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
      aria-label="Cambiar tema"
    >
      <span className="toggle-icon">
        {isDarkMode ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default DarkModeToggle;
