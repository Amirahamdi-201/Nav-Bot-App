import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 1️⃣ Définition du Schéma
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
  createdAt: { type: Date, default: Date.now },
});

// Initialisation sécurisée du modèle
const User = mongoose.models.User || mongoose.model("User", userSchema);

// 2️⃣ URI MongoDB
const MONGODB_URI = "mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/?appName=ClusterData";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("📡 Connexion MongoDB établie");
  } catch (err) {
    console.error("❌ Échec connexion MongoDB:", err);
  }
}

// 4️⃣ Route POST
export async function POST(request) {
  try {
    // AFFICHER LES DONNÉES REÇUES DU FRONT
    const userData = await request.json();
    console.log("📥 Données brutes reçues du Front-end :", userData);

    const { nom, prenom, username, role } = userData;

    // Validation simple
    if (!nom || !prenom || !username || !role) {
      console.log("⚠️ Validation échouée : Champs requis manquants");
      return NextResponse.json(
        { message: "Nom, prénom, username et rôle sont requis" },
        { status: 400 }
      );
    }

    await connectDB();

    // Vérifier l'existence
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      console.log(`🚫 L'utilisateur "${username}" existe déjà en base.`);
      return NextResponse.json(
        { message: "Cet username existe déjà" },
        { status: 400 }
      );
    }

    // Préparation des données pour la base
    const hashedPassword = await bcrypt.hash("NavBot2026", 10);

    console.log("🛠️ Préparation de l'objet User pour MongoDB...");
    console.log(`- Nom: ${nom}`);
    console.log(`- Prénom: ${prenom}`);
    console.log(`- Username: ${username}`);
    console.log(`- Role: ${role}`);

    // Création
    const newUser = await User.create({
      nom: nom,
      prenom: prenom,
      username: username,
      password: hashedPassword,
      role: role,
    });

    console.log(`✅ Utilisateur créé avec succès (ID: ${newUser._id})`);

    // Réponse au front
    return NextResponse.json({
      id: newUser._id,
      nom: newUser.nom,
      prenom: newUser.prenom,
      username: newUser.username,
      role: newUser.role,
      message: "Utilisateur ajouté avec succès !"
    }, { status: 201 });

  } catch (error) {
    console.error("🔥 Erreur critique dans /api/ajoutUser :", error.message);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}