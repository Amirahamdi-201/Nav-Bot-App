import connectToDB from "../../../lib/bd";
import User from "../../../model/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Récupère les données envoyées depuis fetch
    const { username, password, captcha, captchaToken } = await req.json();

    // Vérifie les champs
    if (!username || !password || !captcha || !captchaToken ) {
      return new Response(
        JSON.stringify({ message: "Champs manquants" }),
        { status: 400 }
      );
    }

    // 🔐 Vérification captcha côté serveur
    const expected = global.captchas?.[captchaToken];
    if (!expected || Number(captcha) !== expected) {
      return new Response(
        JSON.stringify({ message: "Captcha incorrect ou expiré" }),
        { status: 401 }
      );
    }

    // Supprimer le captcha après usage
    delete global.captchas[captchaToken];

    // Connexion à la DB
    await connectToDB();

    // Cherche l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Utilisateur non trouvé" }),
        { status: 401 }
      );
    }

    // Vérifie le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Mot de passe incorrect" }),
        { status: 401 }
      );
    }

    // Mettre à jour lastLogin seulement si c'est null (première connexion)
    const isFirstLogin = user.lastLogin === null;
    await User.findByIdAndUpdate(user._id, { 
      lastLogin: new Date()
    });

    // Réponse succès
    return new Response(
      JSON.stringify({ 
        message: "Connexion réussie !",
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          username: user.username,
          admin: user.admin,
          firstLogin: isFirstLogin // Utiliser lastLogin pour détecter la première connexion
        }
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
