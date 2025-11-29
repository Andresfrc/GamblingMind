import React from 'react';
import { useAppContext } from '../context/AppContext';
import InteractiveEye from './InteractiveEye';
import '../styles/Sidebar.css';

// Importación de iconos modernos
import { Home, Settings, Wallet, User } from "lucide-react";

const Sidebar = () => {
  const { currentPage, navigateTo } = useAppContext();

  const menuItems = [
    { id: 'home', icon: <Home size={22} />, label: 'Inicio' },
    { id: 'config', icon: <Settings size={22} />, label: 'Configuración' },
    { id: 'predicts', icon: <Wallet size={22} />, label: 'Predicts' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <InteractiveEye size={80} />
        <div className="logo-text">GamblingMind</div>
        <div className="logo-tagline">Prediction System</div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => navigateTo(item.id)}
            style={{ '--index': index }}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            {currentPage === item.id && (
              <span className="active-indicator"></span>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-profile">
        <div className="profile-icon">
          <User size={24} />
        </div>
        <span className="profile-label">Perfil</span>
      </div>
    </div>
  );
};

export default Sidebar;
