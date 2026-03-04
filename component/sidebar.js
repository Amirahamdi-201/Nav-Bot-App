"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaUser, FaRobot, FaBars, FaSignOutAlt } from "react-icons/fa"; // Ajout de FaSignOutAlt

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(true);

  // Style commun pour les boutons
  const buttonBaseClass = "flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 cursor-pointer focus:outline-none";
  const activeClass = "bg-[#24386E] text-white shadow-md";
  const inactiveClass = "text-gray-600 hover:bg-gray-100";

  // Fonction de déconnexion (à adapter selon votre système d'auth)
  const handleLogout = () => {
    if (confirm("Voulez-vous vous déconnecter ?")) {
      // Logique de déconnexion ici (ex: suppression cookie/token)
      window.location.href = "/";
    }
  };

  return (
    <div
      className={`bg-[#FCFDFF] border-r border-gray-200 flex flex-col p-4 gap-4 h-screen 
        transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Logo + Hamburger */}
      <div className="mb-8 relative flex justify-center items-center min-h-[50px]">
        {isOpen && (
          <div className="transition-opacity duration-300">
            <Image
              src="/nav-bot-logo.png"
              alt="Logo"
              width={100}
              height={50}
              priority
            />
          </div>
        )}

        {/* Hamburger menu */}
        <FaBars
          className={`text-[#24386E] text-xl cursor-pointer hover:scale-110 transition-transform ${isOpen ? "absolute right-0" : "mx-auto"
            }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Menu Principal */}
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`${buttonBaseClass} ${activeTab === "users" ? activeClass : inactiveClass
            }`}
        >
          <FaUser className={activeTab === "users" ? "text-white" : "text-[#24386E]"} />
          {isOpen && <span className="font-medium text-sm">Utilisateurs</span>}
        </button>

        <button
          onClick={() => setActiveTab("robots")}
          className={`${buttonBaseClass} ${activeTab === "robots" ? activeClass : inactiveClass
            }`}
        >
          <FaRobot className={activeTab === "robots" ? "text-white" : "text-[#24386E]"} />
          {isOpen && <span className="font-medium text-sm">Robots</span>}
        </button>
      </nav>

      {/* Section Bas de page - Déconnexion */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`${buttonBaseClass} text-red-500 hover:bg-red-50 hover:text-red-600`}
        >
          <FaSignOutAlt className={!isOpen ? "mx-auto" : ""} />
          {isOpen && <span className="font-medium text-sm">Se déconnecter</span>}
        </button>
      </div>
    </div>
  );
}