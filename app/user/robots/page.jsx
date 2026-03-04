'use client';

import DashboardLayout from '@/component/layout/DashboardLayout.jsx';
import Card from '@/component/common/Card.jsx';
import { useState } from 'react';
import { Circle } from 'lucide-react';
import '../../../styles/robots.css';

const robotsData = [
  { id: 1, name: 'NavBot-01', serialNumber: 'TB4-2026-001', status: 'Online', battery: 87, temperature: 24, mode: 'AUTONOMOUS', location: 'Zone A', lastSeen: 'Now', mission: 'Patrouille Entrepôt' },
  { id: 2, name: 'NavBot-02', serialNumber: 'TB4-2026-002', status: 'Offline', battery: 0, temperature: 22, mode: 'IDLE', location: 'Charging Station', lastSeen: '5m ago', mission: 'Aucune' },
  { id: 3, name: 'NavBot-03', serialNumber: 'TB4-2026-003', status: 'Online', battery: 65, temperature: 26, mode: 'MANUAL', location: 'Zone B', lastSeen: 'Now', mission: 'Cartographie' },
  { id: 4, name: 'NavBot-04', serialNumber: 'TB4-2026-004', status: 'Idle', battery: 92, temperature: 23, mode: 'IDLE', location: 'Base', lastSeen: '2m ago', mission: 'En attente' },
  { id: 5, name: 'NavBot-05', serialNumber: 'TB4-2026-005', status: 'Offline', battery: 0, temperature: 25, mode: 'IDLE', location: 'Service', lastSeen: '1h ago', mission: 'Maintenance' },
];

