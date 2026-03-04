import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Robot } from "@/model/robot";
import connectToDB from "@/lib/bd";

export async function GET() {
  try {
    await connectToDB();

    // On récupère les robots
    const robots = await Robot.find({});
    
    // On trie manuellement si createdAt n'existe pas encore sur les anciens documents
    const sortedRobots = robots.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    const formattedRobots = sortedRobots.map(r => ({
      id: r._id.toString(),
      serialNumber: r.serialNumber,
      name: r.name,
      model: r.model,
      status: r.status,
      currentState: r.currentState,
      sensors: r.sensors,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

    console.log(`✅ ${formattedRobots.length} robots récupérés`);

    return NextResponse.json(formattedRobots, { 
      status: 200,
      headers: { 
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("❌ Erreur critique GET /api/getrobot:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}