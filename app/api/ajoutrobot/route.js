import { NextResponse } from "next/server";
import { Robot } from "@/model/robot";
import connectToDB from "@/lib/bd";

export async function POST(request) {
  try {
    const body = await request.json();
    const { serialNumber, name, model, status, currentState, sensors } = body;

    if (!serialNumber || !name || !model) {
      return NextResponse.json({ message: "Champs manquants (Numéro de série, Nom ou Modèle)" }, { status: 400 });
    }

    await connectToDB();

    // Vérifier si le numéro de série existe déjà
    const existingRobot = await Robot.findOne({ serialNumber });
    if (existingRobot) {
      return NextResponse.json({ message: "Ce numéro de série existe déjà" }, { status: 409 });
    }

    const newRobot = await Robot.create({
      serialNumber,
      name,
      model,
      status: status || "offline",
      currentState: currentState || {
        battery: 100,
        temperature: 25.0,
        position: { x: 0, y: 0, orientation: 0 },
        lastUpdate: new Date()
      },
      sensors: sensors || {
        lidar: true,
        camera: true,
        imu: true
      }
    });

    return NextResponse.json({
      id: newRobot._id.toString(),
      serialNumber: newRobot.serialNumber,
      name: newRobot.name,
      model: newRobot.model,
      status: newRobot.status,
      currentState: newRobot.currentState,
      sensors: newRobot.sensors
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur AjoutRobot:", error);
    return NextResponse.json({ message: "Erreur serveur lors de l'ajout" }, { status: 500 });
  }
}