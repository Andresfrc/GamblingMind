
import React from 'react';
import { useAppContext } from '../context/AppContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { currentPage, navigateTo } = useAppContext();

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Inicio' },
    { id: 'config', icon: '⚙️', label: 'Configuración' },
    { id: 'predicts', icon: '💰', label: 'Predicts' }
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">👁️</div>
        <div className="logo-text">GamblingMind</div>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => navigateTo(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="profile-icon">👤</div>
        <span className="profile-label">Perfil</span>
      </div>
    </div>
  );
};

export default Sidebar;