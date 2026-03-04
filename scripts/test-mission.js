import mongoose from 'mongoose';

// Schéma Mission (copié du modèle)
const missionSchema = new mongoose.Schema({
  missionCode: { 
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
  type: { 
    type: String, 
    required: true, 
    enum: ["manual", "exploration", "adaptive", "autonomous"], 
    default: "autonomous" 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ["pending", "assigned", "running", "completed", "stopped", "emergency", "failed"], 
    default: "pending" 
  },
  priority: { 
    type: String, 
    required: true, 
    enum: ["low", "normal", "high", "urgent"], 
    default: "normal" 
  },
  robotId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Robot", 
    default: null 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false 
  },
  mapId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Map", 
    default: null 
  },
  destination: {
    x: { 
      type: Number, 
      required: true 
    },
    y: { 
      type: Number, 
      required: true 
    }
  },
  trajectory: {
    algorithm: { 
      type: String, 
      default: "A*" 
    },
    path: [{ 
      x: Number, 
      y: Number, 
      timestamp: Date 
    }],
    recalculated: { 
      type: Boolean, 
      default: false 
    }
  },
  energyConsumed: { 
    type: Number, 
    default: 0 
  },
  startTime: { 
    type: Date, 
    default: null 
  },
  endTime: { 
    type: Date, 
    default: null 
  },
  duration: { 
    type: Number, 
    default: null 
  },
  errorMessage: { 
    type: String, 
    default: null 
  },
  logs: [{
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    level: { 
      type: String, 
      enum: ["info", "warning", "error", "debug"], 
      default: "info" 
    },
    message: { 
      type: String, 
      required: true 
    },
    data: { 
      type: mongoose.Schema.Types.Mixed 
    }
  }]
}, { 
  timestamps: true 
});

// Créer le modèle Mission
const Mission = mongoose.models.Mission || mongoose.model("Mission", missionSchema);

// Connexion à MongoDB
const connectDB = async () => {
  try {
    const mongoURI = "mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";
    await mongoose.connect(mongoURI);
    console.log("✅ Connecté à MongoDB");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB:", error);
    process.exit(1);
  }
};

// Fonction pour générer un code de mission unique
const generateMissionCode = async () => {
  try {
    const count = await Mission.countDocuments();
    return `MISSION-${String(count + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error("❌ Erreur génération code:", error);
    return `MISSION-${Date.now()}`;
  }
};

// Créer une mission
const createMission = async (missionData) => {
  try {
    // Vérifier si une mission avec le même code existe déjà
    const existingMission = await Mission.findOne({ missionCode: missionData.missionCode });
    if (existingMission) {
      console.log("⚠️ Une mission avec ce code existe déjà");
      return false;
    }

    // Créer la nouvelle mission
    const newMission = new Mission({
      ...missionData,
      logs: [{
        timestamp: new Date(),
        level: 'info',
        message: `Mission créée: ${missionData.name}`
      }]
    });

    const savedMission = await newMission.save();
    
    console.log("✅ Mission créée avec succès:");
    console.log("   Code:", savedMission.missionCode);
    console.log("   Nom:", savedMission.name);
    console.log("   Type:", savedMission.type);
    console.log("   Statut:", savedMission.status);
    console.log("   Priorité:", savedMission.priority);
    console.log("   Destination:", `(${savedMission.destination.x}, ${savedMission.destination.y})`);
    console.log("   ID:", savedMission._id);
    console.log("   Créée le:", savedMission.createdAt);
    
    return savedMission;
  } catch (error) {
    console.error("❌ Erreur création mission:", error.message);
    return false;
  }
};

// Lister toutes les missions
const listMissions = async () => {
  try {
    const missions = await Mission.find({}).sort({ createdAt: -1 });
    console.log(`📋 Liste des missions (${missions.length}):`);
    missions.forEach((mission, index) => {
      console.log(`${index + 1}. ${mission.missionCode} - ${mission.name}`);
      console.log(`   Type: ${mission.type} | Statut: ${mission.status} | Priorité: ${mission.priority}`);
      console.log(`   Destination: (${mission.destination.x}, ${mission.destination.y})`);
      console.log(`   Créée: ${mission.createdAt}`);
      console.log("");
    });
    return missions;
  } catch (error) {
    console.error("❌ Erreur liste missions:", error.message);
    return [];
  }
};

// Menu principal
const main = async () => {
  console.log("🚀 Script de création de missions");
  console.log("================================");
  
  await connectDB();
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Usage:");
    console.log("  node insert-mission-direct.js create");
    console.log("  node insert-mission-direct.js list");
    console.log("  node insert-mission-direct.js auto <nombre>");
    console.log("");
    console.log("Exemples:");
    console.log("  node insert-mission-direct.js create");
    console.log("  node insert-mission-direct.js list");
    console.log("  node insert-mission-direct.js auto 5");
    return;
  }

  const command = args[0];

  switch (command) {
    case 'create':
      console.log("🎯 Création d'une mission manuelle");
      
      const missionCode = await generateMissionCode();
      
      const missionData = {
        missionCode,
        name: "Mission Test Automatique",
        type: "autonomous",
        status: "pending",
        priority: "normal",
        destination: {
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100)
        },
        createdBy: null, // Sera mis à jour plus tard
        mapId: null
      };
      
      await createMission(missionData);
      break;
      
    case 'list':
      console.log("📋 Liste des missions existantes");
      await listMissions();
      break;
      
    case 'auto':
      const count = parseInt(args[1]) || 1;
      console.log(`🎯 Création automatique de ${count} mission(s)`);
      
      for (let i = 0; i < count; i++) {
        const missionCode = await generateMissionCode();
        
        const types = ["manual", "exploration", "adaptive", "autonomous"];
        const priorities = ["low", "normal", "high", "urgent"];
        
        const missionData = {
          missionCode,
          name: `Mission Auto ${i + 1}`,
          type: types[Math.floor(Math.random() * types.length)],
          status: "pending",
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          destination: {
            x: Math.floor(Math.random() * 200),
            y: Math.floor(Math.random() * 200)
          },
          createdBy: null,
          mapId: null
        };
        
        console.log(`\n📝 Création mission ${i + 1}/${count}...`);
        await createMission(missionData);
        
        // Petit délai pour éviter les problèmes de code unique
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`\n✅ ${count} mission(s) créée(s) avec succès!`);
      break;
      
    default:
      console.log("❌ Commande inconnue:", command);
      console.log("Utilisez: create, list, ou auto");
  }

  await mongoose.disconnect();
  console.log("👋 Déconnexion de MongoDB");
};

// Gérer les erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rejet non géré à:', promise, 'raison:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

// Exécuter le script
main().catch(error => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
