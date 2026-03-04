"use client";
import React, { useState } from "react";
import Sidebar from "@/component/sidebar";
import UsersPage from "@/component/UsersPage"; // Import de votre composant Users
import RobotsPage from "@/component/RobotsPage"; // Import de votre composant Robots

export default function GestionPage() {
  // L'état qui contrôle quelle page est affichée
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* On passe activeTab et setActiveTab à la Sidebar pour contrôler la navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Zone de contenu dynamique */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "users" ? (
          <UsersPage />
        ) : (
          <RobotsPage />
        )}
      </main>
    </div>
  );
}