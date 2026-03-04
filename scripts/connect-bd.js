// scripts/testConnection.js
const mongoose = require("mongoose");

async function testConnection() {
  try {
    await mongoose.connect("mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/?appName=ClusterData"); // remplace par ton URI MongoDB
    console.log("✅ Connexion à MongoDB réussie !");
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  } catch (err) {
    console.error("❌ Erreur de connexion :", err.message);
  }
}

testConnection();
