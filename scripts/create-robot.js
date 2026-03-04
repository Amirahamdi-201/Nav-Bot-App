const mongoose = require("mongoose");

/* ================================
   1️⃣ Schéma Robot (identique au modèle)
================================ */
const robotSchema = new mongoose.Schema({
  serialNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  model: { 
    type: String, 
    required: true, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ["online", "offline", "mission", "emergency"], 
    default: "offline" 
  },
  currentState: {
    battery: { 
      type: Number, 
      min: 0, 
      max: 100, 
      default: 0 
    },
    temperature: { 
      type: Number, 
      default: 0 
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      orientation: { type: Number, default: 0 }
    },
    lastUpdate: { 
      type: Date, 
      default: Date.now 
    }
  },
  sensors: {
    lidar: { type: Boolean, default: false },
    camera: { type: Boolean, default: false },
    imu: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
});

const Robot = mongoose.models?.Robot || mongoose.model("Robot", robotSchema);

console.log("🤖 Script de création de robot lancé");

/* ================================
   2️⃣ URI MongoDB
================================ */
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

/* ================================
   3️⃣ Fonction principale
================================ */
async function main() {
  const type = process.argv[2]; // online | offline | mission | emergency

  if (!type) {
    console.log("❌ Tu dois préciser le status : online, offline, mission, ou emergency");
    console.log("Exemples :");
    console.log("node scripts/create-robot.js online");
    console.log("node scripts/create-robot.js offline");
    console.log("node scripts/create-robot.js mission");
    console.log("node scripts/create-robot.js emergency");
    process.exit(1);
  }

  try {
    // ✅ Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    // Compter les robots existants pour générer un nom et numéro de série uniques
    const robotCount = await Robot.countDocuments();
    const robotNumber = robotCount + 1;
    const currentYear = new Date().getFullYear();
    
    // Générer le numéro de série automatiquement
    const serialNumber = `TB4-${currentYear}-${String(robotNumber).padStart(3, '0')}`;

    // Créer le robot avec les données par défaut
    const robot = await Robot.create({
      serialNumber: serialNumber,
      name: `Robot_${String(robotNumber).padStart(2, '0')}`,
      model: "TurtleBot4",
      status: type,
      currentState: {
        battery: Math.floor(Math.random() * 40) + 60, // 60-100%
        temperature: Math.random() * 10 + 30, // 30-40°C
        position: {
          x: Math.random() * 20, // 0-20
          y: Math.random() * 20, // 0-20
          orientation: Math.random() * 360 // 0-360°
        },
        lastUpdate: new Date()
      },
      sensors: {
        lidar: true,
        camera: true,
        imu: true
      }
    });

    console.log(`🤖 Robot créé avec succès !`);
    console.log(`🏷️ Numéro de série : ${robot.serialNumber}`);
    console.log(`📋 Nom : ${robot.name}`);
    console.log(`🔧 Modèle : ${robot.model}`);
    console.log(`📊 Status : ${robot.status}`);
    console.log(`🔋 Batterie : ${robot.currentState.battery}%`);
    console.log(`🌡️ Température : ${robot.currentState.temperature.toFixed(1)}°C`);
    console.log(`📍 Position : X=${robot.currentState.position.x.toFixed(1)}, Y=${robot.currentState.position.y.toFixed(1)}, Orientation=${robot.currentState.position.orientation.toFixed(0)}°`);
    console.log(`📹 Capteurs : LIDAR=${robot.sensors.lidar ? '✅' : '❌'}, Caméra=${robot.sensors.camera ? '✅' : '❌'}, IMU=${robot.sensors.imu ? '✅' : '❌'}`);
    console.log(`🆔 ID : ${robot._id}`);

  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    // ✅ Déconnexion
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

/* ================================
   4️⃣ Lancement
================================ */
main();
