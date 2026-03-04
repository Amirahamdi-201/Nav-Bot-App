const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority';

const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  robot: { type: String, default: '' },
  status: { type: String, required: true, enum: ['Pending', 'Running', 'Completed', 'Failed'] },
  result: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical'] },
  destination: { type: String, required: true },
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { collection: 'missions' });

const Mission = mongoose.models.Mission || mongoose.model('Mission', missionSchema);

async function createTestMissions() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Mission critique SANS robot (devrait afficher URGENT)
    const urgent1 = new Mission({
      name: 'Panne système critique',
      robot: '',
      status: 'Pending',
      result: 'En attente',
      priority: 'Critical',
      destination: 'X: 0, Y: 0 → X: 100, Y: 100',
      startPoint: 'X: 0, Y: 0',
      endPoint: 'X: 100, Y: 100',
      description: 'Panne système nécessitant intervention immédiate',
      type: 'Navigation',
      createdAt: new Date().toLocaleString()
    });
    
    // Mission critique AVEC robot (ne devrait PAS afficher URGENT)
    const urgent2 = new Mission({
      name: 'Alerte sécurité - Robot assigné',
      robot: 'NavBot-01',
      status: 'Running',
      result: 'En cours',
      priority: 'Critical',
      destination: 'X: 50, Y: 50 → X: 75, Y: 75',
      startPoint: 'X: 50, Y: 50',
      endPoint: 'X: 75, Y: 75',
      description: 'Alerte sécurité mais robot déjà assigné',
      type: 'Navigation',
      createdAt: new Date().toLocaleString()
    });
    
    await urgent1.save();
    await urgent2.save();
    
    console.log('✅ Missions de test créées !');
    console.log('🔥 "Panne système critique" → Affichera URGENT (Critical + Non assigné)');
    console.log('🤖 "Alerte sécurité - Robot assigné" → N\'affichera PAS URGENT (Critical + Robot assigné)');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createTestMissions();
