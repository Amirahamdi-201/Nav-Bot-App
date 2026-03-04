"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Plus, RefreshCw, X, KeyRound, Users } from "lucide-react";
export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // On initialise l'état directement avec vos données par défaut


  // 2. Fonction de traitement de l'ajout avec appel API
  const handleAddUser = async (e) => {
    e.preventDefault();

    // On extrait les données du formulaire
    const formData = new FormData(e.target);
    const userData = {
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      username: formData.get("username"),
      role: formData.get("role"),
    };

    console.log("📤 Envoi des données au serveur :", userData);

    try {
      const response = await fetch("/api/ajoutuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // On attend la réponse du serveur
      const result = await response.json();

      if (response.ok) {
        console.log("✅ Réponse serveur réussie :", result);

        // Sécurité : On vérifie que result contient bien ce qu'on attend
        if (!result.id) {
          throw new Error("Le serveur n'a pas renvoyé d'ID");
        }

        setUsers((prevUsers) => {
          // Sécurité : On s'assure que prevUsers est bien un tableau
          const currentUsers = Array.isArray(prevUsers) ? prevUsers : [];

          return [
            ...currentUsers,
            {
              id: result.id,
              nom: result.nom || userData.nom,
              prenom: result.prenom || userData.prenom,
              username: result.username || userData.username,
              role: result.role || userData.role,
            },
          ];
        });

        setIsModalOpen(false);
        // On utilise un petit délai pour l'alerte pour laisser React finir le rendu
        setTimeout(() => alert("Utilisateur ajouté avec succès !"), 100);

      } else {
        // Cas où le serveur répond avec une erreur (ex: utilisateur existe déjà)
        console.error("❌ Erreur serveur :", result.message);
        alert(`Erreur : ${result.message}`);
      }
    } catch (error) {
      // Cas où la requête échoue totalement (réseau, crash serveur, etc.)
      console.error("🔥 Erreur critique lors de l'appel API :", error);
      alert("Une erreur réseau est survenue ou le serveur ne répond pas.");
    }
  };


  // 3. Fonction pour récupérer les données (GET)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/getusers");
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Remplit le tableau avec les données de MongoDB
        console.log(users.name);
      } else {
        console.error("Erreur lors de la récupération des utilisateurs");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Appeler fetchUsers au chargement de la page
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    // 1. Demander confirmation à l'utilisateur
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      const response = await fetch(`/api/deleteuser?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // 2. Mettre à jour l'interface localement pour supprimer la ligne sans recharger
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        alert("Utilisateur supprimé !");
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Impossible de contacter le serveur.");
    }
  };

  const handleResetPassword = async (id, name) => {
    if (!confirm(`Voulez-vous réinitialiser le mot de passe de ${name} ?`)) return;

    try {
      const response = await fetch(`/api/resetmdp?id=${id}`, {
        method: "PATCH", // On utilise la méthode PATCH
      });

      if (response.ok) {
        alert(`Succès : Le mot de passe de ${name} est désormais "NavBot2026"`);
      } else {
        const error = await response.json();
        alert(`Erreur : ${error.message}`);
      }
    } catch (error) {
      console.error("Erreur réinitialisation :", error);
      alert("Erreur réseau.");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">

      {/* Rectangle de titre centré */}
      <div className="bg-[#24386E] text-white py-6 px-10 shadow-lg mx-6 mt-6 rounded-xl flex justify-center items-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-center">
          Gestion des Utilisateurs
        </h1>
      </div>

      <div className="p-6 flex-1 flex flex-col">

        {/* Boutons d'actions au-dessus de la table à droite */}
        <div className="flex justify-end gap-3 mb-4">


          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#24386E] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#1a2a52] transition-all active:scale-95"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Ajouter un utilisateur</span>
          </button>
        </div>

        {/* Conteneur de la table avec scrollbar si > 10 lignes */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* On applique la classe custom-scrollbar définie plus bas */}
          <div className="max-h-[540px] overflow-y-auto custom-scrollbar">
            <table className="min-w-full table-auto">
              <thead className="bg-[#24386E] sticky top-0 z-10">
                <tr>
                  {/* Largeur fixe pour l'ID pour éviter les décalages */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider w-16">N°</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Prénom</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Mot de passe</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => ( // On récupère l'index ici
                  <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[#24386E]">
                      {/* index commence à 0, donc on fait +1 */}
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.nom || user.name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.prenom || ''}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{user.username || ''}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">**********</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 text-[#24386E] rounded-full text-xs font-bold border border-gray-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleResetPassword(user.id, `${user.prenom} ${user.nom}`)} 
                          className="text-[#24386E] hover:text-blue-800 hover:scale-110 transition-all"
                          title="Initialiser le mot de passe"
                        >
                          <KeyRound size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POP-UP (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-[#24386E]">Nouvel Utilisateur</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulaire simplifié */}
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#24386E] outline-none"
                  placeholder="Ex: Dupont"
                  onChange={(e) => {
                    const nomInput = e.target.value;
                    const prenomInput = document.querySelector('input[name="prenom"]')?.value || '';
                    const usernameField = document.querySelector('input[name="username"]');
                    if (usernameField && nomInput && prenomInput) {
                      usernameField.value = `Nv.${nomInput.charAt(0).toLowerCase()}${prenomInput}`;
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#24386E] outline-none"
                  placeholder="Ex: Jean"
                  onChange={(e) => {
                    const prenomInput = e.target.value;
                    const nomInput = document.querySelector('input[name="nom"]')?.value || '';
                    const usernameField = document.querySelector('input[name="username"]');
                    if (usernameField && nomInput && prenomInput) {
                      usernameField.value = `NV.${nomInput.charAt(0).toLowerCase()}${prenomInput}`;
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                  placeholder="Généré automatiquement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  name="role"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#24386E] outline-none"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#24386E] text-white rounded-lg hover:bg-[#1a2a52] transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}






