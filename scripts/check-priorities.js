const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority';

const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  robot: { type: String, default: '' },
  status: { type: String, required: true },
  result: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical'] },
}, { collection: 'missions' });

const Mission = mongoose.models.Mission || mongoose.model('Mission', missionSchema);

async function checkPriorities() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const missions = await Mission.find({}).select('name robot priority status');
    
    console.log('📋 Missions avec priorité et robot:');
    missions.forEach(m => {
      const hasNoRobot = !m.robot || m.robot === '' || m.robot === 'Non assigné';
      const isCritical = m.priority === 'Critical';
      const shouldShowUrgent = hasNoRobot && isCritical;
      
      console.log(`- ${m.name}`);
      console.log(`  Robot: ${m.robot || 'Non assigné'} | Priorité: ${m.priority}`);
      console.log(`  → Non assigné: ${hasNoRobot} | Critique: ${isCritical}`);
      console.log(`  → Afficher URGENT: ${shouldShowUrgent}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkPriorities();
