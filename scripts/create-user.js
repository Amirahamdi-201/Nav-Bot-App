const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* ================================
   1️⃣ Schéma & Modèle User
================================ */
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  admin: { type: Number, enum: [0, 1], default: 0 }, // 0 = simple user | 1 = admin
  lastLogin: { type: Date, default: null },
});

const User = mongoose.models?.User || mongoose.model("User", userSchema);

console.log("🚀 Script lancé");

/* ================================
   2️⃣ URI MongoDB
================================ */
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

/* ================================
   3️⃣ Fonction principale
================================ */
async function main() {
  const type = process.argv[2]; // admin | user

  if (!type) {
    console.log("❌ Tu dois préciser le type : admin ou user");
    console.log("Exemples :");
    console.log("node scripts/create-user.js admin");
    console.log("node scripts/create-user.js user");
    process.exit(1);
  }

  try {
    // ✅ UNE seule connexion
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    const hashedPassword = await bcrypt.hash("123456", 10);

    if (type === "admin") {
      const admin = await User.create({
        nom: "Admin",
        prenom: "Super",
        username: "admin",
        password: hashedPassword,
        admin: 1,
      });

      console.log("👑 Admin créé avec ID :", admin._id);
      console.log("📋 Nom complet :", admin.prenom, admin.nom);
    } else if (type === "user") {
      const user = await User.create({
        nom: "Hamdi",
        prenom: "Amira",
        username: "amira",
        password: hashedPassword,
        admin: 0,
      });

      console.log("👤 User créé avec ID :", user._id);
      console.log("📋 Nom complet :", user.prenom, user.nom);
    } else {
      console.log("❌ Type invalide :", type);
    }
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    // ✅ UNE seule déconnexion
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

/* ================================
   4️⃣ Lancement
================================ */
main();
