'use client';

import DashboardLayout from '@/component/layout/DashboardLayout.jsx';
import Card from '@/component/common/Card.jsx';
import ChangePasswordModal from '@/component/ChangePasswordModal.js';
import { useState, useEffect } from 'react';
import { Bot, Target, MapPin, Globe, CircleCheck, Play, Clock, Activity } from 'lucide-react';
import '../../../styles/dashboard.css';

export default function Dashboard() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [robots, setRobots] = useState([]); // Sera rempli depuis le backend
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les robots depuis le backend
  const fetchRobots = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/robots');
      const data = await response.json();
      
      // Debug: afficher les données reçues
      console.log("Données robots reçues:", data);
      
      setRobots(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des robots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les robots au montage du composant
  useEffect(() => {
    fetchRobots();
  }, []);

  // Vérifier si c'est la première connexion au chargement du dashboard
  useEffect(() => {
    const checkFirstLogin = () => {
      // Récupérer les infos utilisateur depuis le localStorage ou sessionStorage
      const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          
          // Si firstLogin est true et que le mot de passe n'a pas été changé, afficher le modal
          if (user.firstLogin && !passwordChanged) {
            setShowPasswordModal(true);
          }
        } catch (error) {
          console.error('Erreur lors de la lecture des données utilisateur:', error);
        }
      }
    };

    checkFirstLogin();
  }, []); // Supprimé passwordChanged des dépendances pour éviter les réaffichages

  const handlePasswordChangeSuccess = () => {
    setPasswordChanged(true);
    
    // Fermer immédiatement le modal
    setShowPasswordModal(false);
    
    // Mettre à jour les données utilisateur dans le localStorage (firstLogin devient false)
    if (currentUser) {
      const updatedUser = { ...currentUser, firstLogin: false };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      sessionStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Afficher le message de bienvenue
      setShowWelcomeMessage(true);
      
      // Masquer le message de bienvenue après 5 secondes
      setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
    }
  };

  const [missions] = useState([
    { id: 1, name: 'Warehouse Patrol', robot: 'NavBot-01', status: 'Running', progress: 65 },
    { id: 2, name: 'Zone Scan', robot: 'NavBot-03', status: 'Completed', progress: 100 },
    { id: 3, name: 'Map Update', robot: 'NavBot-04', status: 'Queued', progress: 0 },
  ]);

  const [recentAlerts] = useState([
    { id: 1, level: 'warning', message: 'NavBot-01 batterie à 15%', time: '5 min' },
    { id: 2, level: 'error', message: 'Obstacle détecté', time: '12 min' },
    { id: 3, level: 'info', message: 'Mission complétée', time: '30 min' },
  ]);

  const [stats, setStats] = useState({
    totalRobots: 0, // Sera mis à jour avec le nombre réel de robots
    onlineRobots: 0, // Sera calculé depuis les robots du backend
    runningMissions: 1,
    successRate: 95,
    robotsInMission: 0, // Sera calculé depuis les robots du backend
    robotsPanne: 0, // Sera calculé depuis les robots du backend
    robotsEnLigne: 0  // Sera calculé depuis les robots du backend
  });

  // Effet pour calculer les statistiques basées sur les robots réels
  useEffect(() => {
    if (robots.length > 0) {
      const totalRobots = robots.length;
      const robotsEnLigne = robots.filter(r => r.status === 'Online').length;
      const robotsEnMission = robots.filter(r => r.status === 'Idle' && r.mode === 'AUTONOMOUS').length;
      const robotsPanne = robots.filter(r => r.status === 'Offline' || r.status === 'Broken').length;
      
      setStats(prev => ({
        ...prev,
        totalRobots: totalRobots,
        robotsEnLigne: robotsEnLigne,
        robotsInMission: robotsEnMission,
        robotsPanne: robotsPanne
      }));
    }
  }, [robots]);

  const getBatteryColor = (battery) => {
    if (battery > 70) return 'battery-high';
    if (battery > 30) return 'battery-medium';
    return 'battery-low';
  };

  const getStatusColor = (status) => {
    if (status === 'Online') return 'status-online';
    if (status === 'Idle') return 'status-idle';
    return 'status-offline';
  };

  const getMissionStatusColor = (status) => {
    if (status === 'Running') return 'mission-running';
    if (status === 'Completed') return 'mission-completed';
    return 'mission-queued';
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculer le nombre de pages nécessaires
  const robotsPerPage = 4;
  const totalPages = Math.ceil(robots.length / robotsPerPage);
  const currentRobots = robots.slice(currentIndex * robotsPerPage, (currentIndex + 1) * robotsPerPage);

  // Fonctions de navigation
  const nextSlide = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <DashboardLayout>
      {/* Message de bienvenue après changement de mot de passe */}
      {showWelcomeMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right fade-in duration-500">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <CircleCheck size={24} />
            <div>
              <p className="font-semibold">Bienvenue sur Nav-Bot Platform !</p>
              <p className="text-green-100 text-sm">
                Votre mot de passe a été mis à jour avec succès
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Statistiques principales */}
      <Card title="Aperçu du Système" span={3}>
        <div className="dashboard-stats-horizontal">
          <div className="stat-box-horizontal stat-total">
            <div className="stat-icon"><Bot size={24} /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalRobots}</div>
              <div className="stat-label">Robots Total</div>
            </div>
          </div>
          <div className="stat-box-horizontal stat-enligne">
            <div className="stat-icon"><CircleCheck size={24} /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.robotsEnLigne}</div>
              <div className="stat-label">Robots en ligne</div>
            </div>
          </div>
          <div className="stat-box-horizontal stat-mission">
            <div className="stat-icon"><Target size={24} /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.robotsInMission}</div>
              <div className="stat-label">Robots en mission</div>
            </div>
          </div>
          <div className="stat-box-horizontal stat-panne">
            <div className="stat-icon"><Bot size={24} /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.robotsPanne}</div>
              <div className="stat-label">Robots en panne</div>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title={
          <div className="section-header">
            <span>État des Robots</span>
            <div className="slider-controls">
              <button 
                className="slider-arrow" 
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                ←
              </button>
              <span className="page-indicator">
                Page {currentIndex + 1} / {totalPages}
              </span>
              <button 
                className="slider-arrow" 
                onClick={nextSlide}
                disabled={currentIndex >= totalPages - 1}
              >
                →
              </button>
            </div>
          </div>
        }
        span={3}
      >
        <div className="robot-state-container">
          <h3 className="robot-state-title">
            <Activity size={18} />
            État Actuel des Robots
          </h3>
          <div className="robots-status-grid">
            {currentRobots.map(robot => (
              <div key={robot.id} className="robot-status-card">
                <div className="robot-header">
                  <div>
                    <strong className="robot-name">{robot.name}</strong>
                    <div className="robot-serial">{robot.serialNumber}</div>
                  </div>
                  <span className={`robot-badge status-${robot.status.toLowerCase()}`}>
                    {robot.status}
                  </span>
                </div>

                <div className="robot-details">
                  <div className="robot-info-line">
                    <span className="label battery-label">Batterie</span>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${robot.battery || 0}%` }}></div>
                      </div>
                      <span className="value">{robot.battery || 0}%</span>
                    </div>
                  </div>

                  <div className="robot-info-line">
                    <span className="label temp-label">Température</span>
                    <span className="value">{robot.temp || 0}°C</span>
                  </div>

               

                  <div className="robot-info-line">
                    <span className="label pos-label">Position</span>
                    <span className="value">{robot.location || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Missions en cours */}
      <Card title="Missions Actives" span={1}>
        <div className="missions-panel">
          {missions.length > 0 ? (
            missions.map(mission => (
              <div key={mission.id} className="mission-item">
                <div className="mission-header">
                  <strong>{mission.name}</strong>
                  <span className={`mission-status ${getMissionStatusColor(mission.status)}`}>
                    {mission.status === 'Running' ? <Play size={14} /> : mission.status === 'Completed' ? <CircleCheck size={14} /> : <Clock size={14} />}
                    {mission.status}
                  </span>
                </div>
                <div className="mission-robot"><Bot size={16} /> {mission.robot}</div>
                <div className="mission-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${mission.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{mission.progress}%</span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">Aucune mission</p>
          )}
        </div>
      </Card>

      {/* Alertes récentes */}
      <Card title="Alertes Récentes" span={2}>
        <div className="alerts-panel">
          {recentAlerts.length > 0 ? (
            recentAlerts.map(alert => (
              <div key={alert.id} className={`alert-item alert-${alert.level}`}>
                <div className="alert-marker"></div>
                <div className="alert-content">
                  <p className="alert-message">{alert.message}</p>
                  <span className="alert-time">{alert.time} ago</span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">Aucune alerte</p>
          )}
        </div>
      </Card>

      {/* Aperçu de la carte */}
      <Card title="Dernière Carte" span={1}>
        <div className="map-preview">
          <svg viewBox="0 0 400 300" className="preview-svg">
            <rect width="400" height="300" fill="#1a2332" />
            <defs>
              <pattern id="grid-dash" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2a3f5f" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#grid-dash)" />
            <rect x="30" y="30" width="340" height="240" fill="none" stroke="#22c55e" strokeWidth="6" />
            <circle cx="200" cy="150" r="15" fill="#22c55e" opacity="0.5" />
            <circle cx="200" cy="150" r="12" fill="none" stroke="#22c55e" strokeWidth="2" />
            <polygon points="200,135 195,150 200,145 205,150" fill="#22c55e" />
          </svg>
          <div className="map-info">
            <span><MapPin size={16} /> Étage 1</span>
            <span><Target size={16} /> 3 POI</span>
          </div>
        </div>
      </Card>

      {/* Système */}
      <Card title="État Simulation & Système" span={2}>
        <div className="system-panel">
          <div className="system-item">
            <span>GAZEBO GUI</span>
            <span className="system-value online"><CircleCheck size={16} /> Opérationnel</span>
          </div>
          <div className="system-item">
            <span>ROS 2 DOMAIN</span>
            <span className="system-value"><Globe size={16} /> ID: 42</span>
          </div>
          <div className="system-item">
            <span>RMW IMPLEMENTATION</span>
            <span className="system-value">rmw_cyclonedds_cpp</span>
          </div>
          <div className="system-item">
            <span>TURTLEBOT 4 MODEL</span>
            <span className="system-value">Standard / Lite</span>
          </div>
          <div className="system-item">
            <span>SIM TIME (RTF)</span>
            <span className="system-value">0.98x</span>
          </div>
        </div>
      </Card>
      
      {/* Modal de changement de mot de passe pour première connexion */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => {}} // Ne pas permettre de fermer sans changer le mot de passe
        userId={currentUser?.id}
        onSuccess={handlePasswordChangeSuccess}
        isForced={true} // Force l'utilisateur à changer le mot de passe
      />
    </DashboardLayout>
  );
}
