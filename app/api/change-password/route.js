import connectToDB from "../../../lib/bd";
import User from "../../../model/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { userId, currentPassword, newPassword } = await req.json();

    // Validation des champs
    if (!userId || !currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ message: "Champs manquants" }),
        { status: 400 }
      );
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ message: "Le nouveau mot de passe doit contenir au moins 6 caractères" }),
        { status: 400 }
      );
    }

    await connectToDB();

    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Utilisateur non trouvé" }),
        { status: 404 }
      );
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Mot de passe actuel incorrect" }),
        { status: 401 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await User.findByIdAndUpdate(userId, { 
      password: hashedNewPassword
    });

    return new Response(
      JSON.stringify({ 
        message: "Mot de passe modifié avec succès !",
        success: true
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Erreur lors du changement de mot de passe:", err);
    return new Response(
      JSON.stringify({ message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
