import React from 'react';
import { useAppContext } from '../context/useAppContext';
import InteractiveEye from './InteractiveEye';
import '../styles/Sidebar.css';

// Importación de iconos modernos
import { Home, Settings, Wallet, User, Activity } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { currentPage, navigateTo } = useAppContext();

  const menuItems = [
    { id: 'home', icon: <Home size={22} />, label: 'Inicio' },
    { id: 'stats', icon: <Activity size={22} />, label: 'Estadísticas' },
    { id: 'config', icon: <Settings size={22} />, label: 'Configuración' },
    { id: 'predicts', icon: <Wallet size={22} />, label: 'Predicts' }
  ];

  const handleMenuClick = (itemId) => {
    navigateTo(itemId);
    if (onClose) onClose();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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
             onClick={() => handleMenuClick(item.id)}
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
        <button 
          className="profile-btn"
          onClick={() => window.open('http://localhost/Form/vista/perfil.php', '_blank')}
          title="Abrir login/perfil"
        >
          <div className="profile-icon">
            <User size={24} />
          </div>
          <span className="profile-label">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