export default function Robots() {
  const [selectedRobot, setSelectedRobot] = useState(null);

  // Séparer les robots par statut
  const onlineRobots = robotsData.filter(r => r.status === 'Online');
  const idleRobots = robotsData.filter(r => r.status === 'Idle');
  const offlineRobots = robotsData.filter(r => r.status === 'Offline');

  // Gestion du contrôle des missions
  const handleMissionControl = (robot) => {
    if (robot.status === 'Online' && robot.mission !== 'Aucune') {
      alert(`Mission "${robot.mission}" mise en pause pour ${robot.name}`);
    } else if (robot.status === 'Online') {
      alert(`Démarrage d'une nouvelle mission pour ${robot.name}`);
    } else {
      alert(`Impossible de contrôler ${robot.name} - robot hors ligne`);
    }
  };

  // Gestion des détails techniques
  const handleTechnicalDetails = (robot) => {
    setSelectedRobot(robot);
  };

  const RobotRow = ({ robot }) => (
    <div
      key={robot.id}
      className={`robot-row ${selectedRobot?.id === robot.id ? 'selected' : ''}`}
      onClick={() => setSelectedRobot(robot)}
    >
      <div className="robot-name">
        <div className={`status-indicator status-${robot.status.toLowerCase()}`}></div>
        <div>
          <strong>{robot.name}</strong>
          <div className="robot-serial">{robot.serialNumber}</div>
        </div>
      </div>
      <div className="robot-battery">
        <div className="battery-bar">
          <div
            className="battery-fill"
            style={{
              width: `${robot.battery}%`,
              backgroundColor: robot.battery > 50 ? '#22c55e' : robot.battery > 20 ? '#eab308' : '#ef4444',
            }}
          ></div>
        </div>
        <span>{robot.battery}%</span>
      </div>
      <div className="robot-location">{robot.location}</div>
      <div className="robot-mission">{robot.mission}</div>
      <div className="robot-lastseen">{robot.lastSeen}</div>
      <div className="robot-actions">
        <button className="robot-action-btn primary" onClick={(e) => { e.stopPropagation(); handleMissionControl(robot); }}>
          {robot.status === 'Online' && robot.mission !== 'Aucune' ? '⏸️ Pause' : '▶️ Démarrer'}
        </button>
        <button className="robot-action-btn secondary" onClick={(e) => { e.stopPropagation(); setSelectedRobot(robot); }}>
          🔧 Détails
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <Card title={`Robots Fleet (${robotsData.length})`} span={2}>
        <div className="robots-list">
          {/* Robots en ligne */}
          <div className="robots-section">
            <h3 className="section-title online">
              <Circle size={16} fill="#22c55e" color="#22c55e" /> En ligne ({onlineRobots.length})
            </h3>
            <div className="robots-group">
              {onlineRobots.length > 0 ? (
                onlineRobots.map(robot => <RobotRow key={robot.id} robot={robot} />)
              ) : (
                <p className="empty-state">Aucun robot en ligne</p>
              )}
            </div>
          </div>

          {/* Robots en attente */}
          <div className="robots-section">
            <h3 className="section-title idle">
              <Circle size={16} fill="#eab308" color="#eab308" /> En attente ({idleRobots.length})
            </h3>
            <div className="robots-group">
              {idleRobots.length > 0 ? (
                idleRobots.map(robot => <RobotRow key={robot.id} robot={robot} />)
              ) : (
                <p className="empty-state">Aucun robot en attente</p>
              )}
            </div>
          </div>

          {/* Robots hors ligne */}
          <div className="robots-section">
            <h3 className="section-title offline">
              <Circle size={16} fill="#ef4444" color="#ef4444" /> Hors ligne ({offlineRobots.length})
            </h3>
            <div className="robots-group">
              {offlineRobots.length > 0 ? (
                offlineRobots.map(robot => <RobotRow key={robot.id} robot={robot} />)
              ) : (
                <p className="empty-state">Aucun robot hors ligne</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Détails du robot sélectionné */}
      {selectedRobot && (
        <Card title={`🔧 Détails Techniques: ${selectedRobot.name}`} span={1}>
          <div className="robot-details">
            <div className="detail-section">
              <h4>📊 Informations Générales</h4>
              <div className="detail-row">
                <span>Numéro de Série</span>
                <strong className="serial-number">{selectedRobot.serialNumber}</strong>
              </div>
              <div className="detail-row">
                <span>Statut</span>
                <strong className={`status-text status-${selectedRobot.status.toLowerCase()}`}>
                  {selectedRobot.status}
                </strong>
              </div>
              <div className="detail-row">
                <span>Mode</span>
                <strong>{selectedRobot.mode}</strong>
              </div>
              <div className="detail-row">
                <span>Localisation</span>
                <strong>{selectedRobot.location}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h4>🔋 Supervision</h4>
              <div className="detail-row">
                <span>Batterie</span>
                <div className="battery-display">
                  <div className="battery-bar">
                    <div
                      className="battery-fill"
                      style={{
                        width: `${selectedRobot.battery}%`,
                        backgroundColor: selectedRobot.battery > 50 ? '#22c55e' : selectedRobot.battery > 20 ? '#eab308' : '#ef4444',
                      }}
                    ></div>
                  </div>
                  <span>{selectedRobot.battery}%</span>
                </div>
              </div>
              <div className="detail-row">
                <span>Température</span>
                <strong className={selectedRobot.temperature > 30 ? 'temp-high' : selectedRobot.temperature > 25 ? 'temp-medium' : 'temp-normal'}>
                  {selectedRobot.temperature}°C
                </strong>
              </div>
              <div className="detail-row">
                <span>Dernier contact</span>
                <strong>{selectedRobot.lastSeen}</strong>
              </div>
            </div>

            <div className="detail-section">
              <h4>🚀 Contrôle Mission</h4>
              <div className="detail-row">
                <span>Mission Actuelle</span>
                <strong>{selectedRobot.mission}</strong>
              </div>
              <div className="mission-controls">
                <button 
                  className={`mission-btn ${selectedRobot.status === 'Online' ? 'primary' : 'disabled'}`}
                  onClick={() => selectedRobot.status === 'Online' && handleMissionControl(selectedRobot)}
                  disabled={selectedRobot.status !== 'Online'}
                >
                  {selectedRobot.status === 'Online' && selectedRobot.mission !== 'Aucune' ? '⏸️ Pause Mission' : '▶️ Démarrer Mission'}
                </button>
                <button className="mission-btn secondary">
                  📋 Voir Logs
                </button>
              </div>
            </div>

            <div className="detail-section">
              <h4>🔧 Actions Techniques</h4>
              <div className="tech-actions">
                <button className="tech-btn">
                  🔄 Redémarrer
                </button>
                <button className="tech-btn">
                  📡 Téléportation
                </button>
                <button className="tech-btn">
                  ⚙️ Configuration
                </button>
                <button className="tech-btn danger">
                  🛑 Arrêt d'Urgence
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
