// Script pour insérer des missions dans la table missions de la base de données
// Usage: node scripts/insert-missions-table.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Configuration de la base de données
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

// Schéma Mission - identique à celui utilisé dans la page missions
const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  robot: { type: String, default: '' },
  status: { type: String, required: true, enum: ['Pending', 'Running', 'Completed', 'Failed'] },
  result: { type: String, required: true },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  duration: { type: String, default: '-' },
  coverage: { type: String, default: '0%' },
  description: { type: String, required: true },
  type: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical'] },
  destination: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, default: null }
}, { collection: 'missions' });

const Mission = mongoose.model('Mission', missionSchema);

// Données des missions - format identique à la page missions
const missionsData = [
  {
    name: 'Warehouse Patrol',
    robot: 'NavBot-01',
    status: 'Completed',
    result: 'Succès',
    startTime: '2025-01-19 09:30',
    endTime: '2025-01-19 10:15',
    duration: '45 min',
    coverage: '98%',
    description: 'Patrouille complète de l\'entrepôt avec cartographie SLAM',
    type: 'Patrol',
    priority: 'Normal',
    destination: 'Warehouse Zone A',
    createdAt: '2025-01-19 09:30:00',
    updatedAt: '2025-01-19 10:15:00'
  },
  {
    name: 'Zone Scan',
    robot: 'NavBot-03',
    status: 'Running',
    result: 'En cours',
    startTime: '2025-01-19 11:00',
    endTime: null,
    duration: '15 min',
    coverage: '45%',
    description: 'Scan de la zone B pour détection d\'obstacles',
    type: 'Scan',
    priority: 'High',
    destination: 'Zone B',
    createdAt: '2025-01-19 11:00:00',
    updatedAt: '2025-01-19 11:00:00'
  },
  {
    name: 'Inspection Points',
    robot: 'NavBot-02',
    status: 'Failed',
    result: 'Échec - Batterie faible',
    startTime: '2025-01-19 08:00',
    endTime: '2025-01-19 08:35',
    duration: '35 min',
    coverage: '60%',
    description: 'Inspection des points d\'intérêt critiques',
    type: 'Inspection',
    priority: 'Critical',
    destination: 'Critical Points',
    createdAt: '2025-01-19 08:00:00',
    updatedAt: '2025-01-19 08:35:00'
  },
  {
    name: 'Map Update',
    robot: 'NavBot-04',
    status: 'Completed',
    result: 'Succès',
    startTime: '2025-01-18 14:20',
    endTime: '2025-01-18 15:10',
    duration: '50 min',
    coverage: '100%',
    description: 'Mise à jour de la cartographie de l\'étage 2',
    type: 'Mapping',
    priority: 'Normal',
    destination: 'Floor 2',
    createdAt: '2025-01-18 14:20:00',
    updatedAt: '2025-01-18 15:10:00'
  },
  {
    name: 'Perimeter Check',
    robot: 'NavBot-01',
    status: 'Completed',
    result: 'Succès',
    startTime: '2025-01-18 10:00',
    endTime: '2025-01-18 11:30',
    duration: '90 min',
    coverage: '99%',
    description: 'Vérification du périmètre extérieur',
    type: 'Security',
    priority: 'High',
    destination: 'Perimeter',
    createdAt: '2025-01-18 10:00:00',
    updatedAt: '2025-01-18 11:30:00'
  },
  {
    name: 'Security Patrol',
    robot: '',
    status: 'Pending',
    result: 'En attente',
    startTime: null,
    endTime: null,
    duration: '-',
    coverage: '0%',
    description: 'Patrouille de sécurité nocturne dans la zone A',
    type: 'Security',
    priority: 'High',
    destination: 'Zone A',
    createdAt: '2025-01-19 12:00:00',
    updatedAt: null
  }
];

// Fonction principale d'insertion
async function insertMissionsTable() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('🗑️  Suppression des missions existantes dans la table missions...');
    await Mission.deleteMany({});
    
    console.log('📝 Insertion des missions dans la table missions...');
    const result = await Mission.insertMany(missionsData);
    
    console.log(`✅ ${result.length} missions insérées avec succès dans la table missions !`);
    console.log('📋 Liste des missions insérées:');
    
    missionsData.forEach((mission, index) => {
      console.log(`   - ${mission.name} (Index: ${index + 1}, Robot: ${mission.robot || 'Non assigné'}, Statut: ${mission.status})`);
    });
    
    console.log('\n🎯 Missions par statut:');
    const statusCount = {};
    missionsData.forEach(m => {
      statusCount[m.status] = (statusCount[m.status] || 0) + 1;
    });
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} missions`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des missions:', error.message);
    if (error.code === 11000) {
      console.log('💡 Conseil: Les missions existent déjà. Essayez de supprimer d\'abord la collection.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Vérification des missions dans la table
async function checkMissionsTable() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    
    const count = await Mission.countDocuments();
    const missions = await Mission.find({}).sort({ createdAt: 1 });
    
    console.log(`📊 Nombre de missions dans la table missions: ${count}`);
    
    if (missions.length > 0) {
      console.log('\n📋 Toutes les missions dans la table:');
      missions.forEach((mission, index) => {
        console.log(`   - Index: ${index + 1} | ${mission.name} | Robot: ${mission.robot || 'Non assigné'} | Statut: ${mission.status}`);
      });
    } else {
      console.log('📭 Aucune mission trouvée dans la table missions');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Suppression de toutes les missions
async function clearMissionsTable() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('🗑️  Suppression de toutes les missions de la table missions...');
    const result = await Mission.deleteMany({});
    
    console.log(`✅ ${result.deletedCount} missions supprimées de la table missions !`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2];

switch (command) {
  case 'insert':
    insertMissionsTable();
    break;
  case 'check':
    checkMissionsTable();
    break;
  case 'clear':
    clearMissionsTable();
    break;
  default:
    console.log('📖 Usage:');
    console.log('   node scripts/insert-missions-table.js insert - Insère les missions dans la table missions');
    console.log('   node scripts/insert-missions-table.js check  - Vérifie les missions dans la table missions');
    console.log('   node scripts/insert-missions-table.js clear  - Supprime toutes les missions de la table missions');
    break;
}
