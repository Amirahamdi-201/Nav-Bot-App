const mongoose = require("mongoose");

/* ================================
   1️⃣ Schéma & Modèle User (identique au modèle)
================================ */
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  admin: { type: Number, enum: [0, 1], default: 0 },
  lastLogin: { type: Date, default: null },
}, {
  timestamps: true,
});

const User = mongoose.models?.User || mongoose.model("User", userSchema);

/* ================================
   2️⃣ URI MongoDB
================================ */
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

/* ================================
   3️⃣ Fonction principale
================================ */
async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    // Récupérer tous les utilisateurs
    const users = await User.find({});
    
    console.log(`\n📊 Nombre d'utilisateurs dans la base : ${users.length}\n`);
    
    if (users.length === 0) {
      console.log("❌ Aucun utilisateur trouvé dans la base de données");
    } else {
      users.forEach((user, index) => {
        console.log(`👤 Utilisateur ${index + 1}:`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Nom: ${user.nom}`);
        console.log(`   Prénom: ${user.prenom}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Admin: ${user.admin === 1 ? 'Oui' : 'Non'}`);
        console.log(`   Créé le: ${user.createdAt}`);
        console.log(`   Dernière connexion: ${user.lastLogin || 'Jamais'}`);
        console.log('---');
      });
    }

  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

main();
