// Script pour réinitialiser complètement la collection missions
// Usage: node scripts/reset-missions-collection.js

const mongoose = require("mongoose");

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

// Fonction pour réinitialiser la collection
async function resetMissionsCollection() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    
    // Supprimer complètement la collection (y compris les index)
    console.log('🗑️  Suppression complète de la collection missions...');
    await mongoose.connection.db.dropCollection('missions');
    
    console.log('✅ Collection missions supprimée avec succès !');
    console.log('🔄 Recréation de la collection missions...');
    
    // Attendre un peu pour que MongoDB recrée la collection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Collection missions prête à être utilisée !');
    
  } catch (error) {
    if (error.code === 26) {
      console.log('ℹ️  La collection n\'existait pas, c\'est normal.');
    } else {
      console.error('❌ Erreur lors de la réinitialisation:', error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Vérification après réinitialisation
async function checkAfterReset() {
  try {
    console.log('🔄 Connexion à la base de données...');
    await mongoose.connect(MONGODB_URI);
    
    const count = await Mission.countDocuments();
    console.log(`📊 Nombre de documents dans la collection missions: ${count}`);
    
    if (count === 0) {
      console.log('✅ Collection missions est vide, prête pour l\'insertion !');
    } else {
      console.log('⚠️  La collection contient encore des données.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2];

switch (command) {
  case 'reset':
    resetMissionsCollection();
    break;
  case 'check':
    checkAfterReset();
    break;
  default:
    console.log('📖 Usage:');
    console.log('   node scripts/reset-missions-collection.js reset - Supprime et recrée la collection missions');
    console.log('   node scripts/reset-missions-collection.js check - Vérifie l\'état de la collection missions');
    break;
}
