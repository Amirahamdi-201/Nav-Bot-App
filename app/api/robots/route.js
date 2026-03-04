import { Robot } from "@/model/robot";
import connectToDB from "@/lib/bd";

export async function GET() {
  try {
    // Connexion à la base de données
    await connectToDB();

    // Récupérer tous les robots
    const robots = await Robot.find({});
    
    // Debug: afficher les données brutes
    console.log("Robots bruts de la base:", JSON.stringify(robots, null, 2));

    // Transformer les données pour correspondre à la structure du dashboard
    const transformedRobots = robots.map(robot => ({
      id: robot._id,
      name: robot.name || `Robot-${robot.serialNumber}`,
      serialNumber: robot.serialNumber || 'N/A',
      status: robot.status === "online" ? "Online" : 
              robot.status === "offline" ? "Offline" : 
              robot.status === "mission" ? "Idle" : 
              robot.status === "idle" ? "Idle" :
              robot.status === "broken-down" ? "Broken" : 
              robot.status === "emergency" ? "Emergency" : "Offline",
      battery: robot.currentState?.battery || 0,
      mode: robot.status === "mission" ? "AUTONOMOUS" : 
             robot.status === "idle" ? "IDLE" : "IDLE",
      temp: robot.currentState?.temperature || 25,
      location: robot.currentState?.position ? 
        `${robot.currentState.position.x} / ${robot.currentState.position.y}` : "Unknown"
    }));
    
    // Debug: afficher les données transformées
    console.log("Robots transformés:", JSON.stringify(transformedRobots, null, 2));

    // Retourner les robots transformés
    return new Response(
      JSON.stringify(transformedRobots),
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la récupération des robots:", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
