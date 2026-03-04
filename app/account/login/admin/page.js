'use client';

import { useState, useEffect} from 'react'; // <-- ajout de useEffect
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const router = useRouter(); // initialisation du router


  // 🔄 charger captcha
  const loadCaptcha = async () => {
    try {
      const res = await fetch("/api/captcha");
      const data = await res.json();
      setCaptchaQuestion(data.question);
      setCaptchaToken(data.token);
      setCaptcha("");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger le captcha");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const [loading, setLoading] = useState(false);


const handleLogin = async () => {
  if (loading) return;

  setLoading(true);

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        captcha,
        captchaToken,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message); 

      // 🔄 après 3 secondes, redirige vers /acceuil
      setTimeout(() => {
        router.push("/gestion");
      }, 3000);
      
    } else {
      toast.error(data.message);
    }
  } catch {
    toast.error("Erreur serveur");
  } finally {
    setLoading(false);
    loadCaptcha(); // 🔄 toujours
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 relative"
      style={{
    background: 'linear-gradient(to bottom, #081F5C, #D4EBFF)', // 🔹 dégradé bleu → clair
  }}>
      {/* Toaster pour afficher les notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <div
        className="w-[800px] h-[500px] bg-white rounded-xl shadow-lg flex overflow-hidden"
        style={{ backgroundColor: '#D4EBFF' }}
      >
        {/* Partie gauche - Formulaire */}
        <div className="w-2/3 p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-[#24386E] text-center mb-8">
            Profil Administrateur
          </h1>

          <div className="mb-4">
            <label className="block text-sm text-[#24386E] mb-1">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-[#24386E]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm text-[#24386E] mb-1">
              Mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-[#24386E]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-sm text-[#24386E]">
              Voir le mot de passe
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-[#24386E] mb-1">
              {captchaQuestion || "Chargement du captcha..."}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-[#24386E]"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`mx-auto px-10 py-2 rounded-lg text-white transition
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#24386E] hover:opacity-90"}
  `}
          >
            {loading ? "Connexion..." : "Connexion"}
          </button>
        </div>

        {/* Partie droite - Logo */}
        <div className="relative w-1/3 h-full">
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background:
                'linear-gradient(180deg, #24386E 0%, #4F6FB3 50%, #D4EBFF 100%)',
              clipPath: 'ellipse(90% 90% at 90% 80%)',
            }}
          >
            <Image
              src="/nav-bot-logo.png"
              alt="Logo NAVBOT"
              width={160}
              height={160}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
