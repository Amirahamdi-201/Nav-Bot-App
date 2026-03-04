const mongoose = require("mongoose");

/* ================================
   Schéma Robot (identique au modèle)
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

console.log("🔍 Vérification de la collection robots...");

/* ================================
   URI MongoDB
================================ */
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

/* ================================
   Fonction principale
================================ */
async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    // Vérifier la base de données actuelle
    const db = mongoose.connection.db;
    console.log(`📊 Base de données: ${db.databaseName}`);

    // Lister toutes les collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Nombre de collections: ${collections.length}`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    // Vérifier spécifiquement la collection robots
    const robotsCollection = db.collection('robots');
    const count = await robotsCollection.countDocuments();
    console.log(`\n🤖 Nombre de robots dans la collection 'robots': ${count}`);

    if (count > 0) {
      const robots = await robotsCollection.find({}).toArray();
      console.log("\n📋 Détails des robots:");
      robots.forEach((robot, index) => {
        console.log(`\nRobot ${index + 1}:`);
        console.log(JSON.stringify(robot, null, 2));
      });
    } else {
      console.log("❌ Aucun robot trouvé dans la collection 'robots'");
      console.log("💡 Essayez de créer un robot avec: node scripts/create-robot.js online");
    }

  } catch (err) {
    console.error("❌ Erreur :", err.message);
    console.error("Détails complets:", err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("🔌 Déconnecté de MongoDB");
    }
  }
}

main();
