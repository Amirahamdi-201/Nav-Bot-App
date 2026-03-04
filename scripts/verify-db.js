const mongoose = require("mongoose");

/* ================================
   URI MongoDB
================================ */
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

/* ================================
   Fonction de vérification détaillée
================================ */
async function checkDatabase() {
  try {
    console.log("🔗 Connexion à MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté avec succès");

    // Vérifier la base de données actuelle
    const db = mongoose.connection.db;
    console.log(`📊 Base de données: ${db.databaseName}`);

    // Lister toutes les collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Nombre de collections: ${collections.length}`);
    
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    // Vérifier spécifiquement la collection users
    const usersCollection = db.collection('users');
    const count = await usersCollection.countDocuments();
    console.log(`\n👤 Nombre d'utilisateurs dans la collection 'users': ${count}`);

    if (count > 0) {
      const users = await usersCollection.find({}).toArray();
      console.log("\n📋 Détails des utilisateurs:");
      users.forEach((user, index) => {
        console.log(`\nUtilisateur ${index + 1}:`);
        console.log(JSON.stringify(user, null, 2));
      });
    } else {
      console.log("❌ Aucun utilisateur trouvé dans la collection 'users'");
    }

  } catch (err) {
    console.error("❌ Erreur de connexion ou de requête:", err.message);
    console.error("Détails complets:", err);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("🔌 Déconnecté de MongoDB");
    }
  }
}

checkDatabase();
