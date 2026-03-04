import { NextResponse } from "next/server";
import mongoose from "mongoose";

// 1️⃣ Définition du Schéma (doit correspondre à votre BDD)
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

// Initialisation du modèle
const User = mongoose.models.User || mongoose.model("User", userSchema);

// 2️⃣ URI MongoDB
const MONGODB_URI = "mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}

// 3️⃣ Route GET
export async function GET() {
  try {
    await connectDB();

    // Récupérer tous les utilisateurs
    const usersFromDB = await User.find({});

    // Transformer les données pour le Front-end
    const formattedUsers = usersFromDB.map((user) => ({
      id: user._id.toString(),
      nom: user.nom,
      prenom: user.prenom,
      username: user.username,
      role: user.admin === 1 ? "Admin" : "User",
      // On n'envoie pas le mot de passe pour la sécurité
    }));

    console.log(`✅ ${formattedUsers.length} utilisateurs récupérés`);

    return NextResponse.json(formattedUsers, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur API GetUsers:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}