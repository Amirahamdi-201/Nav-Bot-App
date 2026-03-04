"use client";
import React, { useState } from "react";
import { X, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function ChangePasswordModal({ isOpen, onClose, userId, onSuccess, isForced = false }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Afficher le message de succès
        setShowSuccess(true);
        
        // Appeler onSuccess pour mettre à jour l'état parent
        onSuccess();
        
        // Fermer le modal après 1.5 secondes pour montrer le message de succès
        setTimeout(() => {
          onClose();
          // Réinitialiser le formulaire
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowSuccess(false);
        }, 1500);
      } else {
        setError(result.message || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Lock size={24} />
              <h3 className="text-xl font-bold">
                {isForced ? "Sécurité : Premier changement de mot de passe" : "Changement de mot de passe"}
              </h3>
            </div>
            {!isForced && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
          <p className="text-blue-100 text-sm mt-2">
            {isForced 
              ? "Pour des raisons de sécurité, vous devez changer votre mot de passe lors de votre première connexion"
              : "Pour des raisons de sécurité, veuillez changer votre mot de passe"
            }
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Message de succès */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={20} />
              <div>
                <p className="font-semibold">Mot de passe modifié avec succès !</p>
                {isForced && (
                  <p className="text-green-600 text-xs mt-1">Bienvenue sur votre dashboard !</p>
                )}
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && !showSuccess && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Mot de passe actuel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Entrez votre mot de passe actuel"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Min 6 caractères"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirmer le mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                placeholder="Répétez le nouveau mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            {!isForced && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || showSuccess}
              className={`${isForced ? 'w-full' : 'flex-1'} px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {showSuccess ? (
                <>
                  <CheckCircle size={20} />
                  Succès !
                </>
              ) : isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle size={20} />
                  {isForced ? "Définir le mot de passe" : "Changer le mot de passe"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
