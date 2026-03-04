import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Robot } from "@/model/robot";
import connectToDB from "@/lib/bd";

// 1. Définition du schéma (doit être cohérent avec vos autres routes)
// const robotSchema = new mongoose.Schema({
//   statut: { type: String, enum: ["Actif", "En panne"] },
// });

// const Robot = mongoose.models.Robot || mongoose.model("Robot", robotSchema);

const MONGODB_URI = "mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/?appName=ClusterData";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error("❌ Erreur connexion MongoDB (UpdateStat):", err);
  }
}

// ✅ EXPORT NOMMÉ "PATCH"
export async function PATCH(request) {
  try {
    // Récupération de l'ID depuis l'URL (?id=...)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Récupération du nouveau statut depuis le corps de la requête
    const { status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "ID ou Status manquant" }, { status: 400 });
    }

    await connectDB();

    // Mise à jour du robot avec le bon champ "status"
    const updatedRobot = await Robot.findByIdAndUpdate(
      id,
      { status: status }, // Utilise le champ "status" du modèle
      { new: true } // Pour renvoyer le document modifié
    );

    if (!updatedRobot) {
      return NextResponse.json({ message: "Robot non trouvé" }, { status: 404 });
    }

    console.log(`🔄 Statut mis à jour pour ${id} : ${status}`);

    return NextResponse.json(updatedRobot, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur PATCH /api/updatestat:", error);
    return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}