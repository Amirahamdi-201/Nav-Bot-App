import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 1️⃣ Modèle & Connexion
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

const MONGODB_URI = "mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/?appName=ClusterData";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}

// 2️⃣ EXPORT NOMMÉ (PATCH) - Pas de "default" !
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID manquant" }, { status: 400 });
    }

    await connectDB();

    const hashedPassword = await bcrypt.hash("NavBot2026", 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ message: "Mot de passe réinitialisé" }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur ResetMDP:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}