'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Bot, Map, Flag, MapPin,
  AlertTriangle, History, Settings, Gamepad2, LogOut
} from 'lucide-react';
import './sidebar.css';
import logo from './Logo_mod_1.png';

const menu = [
  { label: 'Dashboard', path: '/user/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Robots', path: '/user/robots', icon: <Bot size={18} /> },
  { label: 'Maps', path: '/user/maps', icon: <Map size={18} /> },
  { label: 'Missions', path: '/user/missions', icon: <Flag size={18} /> },
  { label: 'POI', path: '/user/poi', icon: <MapPin size={18} /> },
  { label: 'Alerts', path: '/user/alertes', icon: <AlertTriangle size={18} /> },
  { label: 'History', path: '/user/history', icon: <History size={18} /> },
  { label: 'Settings', path: '/user/settings', icon: <Settings size={18} /> },
  { label: 'Teleop', path: '/user/telecommande', icon: <Gamepad2 size={18} /> },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm("Voulez-vous vous déconnecter ?")) {
      // Nettoyer les données utilisateur
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userData');
      // Rediriger vers la page de connexion
      window.location.href = "/account/login/user";
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="logo-container">
        <img src={logo.src || logo} alt="NavBot Logo" className="topbar-logo" />
        <span className="logo-text">NavBot</span>
      </div>
      
      <ul className="sidebar-menu">
        {menu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.label} className="sidebar-item">
              <Link
                href={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {item.icon}
                <span className="link-text">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bouton de déconnexion en bas */}
      <div className="sidebar-logout">
        <button
          onClick={handleLogout}
          className="sidebar-logout-btn"
          title="Se déconnecter"
        >
          <LogOut size={18} />
          <span className="link-text">Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}