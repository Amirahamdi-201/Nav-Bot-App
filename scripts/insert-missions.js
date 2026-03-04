// Script pour insérer des missions dans la base de données
// Usage: node scripts/insert-missions.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Configuration de la base de données
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

// Schéma Mission
const missionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  robot: { type: String, default: '' },
  status: { type: String, required: true, enum: ['Pending', 'Running', 'Completed', 'Failed'] },
  result: { type: String, required: true },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  duration: { type: String, default: '-' },
  coverage: { type: String, default: '0%' },
  description: { type: String, required: true },
  type: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical'] },
  destination: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Mission = mongoose.model('Mission', missionSchema);

// Missions à insérer
const missionsToInsert = [
  {
    id: 1,
    name: 'Warehouse Patrol',
    robot: 'NavBot-01',
    status: 'Completed',
    result: 'Succès',
    startTime: new Date('2025-01-19T09:30:00'),
    endTime: new Date('2025-01-19T10:15:00'),
    duration: '45 min',
    coverage: '98%',
    description: 'Patrouille complète de l\'entrepôt avec cartographie SLAM',
    type: 'Patrol',
    priority: 'Normal',
    destination: 'Warehouse Zone A'
  },
  {
    id: 2,
    name: 'Zone Scan',
    robot: 'NavBot-03',
    status: 'Running',
    result: 'En cours',
    startTime: new Date('2025-01-19T11:00:00'),
    endTime: null,
    duration: '15 min',
    coverage: '45%',
    description: 'Scan de la zone B pour détection d\'obstacles',
    type: 'Scan',
    priority: 'High',
    destination: 'Zone B'
  },
  {
    id: 3,
    name: 'Inspection Points',
    robot: 'NavBot-02',
    status: 'Failed',
    result: 'Échec - Batterie faible',
    startTime: new Date('2025-01-19T08:00:00'),
    endTime: new Date('2025-01-19T08:35:00'),
    duration: '35 min',
    coverage: '60%',
    description: 'Inspection des points d\'intérêt critiques',
    type: 'Inspection',
    priority: 'Critical',
    destination: 'Critical Points'
  },
  {
    id: 4,
    name: 'Map Update',
    robot: 'NavBot-04',
    status: 'Completed',
    result: 'Succès',
    startTime: new Date('2025-01-18T14:20:00'),
    endTime: new Date('2025-01-18T15:10:00'),
    duration: '50 min',
    coverage: '100%',
    description: 'Mise à jour de la cartographie de l\'étage 2',
    type: 'Mapping',
    priority: 'Normal',
    destination: 'Floor 2'
  },
  {
    id: 5,
    name: 'Perimeter Check',
    robot: 'NavBot-01',
    status: 'Completed',
    result: 'Succès',
    startTime: new Date('2025-01-18T10:00:00'),
    endTime: new Date('2025-01-18T11:30:00'),
    duration: '90 min',
    coverage: '99%',
    description: 'Vérification du périmètre extérieur',
    type: 'Security',
    priority: 'High',
    destination: 'Perimeter'
  },
  {
    id: 6,
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
    destination: 'Zone A'
  }
];

async function insertMissions() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('🗑️  Suppression des missions existantes...');
    await Mission.deleteMany({});
    
    console.log('📝 Insertion des nouvelles missions...');
    const result = await Mission.insertMany(missionsToInsert);
    
    console.log(`✅ ${result.length} missions insérées avec succès !`);
    console.log('📋 Liste des missions insérées:');
    
    missionsToInsert.forEach(mission => {
      console.log(`   - ${mission.name} (ID: ${mission.id}, Statut: ${mission.status})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des missions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Fonction pour générer des missions aléatoires
function generateRandomMissions(count = 10) {
  const missionTypes = ['Patrol', 'Scan', 'Inspection', 'Mapping', 'Security', 'Emergency', 'Delivery'];
  const priorities = ['Low', 'Normal', 'High', 'Critical'];
  const statuses = ['Pending', 'Running', 'Completed', 'Failed'];
  const robots = ['NavBot-01', 'NavBot-02', 'NavBot-03', 'NavBot-04', ''];
  
  const missions = [];
  const startId = Date.now();
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hasRobot = status !== 'Pending' && Math.random() > 0.3;
    const robot = hasRobot ? robots[Math.floor(Math.random() * (robots.length - 1))] : '';
    
    const mission = {
      id: startId + i,
      name: `Mission ${startId + i} - ${missionTypes[Math.floor(Math.random() * missionTypes.length)]}`,
      robot: robot,
      status: status,
      result: status === 'Pending' ? 'En attente' : 
              status === 'Running' ? 'En cours' :
              status === 'Completed' ? 'Succès' : 'Échec',
      startTime: status !== 'Pending' ? new Date(Date.now() - Math.random() * 86400000).toISOString() : null,
      endTime: status === 'Completed' || status === 'Failed' ? new Date(Date.now() - Math.random() * 3600000).toISOString() : null,
      duration: status === 'Pending' ? '-' : `${Math.floor(Math.random() * 120) + 10} min`,
      coverage: status === 'Pending' ? '0%' : `${Math.floor(Math.random() * 100)}%`,
      description: `Description de la mission ${startId + i}`,
      type: missionTypes[Math.floor(Math.random() * missionTypes.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      destination: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      createdAt: new Date(Date.now() - Math.random() * 86400000),
      updatedAt: new Date()
    };
    
    missions.push(mission);
  }
  
  return missions;
}

// Commande pour insérer des missions aléatoires
async function insertRandomMissions(count = 10) {
  try {
    console.log(`🔄 Génération de ${count} missions aléatoires...`);
    const randomMissions = generateRandomMissions(count);
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('📝 Insertion des missions aléatoires...');
    const result = await Mission.insertMany(randomMissions);
    
    console.log(`✅ ${result.length} missions aléatoires insérées !`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des missions aléatoires:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Vérification des missions existantes
async function checkMissions() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const count = await Mission.countDocuments();
    const missions = await Mission.find({}).sort({ id: 1 }).limit(5);
    
    console.log(`📊 Nombre de missions dans la base: ${count}`);
    
    if (missions.length > 0) {
      console.log('📋 Dernières missions:');
      missions.forEach(mission => {
        console.log(`   - ${mission.name} (ID: ${mission.id}, Statut: ${mission.status})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2];

switch (command) {
  case 'insert':
    insertMissions();
    break;
  case 'random':
    const count = parseInt(process.argv[3]) || 10;
    insertRandomMissions(count);
    break;
  case 'check':
    checkMissions();
    break;
  default:
    console.log('📖 Usage:');
    console.log('   node scripts/insert-missions.js insert    - Insère les missions prédéfinies');
    console.log('   node scripts/insert-missions.js random [n] - Génère et insère n missions aléatoires (défaut: 10)');
    console.log('   node scripts/insert-missions.js check     - Vérifie les missions existantes');
    break;
}
