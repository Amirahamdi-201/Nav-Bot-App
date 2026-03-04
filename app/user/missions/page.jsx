'use client';

import DashboardLayout from '@/component/layout/DashboardLayout.jsx';
import Card from '@/component/common/Card.jsx';
import { useState, useEffect } from 'react';
import { Bot, Clock, Info, RotateCcw, Trash2, Square, Download, Play, Pause, X, RefreshCw, MapPin, AlertCircle, CheckCircle, Calendar, Filter, Plus, Edit, Power, Settings } from 'lucide-react';
import '../../../styles/missions.css';

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showRobotsPopup, setShowRobotsPopup] = useState(false);
  const [selectedMissionForRobots, setSelectedMissionForRobots] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les missions depuis la base de données
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/missions');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des missions');
        }
        
        const data = await response.json();
        setMissions(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Créer une mission
  const createMission = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newMission = {
      name: formData.get('name'),
      robot: 'Non assigné',
      status: 'Pending',
      result: 'En attente',
      startTime: null,
      endTime: null,
      duration: '-',
      coverage: '0%',
      description: formData.get('description'),
      type: 'Navigation', // Type fixé sur Navigation
      priority: formData.get('priority'),
      destination: formData.get('destination'),
      startPoint: formData.get('startPoint'),
      endPoint: formData.get('endPoint'),
      waypoints: formData.get('waypoints'),
      returnToStart: formData.get('returnToStart') === 'true',
      createdAt: new Date().toLocaleString()
    };

    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMission)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la mission');
      }

      const data = await response.json();
      setMissions([...missions, data]);
      setShowCreateForm(false);
      e.target.reset();
      
      // Afficher un message de succès
      console.log('Mission de navigation créée avec succès:', data);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de la création de la mission');
    }
  };

  // Assigner une mission
  const assignMission = () => {
    if (!selectedMission) return;
    
    // Envoyer à l'API pour mettre à jour
    fetch(`/api/missions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedMission._id,
        robot: 'NavBot-01',
        status: 'Running',
        result: 'En cours',
        startTime: new Date().toLocaleString()
      })
    })
    .then(response => response.json())
    .then(data => {
      const updatedMissions = missions.map(m => 
        m._id === selectedMission._id ? data : m
      );
      setMissions(updatedMissions);
      setSelectedMission(null);
      setShowAssignForm(false);
    })
    .catch(error => {
      console.error('Erreur lors de l\'assignation:', error);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Running':
        return 'status-running';
      case 'Failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  const getResultColor = (result) => {
    if (result.includes('Succès')) return 'result-success';
    if (result.includes('cours')) return 'result-running';
    if (result.includes('Échec')) return 'result-failed';
    return '';
  };

  const filteredMissions = filterStatus === 'All' 
    ? missions 
    : missions.filter(m => m.status === filterStatus);

  const handleDeleteMission = (id) => {
    // Envoyer à l'API pour supprimer
    fetch(`/api/missions?id=${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      setMissions(missions.filter(m => m._id !== id));
      if (selectedMission?._id === id) {
        setSelectedMission(null);
      }
    })
    .catch(error => {
      console.error('Erreur lors de la suppression:', error);
    });
  };

  const showRobotsAvailable = (mission) => {
    setSelectedMissionForRobots(mission);
    setShowRobotsPopup(true);
  };

  const assignRobotFromPopup = (robotName) => {
    if (selectedMissionForRobots) {
      // Envoyer à l'API pour mettre à jour
      fetch(`/api/missions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedMissionForRobots._id,
          robot: robotName,
          status: 'Running',
          result: 'En cours',
          startTime: new Date().toLocaleString()
        })
      })
      .then(response => response.json())
      .then(data => {
        const updatedMissions = missions.map(m => 
          m._id === selectedMissionForRobots._id ? data : m
        );
        setMissions(updatedMissions);
        setShowRobotsPopup(false);
        setSelectedMissionForRobots(null);
      })
      .catch(error => {
        console.error('Erreur lors de l\'assignation:', error);
      });
    }
  };

  const retryMission = (missionId) => {
    // Envoyer à l'API pour relancer
    fetch(`/api/missions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: missionId,
        status: 'Pending',
        result: 'En attente',
        robot: '',
        endTime: null
      })
    })
    .then(response => response.json())
    .then(data => {
      const updatedMissions = missions.map(m => 
        m._id === missionId ? data : m
      );
      setMissions(updatedMissions);
    })
    .catch(error => {
      console.error('Erreur lors de la relance:', error);
    });
  };

  const stopMission = (missionId) => {
    // Envoyer à l'API pour arrêter
    fetch(`/api/missions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: missionId,
        status: 'Stopped',
        result: 'Arrêtée',
        endTime: new Date().toLocaleString()
      })
    })
    .then(response => response.json())
    .then(data => {
      const updatedMissions = missions.map(m => 
        m._id === missionId ? data : m
      );
      setMissions(updatedMissions);
    })
    .catch(error => {
      console.error('Erreur lors de l\'arrêt:', error);
    });
  };

  return (
    <DashboardLayout>
      {/* Bouton de création positionné à droite */}
      <div className="create-button-absolute-right px-8 ">
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-create-mission-tiny"
          title="Créer une mission"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nouvelle mission
        </button>
      </div>

      {/* Filtres */}
      <Card title="Missions" span={3}>
        <div className="missions-filters">
          <div className="filter-dropdown">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">Toutes les missions</option>
              <option value="Completed">Terminées</option>
              <option value="Running">En cours</option>
              <option value="Pending">Non assignées</option>
              <option value="Failed">Échouées</option>
            </select>
          </div>
        </div>

        {/* Liste des missions */}
        <div className="missions-list">
          <div className="missions-header">
            <div className="col-name">Nom</div>
            <div className="col-robot">Robot</div>
            <div className="col-status">Statut</div>
            <div className="col-result">Résultat</div>
            <div className="col-duration">Durée</div>
            <div className="col-actions">Actions</div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement des missions...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p>Erreur: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="retry-btn"
              >
                Réessayer
              </button>
            </div>
          ) : filteredMissions.length > 0 ? (
            filteredMissions.map(mission => (
              <div
                key={mission._id}
                className={`mission-row ${selectedMission?._id === mission._id ? 'selected' : ''} ${mission.priority === 'Critical' && (!mission.robot || mission.robot === '' || mission.robot === 'Non assigné') ? 'urgent-mission' : ''}`}
                onClick={() => setSelectedMission(mission)}
              >
                <div className="col-name">
                  <strong>{mission.name}</strong>
                </div>
                <div className="col-robot">
                  <span className="robot-badge">
                    <Bot size={20} /> 
                    {(!mission.robot || mission.robot === '' || mission.robot === 'Non assigné') ? 'Non assigné' : mission.robot}
                  </span>
                </div>
                <div className="col-status">
                  <span className={`status-badge ${getStatusColor(mission.status)}`}>
                    {mission.status}
                  </span>
                </div>
                <div className="col-result">
                  <span className={`result-badge ${getResultColor(mission.result)}`}>
                    {mission.result}
                  </span>
                </div>
                <div className="col-duration">
                  <span className="duration-text"><Clock size={16} /> {mission.duration}</span>
                </div>
                <div className="col-actions">
                  <button
                    className="action-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMission(mission);
                      setShowDetailsPopup(true);
                    }}
                    title="Voir les détails"
                  >
                    <Info size={16} />
                  </button>
                  {mission.status === 'Pending' && (!mission.robot || mission.robot === '' || mission.robot === 'Non assigné') && (
                    <button
                      className="action-icon-btn assign"
                      onClick={(e) => {
                        e.stopPropagation();
                        showRobotsAvailable(mission);
                      }}
                      title="Assigner un robot"
                    >
                      <Bot size={16} />
                    </button>
                  )}
                  {mission.status === 'Failed' && (
                    <button
                      className="action-icon-btn retry"
                      onClick={(e) => {
                        e.stopPropagation();
                        retryMission(mission._id);
                      }}
                      title="Relancer"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                  {mission.status === 'Running' && (
                    <button
                      className="action-icon-btn stop"
                      onClick={(e) => {
                        e.stopPropagation();
                        stopMission(mission._id);
                      }}
                      title="Arrêter"
                    >
                      <Square size={16} />
                    </button>
                  )}
                  <button
                    className="action-icon-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMission(mission._id);
                    }}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-missions">Aucune mission trouvée</div>
          )}
        </div>
      </Card>

      {/* Popup des détails de la mission */}
      {showDetailsPopup && selectedMission && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>📋 Détails: {selectedMission.name}</h2>
              <button onClick={() => setShowDetailsPopup(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mission-details">
              <div className="detail-section">
                <h4>Informations générales</h4>
                <div className="detail-row">
                  <span>Robot assigné</span>
                  <strong>{selectedMission.robot || 'Non assigné'}</strong>
                </div>
                <div className="detail-row">
                  <span>Statut</span>
                  <span className={`status-badge ${getStatusColor(selectedMission.status)}`}>
                    {selectedMission.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Résultat</span>
                  <span className={`result-badge ${getResultColor(selectedMission.result)}`}>
                    {selectedMission.result}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Chronologie</h4>
                <div className="detail-row">
                  <span>Début</span>
                  <strong>{selectedMission.startTime || 'Non démarrée'}</strong>
                </div>
                {selectedMission.endTime && (
                  <div className="detail-row">
                    <span>Fin</span>
                    <strong>{selectedMission.endTime}</strong>
                  </div>
                )}
                <div className="detail-row">
                  <span>Durée</span>
                  <strong>{selectedMission.duration}</strong>
                </div>
              </div>

              <div className="detail-section">
                <h4>Performance</h4>
                <div className="detail-row">
                  <span>Couverture</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${selectedMission.coverage}` }}
                    ></div>
                  </div>
                </div>
                <div className="detail-row">
                  <span></span>
                  <strong>{selectedMission.coverage}</strong>
                </div>
              </div>

              <div className="detail-section">
                <h4>Description</h4>
                <p className="description-text">{selectedMission.description}</p>
              </div>

              <div className="detail-actions">
                {selectedMission.status === 'Failed' && (
                  <button className="detail-btn retry-btn" onClick={() => retryMission(selectedMission.id)}>
                    <RotateCcw size={16} /> Relancer la mission
                  </button>
                )}
                {selectedMission.status === 'Running' && (
                  <button className="detail-btn stop-btn" onClick={() => stopMission(selectedMission.id)}>
                    <Square size={16} /> Arrêter
                  </button>
                )}
                <button className="detail-btn export-btn">
                  <Download size={16} /> Exporter le rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup des robots disponibles */}
      {showRobotsPopup && selectedMissionForRobots && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>🤖 Robots Disponibles</h2>
              <button onClick={() => setShowRobotsPopup(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="robots-popup-content">
              <div className="mission-info">
                <h3>{selectedMissionForRobots.name}</h3>
                <p><strong>Type:</strong> {selectedMissionForRobots.type || 'Non spécifié'}</p>
                <p><strong>Destination:</strong> {selectedMissionForRobots.destination || 'Non spécifiée'}</p>
                <p><strong>Priorité:</strong> {selectedMissionForRobots.priority || 'Normale'}</p>
                <p><strong>Description:</strong> {selectedMissionForRobots.description || 'Aucune description'}</p>
              </div>
              
              <div className="available-robots">
                <h4>Choisir un robot:</h4>
                <div className="robots-list">
                  <div className="robot-option" onClick={() => assignRobotFromPopup('NavBot-01')}>
                    <div className="robot-info">
                      <span className="robot-name">NavBot-01</span>
                      <span className="robot-status status-online">Disponible</span>
                      <span className="robot-battery">87%</span>
                    </div>
                  </div>
                  <div className="robot-option" onClick={() => assignRobotFromPopup('NavBot-02')}>
                    <div className="robot-info">
                      <span className="robot-name">NavBot-02</span>
                      <span className="robot-status status-online">Disponible</span>
                      <span className="robot-battery">65%</span>
                    </div>
                  </div>
                  <div className="robot-option" onClick={() => assignRobotFromPopup('NavBot-03')}>
                    <div className="robot-info">
                      <span className="robot-name">NavBot-03</span>
                      <span className="robot-status status-online">Disponible</span>
                      <span className="robot-battery">92%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="popup-actions">
                <button onClick={() => setShowRobotsPopup(false)}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de création de mission */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>🚀 Créer une Mission</h2>
              <button onClick={() => setShowCreateForm(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={createMission} className="mission-form">
              <div className="form-group">
                <label>Nom de la mission:</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ex: Navigation Zone A vers Point B"
                  required 
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Type de mission:</label>
                <input 
                  type="text" 
                  name="type" 
                  value="Navigation" 
                  disabled
                  className="form-input disabled-input"
                  style={{ 
                    backgroundColor: '#f5f5f5', 
                    color: '#666', 
                    cursor: 'not-allowed',
                    border: '2px solid #ddd'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  Le type de mission est fixé sur Navigation
                </small>
              </div>
              
              <div className="form-group">
                <label>Point de départ:</label>
                <input 
                  type="text" 
                  name="startPoint" 
                  placeholder="X: 0, Y: 0 (base du robot)"
                  required 
                  className="form-input"
                />
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  Coordonnées de départ du robot
                </small>
              </div>
              
              <div className="form-group">
                <label>Point d'arrivée:</label>
                <input 
                  type="text" 
                  name="endPoint" 
                  placeholder="X: 45, Y: 78 (destination)"
                  required 
                  className="form-input"
                />
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  Coordonnées de destination finale
                </small>
              </div>
              
              <div className="form-group">
                <label>Points de passage (optionnel):</label>
                <textarea 
                  name="waypoints" 
                  placeholder="X: 15, Y: 30&#10;X: 25, Y: 45&#10;X: 35, Y: 60"
                  rows="3"
                  className="form-textarea"
                />
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  Un point par ligne. Le robot passera par ces points dans l'ordre.
                </small>
              </div>
              
              <div className="form-group">
                <label>Retour au point de départ:</label>
                <select name="returnToStart" required className="form-input">
                  <option value="true">Oui - Le robot retourne à son point de départ</option>
                  <option value="false">Non - Le robot reste à la destination</option>
                </select>
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  La mission est considérée comme complétée lorsque le robot retourne à son point de départ
                </small>
              </div>
              
              <div className="form-group">
                <label>Priorité:</label>
                <select name="priority" required className="form-input">
                  <option value="">Sélectionner...</option>
                  <option value="Low">Basse</option>
                  <option value="Normal">Normale</option>
                  <option value="High">Haute</option>
                  <option value="Critical">Urgente</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  placeholder="Description détaillée de la mission de navigation..."
                  rows="3"
                  className="form-textarea"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </button>
                <button type="submit">
                  Créer Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire d'attribution de mission */}
      {showAssignForm && selectedMission && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>🤖 Attribution de Mission</h2>
              <button onClick={() => setShowAssignForm(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="assign-content">
              <div className="assign-info">
                <h3>{selectedMission.name}</h3>
                <p><strong>Type:</strong> {selectedMission.type || 'Non spécifié'}</p>
                <p><strong>Destination:</strong> {selectedMission.destination || 'Non spécifiée'}</p>
                <p><strong>Priorité:</strong> {selectedMission.priority || 'Normale'}</p>
                <p><strong>Description:</strong> {selectedMission.description || 'Aucune description'}</p>
              </div>
              
              <div className="available-robots">
                <h4>🤖 Robots Disponibles:</h4>
                <div className="robots-list">
                  <div className="robot-option">
                    <div className="robot-info">
                      <span className="robot-name">NavBot-01</span>
                      <span className="robot-status status-online">Online</span>
                      <span className="robot-battery">87%</span>
                    </div>
                  </div>
                  <div className="robot-option">
                    <div className="robot-info">
                      <span className="robot-name">NavBot-02</span>
                      <span className="robot-status status-online">Online</span>
                      <span className="robot-battery">65%</span>
                    </div>
                  </div>
                  <div className="robot-option">
                    <div className="robot-info">
                      <span className="robot-name">NavBot-03</span>
                      <span className="robot-status status-idle">Idle</span>
                      <span className="robot-battery">92%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="assign-actions">
                <button onClick={() => setShowAssignForm(false)}>
                  Annuler
                </button>
                <button onClick={assignMission}>
                  Assigner automatiquement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
