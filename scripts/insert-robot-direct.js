#!/usr/bin/env node

// Script pour insérer directement un robot dans la table robots MongoDB
// Usage: node scripts/insert-robot-direct.js

const mongoose = require('mongoose');


// Schema Robot directement dans le script (pas besoin du fichier externe)
const RobotSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  model: { type: String, required: true },
  status: { type: String, default: 'offline' },
  currentState: {
    battery: { type: Number, default: 100 },
    temperature: { type: Number, default: 25.0 },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      orientation: { type: Number, default: 0 }
    },
    lastUpdate: { type: Date, default: Date.now }
  },
  sensors: {
    lidar: { type: Boolean, default: false },
    camera: { type: Boolean, default: false },
    imu: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Robot = mongoose.model('Robot', RobotSchema);

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority';

const insertRobotDirect = async () => {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à la base de données');

    // Données du robot idle
    const robotData = {
      serialNumber: `TB4-IDLE-${Date.now()}`,
      name: `Robot-Idle-${Date.now()}`,
      model: "TurtleBot4",
      status: "idle", // Statut idle
      currentState: {
        battery: 85,
        temperature: 24.5,
        position: {
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100),
          orientation: 0
        },
        lastUpdate: new Date()
      },
      sensors: {
        lidar: true,
        camera: true,
        imu: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('🤖 Insertion directe dans la table robots...');
    console.log('📋 Données à insérer:');
    console.log(JSON.stringify(robotData, null, 2));

    // Vérifier si le numéro de série existe déjà
    const existingRobot = await Robot.findOne({ serialNumber: robotData.serialNumber });
    if (existingRobot) {
      console.log('❌ Ce numéro de série existe déjà');
      await mongoose.disconnect();
      return;
    }

    // Insérer directement dans la base
    const newRobot = new Robot(robotData);
    const savedRobot = await newRobot.save();

    console.log('\n✅ Robot inséré avec succès dans MongoDB!');
    console.log('📋 Détails du robot:');
    console.log(`   ID: ${savedRobot._id}`);
    console.log(`   Nom: ${savedRobot.name}`);
    console.log(`   Série: ${savedRobot.serialNumber}`);
    console.log(`   Modèle: ${savedRobot.model}`);
    console.log(`   Statut: ${savedRobot.status} (idle - JAUNE dans l'interface)`);
    console.log(`   Batterie: ${savedRobot.currentState.battery}%`);
    console.log(`   Température: ${savedRobot.currentState.temperature}°C`);
    console.log(`   Position: X=${savedRobot.currentState.position.x}, Y=${savedRobot.currentState.position.y}`);
    console.log(`   Capteurs: LIDAR=${savedRobot.sensors.lidar ? 'ON' : 'OFF'}, Camera=${savedRobot.sensors.camera ? 'ON' : 'OFF'}, IMU=${savedRobot.sensors.imu ? 'ON' : 'OFF'}`);
    console.log(`   Créé le: ${savedRobot.createdAt.toLocaleString()}`);
    console.log('');
    console.log('🎨 Le robot apparaîtra en JAUNE dans:');
    console.log('   - Dashboard: grille avec badge jaune');
    console.log('   - Page Robots: section "En attente"');
    console.log('   - Tableau: badge jaune avec bordure');
    console.log('');
    console.log('💡 Le robot est maintenant dans la base de données!');
    console.log('💡 Rafraîchissez le dashboard pour voir le robot');

    // Vérifier l'insertion
    const count = await Robot.countDocuments({ status: 'idle' });
    console.log(`\n📊 Total de robots idle dans la base: ${count}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 Ce numéro de série existe déjà');
    } else if (error.name === 'ValidationError') {
      console.error('💡 Erreur de validation des données');
      console.error('📋 Détails de l\'erreur:', error.errors);
    } else if (error.name === 'MongoNetworkError') {
      console.error('💡 Erreur de connexion MongoDB');
      console.error('💡 Assurez-vous que MongoDB est en cours d\'exécution');
    }
    
    process.exit(1);
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }
};

// Vérifier la connexion MongoDB avant de commencer
const checkMongoConnection = async () => {
  try {
    console.log('🔍 Test de connexion MongoDB...');
    await mongoose.connect(MONGODB_URI);
    await mongoose.disconnect();
    console.log('✅ Connexion MongoDB réussie');
    return true;
  } catch (error) {
    console.log('❌ Impossible de se connecter à MongoDB');
    console.log('💡 Assurez-vous que MongoDB est en cours d\'exécution');
    console.log('💡 Vérifiez que MongoDB est accessible sur:', MONGODB_URI);
    return false;
  }
};

// Menu principal
const main = async () => {
  console.log('🤖 Script d\'insertion directe dans MongoDB');
  console.log('======================================');

  // Vérifier la connexion
  const mongoConnected = await checkMongoConnection();
  if (!mongoConnected) {
    process.exit(1);
  }

  // Insérer le robot
  await insertRobotDirect();
};

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { insertRobotDirect };
