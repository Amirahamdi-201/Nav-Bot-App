"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Plus, RefreshCw, X, Cpu, Hash, AlertTriangle, CheckCircle, Activity } from "lucide-react";

export default function RobotsPage() {
  const [robots, setRobots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRobot, setSelectedRobot] = useState(null);

  // 1. Récupérer les robots depuis l'API
  const fetchRobots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/getrobot");
      if (response.ok) {
        const data = await response.json();
        setRobots(data);
      }
    } catch (error) {
      console.error("Erreur chargement robots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  // 2. Ajouter un robot
  const handleAddRobot = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const robotData = {
      serialNumber: formData.get("serialNumber"),
      name: formData.get("name"),
      model: formData.get("model"),
      status: formData.get("status"),
      currentState: {
        battery: parseInt(formData.get("battery")) || 100,
        temperature: parseFloat(formData.get("temperature")) || 25.0,
        position: {
          x: parseFloat(formData.get("posX")) || 0,
          y: parseFloat(formData.get("posY")) || 0,
          orientation: parseFloat(formData.get("orientation")) || 0
        },
        lastUpdate: new Date()
      },
      sensors: {
        lidar: formData.get("lidar") === "on",
        camera: formData.get("camera") === "on",
        imu: formData.get("imu") === "on"
      }
    };

    try {
      const response = await fetch("/api/ajoutrobot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(robotData),
      });

      if (response.ok) {
        const newRobot = await response.json();
        setRobots((prev) => [...prev, newRobot]);
        setIsModalOpen(false);
        e.target.reset();
      } else {
        const err = await response.json();
        alert(err.message || "Erreur lors de l'ajout.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    }
  };

  // 3. Supprimer un robot
  const handleDeleteRobot = async (id) => {
    if (!confirm("Supprimer ce robot ?")) return;
    try {
      const response = await fetch(`/api/deleterobot?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setRobots((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (error) {
      alert("Erreur suppression.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "online" ? "offline" : "online";
    try {
      const response = await fetch(`/api/updatestat?id=${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        setRobots((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
        );
      }
    } catch (error) {
      alert("Erreur réseau lors du changement de statut.");
    }
  };

  // 4. Signaler un robot en panne (broken-down)
  const signalerPanne = async (id) => {
    if (!confirm("Signaler ce robot comme étant en panne ?")) return;
    
    try {
      const response = await fetch(`/api/updatestat?id=${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "broken-down" }),
      });

      if (response.ok) {
        setRobots((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "broken-down" } : r))
        );
        alert("Robot signalé comme étant en panne.");
      } else {
        const err = await response.json();
        alert(err.message || "Erreur lors du signalement.");
      }
    } catch (error) {
      alert("Erreur réseau lors du signalement.");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <div className="bg-[#24386E] text-white py-6 px-10 shadow-lg mx-6 mt-6 rounded-xl flex justify-center items-center">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-center">Gestion des Robots</h1>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-end gap-3 mb-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#24386E] text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-[#1a2a52] transition-all"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Nouveau Robot</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="max-h-[540px] overflow-y-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-[#24386E] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase w-16">N°</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Numéro de série</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Modèle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Batterie</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Position</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="7" className="py-10 text-center text-gray-400">Chargement...</td></tr>
                ) : robots.map((robot, index) => (
                  <tr key={robot.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => setSelectedRobot(robot)}>
                    <td className="px-6 py-4 text-sm font-bold text-[#24386E]">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{robot.serialNumber}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{robot.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{robot.model}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        robot.status === "online" ? "bg-green-50 text-green-700 border-green-200" :
                        robot.status === "offline" ? "bg-orange-50 text-orange-700 border-orange-200" :
                        robot.status === "mission" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        robot.status === "idle" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        robot.status === "broken-down" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-gray-50 text-gray-700 border-gray-200"
                      }`}>
                        {robot.status === "broken-down" ? "broken-down" : robot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              robot.currentState?.battery > 60 ? "bg-green-500" :
                              robot.currentState?.battery > 30 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${robot.currentState?.battery || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{robot.currentState?.battery || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      X: {robot.currentState?.position?.x || 0}, Y: {robot.currentState?.position?.y || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        {robot.status === "broken-down" ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              signalerPanne(robot.id);
                            }}
                            className="text-green-500 hover:text-green-700 hover:scale-110 transition-all"
                            title="Remettre en service (Actif)"
                          >
                            <CheckCircle size={20} />
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              signalerPanne(robot.id);
                            }}
                            className="text-orange-500 hover:text-orange-700 hover:scale-110 transition-all"
                            title="Signaler en panne"
                          >
                            <AlertTriangle size={20} />
                          </button>
                        )}

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRobot(robot.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
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

      {/* Modal d'ajout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#24386E] p-4 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2"><Cpu size={20}/> Nouveau Robot</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddRobot} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Robot</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Ex: Robot_01"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de série</label>
                  <input 
                    type="text" 
                    name="serialNumber"
                    placeholder="Ex: TB4-2026-001"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E] font-mono" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <select name="model" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E]">
                    <option value="TurtleBot4">TurtleBot4</option>
                    <option value="TurtleBot3">TurtleBot3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" defaultValue="offline" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E] bg-gray-100 cursor-not-allowed" disabled>
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                    <option value="mission">Mission</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">État Actuel</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batterie (%)</label>
                    <input type="number" name="battery" min="0" max="100" defaultValue="100" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Température (°C)</label>
                    <input type="number" name="temperature" step="0.1" defaultValue="25.0" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E]" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Position</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X</label>
                    <input type="number" name="posX" step="0.1" defaultValue="0" disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E] bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Y</label>
                    <input type="number" name="posY" step="0.1" defaultValue="0" disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E] bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orientation (°)</label>
                    <input type="number" name="orientation" step="1" defaultValue="0" disabled className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#24386E] bg-gray-100 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Capteurs</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="lidar" defaultChecked className="rounded focus:ring-2 focus:ring-[#24386E]" />
                    <span className="text-sm text-gray-700">LIDAR</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="camera" defaultChecked className="rounded focus:ring-2 focus:ring-[#24386E]" />
                    <span className="text-sm text-gray-700">Caméra</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="imu" defaultChecked className="rounded focus:ring-2 focus:ring-[#24386E]" />
                    <span className="text-sm text-gray-700">IMU</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg">Annuler</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#24386E] text-white rounded-lg">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détails du robot */}
      {selectedRobot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-[#24386E] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Cpu size={24} />
                Détails du Robot: {selectedRobot.name}
              </h3>
              <button onClick={() => setSelectedRobot(null)}><X size={28} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colonne gauche - Informations principales */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Hash size={16} />
                      Informations Générales
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Numéro de série:</span>
                        <span className="font-mono font-semibold text-[#24386E]">{selectedRobot.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom:</span>
                        <span className="font-semibold">{selectedRobot.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modèle:</span>
                        <span className="font-semibold">{selectedRobot.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          selectedRobot.status === "online" ? "bg-green-50 text-green-700 border-green-200" :
                          selectedRobot.status === "offline" ? "bg-orange-50 text-orange-700 border-orange-200" :
                          selectedRobot.status === "mission" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          selectedRobot.status === "broken-down" ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}>
                          {selectedRobot.status === "broken-down" ? "broken-down" : selectedRobot.status}
                        </span>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-blue-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-700 font-medium flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedRobot.status === "online" ? "bg-green-500" :
                              selectedRobot.status === "offline" ? "bg-orange-500" :
                              selectedRobot.status === "mission" ? "bg-blue-500" :
                              selectedRobot.status === "broken-down" ? "bg-red-500" :
                              "bg-gray-500"
                            }`}></div>
                            Status
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            selectedRobot.status === "online" ? "bg-green-50 text-green-700 border-green-200" :
                            selectedRobot.status === "offline" ? "bg-orange-50 text-orange-700 border-orange-200" :
                            selectedRobot.status === "mission" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            selectedRobot.status === "broken-down" ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-gray-50 text-gray-700 border-gray-200"
                          }`}>
                            {selectedRobot.status === "broken-down" ? "broken-down" : selectedRobot.status}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-blue-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-700 font-medium flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedRobot.currentState?.battery > 60 ? "bg-green-500" :
                              selectedRobot.currentState?.battery > 30 ? "bg-yellow-500" : "bg-red-500"
                            }`}></div>
                            Batterie
                          </span>
                          <span className="font-bold text-lg">{selectedRobot.currentState?.battery || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className={`h-4 rounded-full transition-all duration-300 ${
                              selectedRobot.currentState?.battery > 60 ? "bg-green-500" :
                              selectedRobot.currentState?.battery > 30 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${selectedRobot.currentState?.battery || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-blue-50">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedRobot.currentState?.temperature > 35 ? "bg-red-500" :
                              selectedRobot.currentState?.temperature > 25 ? "bg-yellow-500" : "bg-green-500"
                            }`}></div>
                            Température
                          </span>
                          <span className="font-bold text-lg">{selectedRobot.currentState?.temperature || 0}°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne droite - Capteurs et timestamps */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Cpu size={16} />
                      Capteurs
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-gray-700">LIDAR</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedRobot.sensors?.lidar ? 
                          "bg-green-100 text-green-800 border-green-300" : 
                          "bg-red-100 text-red-800 border-red-300"
                        }`}>
                          {selectedRobot.sensors?.lidar ? "ACTIF" : "INACTIF"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-gray-700">Caméra</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedRobot.sensors?.camera ? 
                          "bg-green-100 text-green-800 border-green-300" : 
                          "bg-red-100 text-red-800 border-red-300"
                        }`}>
                          {selectedRobot.sensors?.camera ? "ACTIF" : "INACTIF"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-gray-700">IMU</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedRobot.sensors?.imu ? 
                          "bg-green-100 text-green-800 border-green-300" : 
                          "bg-red-100 text-red-800 border-red-300"
                        }`}>
                          {selectedRobot.sensors?.imu ? "ACTIF" : "INACTIF"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Timestamps</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Créé le:</span>
                        <span className="font-semibold text-sm">
                          {selectedRobot.createdAt ? 
                            new Date(selectedRobot.createdAt).toLocaleString('fr-FR') : 
                            'Non disponible'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modifié le:</span>
                        <span className="font-semibold text-sm">
                          {selectedRobot.updatedAt ? 
                            new Date(selectedRobot.updatedAt).toLocaleString('fr-FR') : 
                            'Non disponible'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}