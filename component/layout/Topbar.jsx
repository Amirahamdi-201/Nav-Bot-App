'use client';

import { useState, useEffect } from 'react';
import { Bell, User, Menu, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import './topbar.css';

export default function TopBar({ onMenuClick = () => {}, onNotificationsClick = () => {} }) {
  const router = useRouter(); 
  const [isDark, setIsDark] = useState(false);

  // Synchroniser l'état avec la classe sur le document au montage
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      // Si tu utilises la classe dark-mode comme discuté avant :
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <header className="topbar" role="banner">
      <div className="topbar-menu-btn">
        <button 
          className="menu-button"
          onClick={onMenuClick}
          title="Menu"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="topbar-actions" role="toolbar" aria-label="Actions">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
          aria-label="Changer le thème"
        >
          {isDark ? (
            <Sun size={18} className="theme-icon sun" />
          ) : (
            <Moon size={18} className="theme-icon moon" />
          )}
        </button>

        <button
          className="notifications-button"
          onClick={onNotificationsClick}
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          className="profile-button"
          onClick={() => router.push('/user/profile')} 
          title="Profil"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
}