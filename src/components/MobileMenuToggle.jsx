import React from 'react';
import { Menu, X } from 'lucide-react';
import '../styles/MobileMenuToggle.css';

export default function MobileMenuToggle({ isOpen, onToggle }) {
  return (
    <button 
      className="mobile-menu-toggle" 
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}
