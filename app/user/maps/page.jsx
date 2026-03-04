'use client';
import DashboardLayout from '@/component/layout/DashboardLayout.jsx';
import Card from '@/component/common/Card.jsx';
import { useState } from 'react';
import { Map, BarChart3, Calendar, Edit2, Copy, Download, Trash2, Plus, Layout, Zap } from 'lucide-react';
import '../../../styles/maps.css';

const mapsData = [
  { id: 1, name: 'Étage 1', description: 'Plan du premier étage', size: '2.4 MB', created: '2025-01-15', lastModified: '2025-01-18', robotCount: 3, pointsCount: 127 },
  { id: 2, name: 'Étage 2', description: 'Plan du deuxième étage', size: '1.8 MB', created: '2025-01-10', lastModified: '2025-01-17', robotCount: 1, pointsCount: 95 },
  { id: 3, name: 'Zone Externe', description: 'Parcours extérieur', size: '3.2 MB', created: '2025-01-05', lastModified: '2025-01-16', robotCount: 2, pointsCount: 234 },
  { id: 4, name: 'Laboratoire', description: 'Zone de test des robots', size: '0.9 MB', created: '2025-01-01', lastModified: '2025-01-12', robotCount: 0, pointsCount: 42 },
];

export default function Maps() {
  const [selectedMap, setSelectedMap] = useState(mapsData[0]);
  const [maps, setMaps] = useState(mapsData);

  return (
    <DashboardLayout>
      {/* 1. Liste des cartes (Gauche) */}
      <Card title={`Cartes disponibles (${maps.length})`} span={1}>
        <div className="maps-list">
          {maps.map(map => (
            <div 
              key={map.id} 
              className={`map-card-item ${selectedMap?.id === map.id ? 'active' : ''}`}
              onClick={() => setSelectedMap(map)}
            >
              <div className="map-card-icon">
                <Layout size={20} />
              </div>
              <div className="map-card-content">
                <div className="map-card-header">
                  <h4>{map.name}</h4>
                </div>
                <p>{map.description}</p>
                <div className="map-card-footer">
                  <span><BarChart3 size={12} /> {map.pointsCount} pts</span>
                  <span><Calendar size={12} /> {map.created}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Aperçu (Milieu/Droite) */}
      {selectedMap && (
        <Card title={`Aperçu: ${selectedMap.name}`} span={2}>
          <div className="map-preview-container">
            <div className="map-svg-wrapper">
               {/* SVG simplifié pour correspondre à ton image f1e7e1.png */}
               <svg className="floorplan-svg" viewBox="0 0 1000 800">
                <rect width="1000" height="800" fill="#0F172A" rx="8" />
                <rect x="50" y="50" width="900" height="700" fill="none" stroke="#22C55E" strokeWidth="8" rx="4" />
                <line x1="333" y1="50" x2="333" y2="750" stroke="#22C55E" strokeWidth="4" />
                <line x1="666" y1="50" x2="666" y2="750" stroke="#22C55E" strokeWidth="4" />
                {/* Points bleus comme sur l'image */}
                {[...Array(50)].map((_, i) => (
                  <circle key={i} cx={100 + Math.random() * 800} cy={100 + Math.random() * 600} r="3" fill="#3B82F6" opacity="0.6" />
                ))}
              </svg>
            </div>
            <div className="map-quick-stats">
              <span><Zap size={14} /> Étage 1</span>
              <span><BarChart3 size={14} /> {selectedMap.pointsCount} POI</span>
            </div>
          </div>

          <div className="map-stats-grid">
            <div className="stat-box">
              <span className="stat-label">TAILLE</span>
              <strong className="stat-value color-blue">{selectedMap.size}</strong>
            </div>
            <div className="stat-box">
              <span className="stat-label">POINTS DE REPÈRE</span>
              <strong className="stat-value color-blue">{selectedMap.pointsCount}</strong>
            </div>
            <div className="stat-box">
              <span className="stat-label">ROBOTS ACTIFS</span>
              <strong className="stat-value color-blue">{selectedMap.robotCount}</strong>
            </div>
            <div className="stat-box">
              <span className="stat-label">MODIFIÉE</span>
              <strong className="stat-value color-blue">{selectedMap.lastModified}</strong>
            </div>
          </div>
        </Card>
      )}

      {/* 3. Actions et Nouvelle Carte (Bas) */}
      <Card title="Actions" span={1}>
        <div className="actions-button-group">
          <button className="btn-outline"><Edit2 size={14} color="#F97316"/> Éditer</button>
          <button className="btn-outline"><Copy size={14} color="#6366F1"/> Dupliquer</button>
          <button className="btn-outline"><Download size={14} color="#3B82F6"/> Exporter</button>
          <button className="btn-outline btn-delete"><Trash2 size={14} color="#EF4444"/> Supprimer</button>
        </div>
      </Card>

      <Card title="Nouvelle carte" span={1}>
        <button className="btn-import-blue">
          <Plus size={18} /> Importer une carte
        </button>
      </Card>
    </DashboardLayout>
  );
}