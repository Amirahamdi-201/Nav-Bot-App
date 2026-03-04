import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// Configuration de la base de données
const MONGODB_URI =
"mongodb+srv://amirahamdi:j6rS2qQQOC1Q9Q1c@clusterdata.dsbshld.mongodb.net/Nav-Bot?retryWrites=true&w=majority";

// Schéma Mission - identique à celui utilisé dans la page missions
const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  robot: { type: String, default: '' },
  status: { type: String, required: true, enum: ['Pending', 'Running', 'Completed', 'Failed'] },
  result: { type: String, required: true },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  duration: { type: String, default: '-' },
  coverage: { type: String, default: '0%' },
  description: { type: String, required: true },
  type: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical'] },
  destination: { type: String, required: true },
  // Champs spécifiques à la navigation
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  waypoints: { type: String, default: '' },
  returnToStart: { type: Boolean, default: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, default: null }
}, { collection: 'missions' });

const Mission = mongoose.models.Mission || mongoose.model('Mission', missionSchema);

export default async function handler(req, res) {
  try {
    // Connexion à la base de données
    await mongoose.connect(MONGODB_URI);
    
    if (req.method === 'GET') {
      // Récupérer toutes les missions
      const missions = await Mission.find({}).sort({ createdAt: 1 });
      
      // Transformer les missions pour le frontend
      const transformedMissions = missions.map(mission => ({
        ...mission.toObject(),
        id: mission._id.toString(),
        createdAt: mission.createdAt || null,
        updatedAt: mission.updatedAt || null
      }));
      
      return res.status(200).json(transformedMissions);
    }
    
    if (req.method === 'POST') {
      // Créer une nouvelle mission
      const { name, robot, status, result, description, type, priority, destination, startPoint, endPoint, waypoints, returnToStart } = req.body;
      
      const newMission = new Mission({
        name,
        robot: robot || '',
        status: status || 'Pending',
        result: result || 'En attente',
        startTime: null,
        endTime: null,
        duration: '-',
        coverage: '0%',
        description,
        type: type || 'Navigation',
        priority: priority || 'Normal',
        destination: destination || `${startPoint} → ${endPoint}${returnToStart ? ' → ' + startPoint : ''}`,
        // Champs de navigation
        startPoint: startPoint || 'X: 0, Y: 0',
        endPoint: endPoint || 'X: 0, Y: 0',
        waypoints: waypoints || '',
        returnToStart: returnToStart !== 'false', // Convertir en boolean
        createdAt: new Date().toLocaleString(),
        updatedAt: null
      });
      
      await newMission.save();
      
      // Transformer pour le frontend
      const transformedMission = {
        ...newMission.toObject(),
        id: newMission._id.toString(),
        createdAt: newMission.createdAt || null,
        updatedAt: newMission.updatedAt || null
      };
      
      return res.status(201).json(transformedMission);
    }
    
    if (req.method === 'PUT') {
      // Mettre à jour une mission
      const { id, ...updateData } = req.body;
      
      const updatedMission = await Mission.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedMission) {
        return res.status(404).json({ error: 'Mission non trouvée' });
      }
      
      // Transformer pour le frontend
      const transformedMission = {
        ...updatedMission.toObject(),
        id: updatedMission._id.toString(),
        createdAt: updatedMission.createdAt || null,
        updatedAt: updatedMission.updatedAt || null
      };
      
      return res.status(200).json(transformedMission);
    }
    
    if (req.method === 'DELETE') {
      // Supprimer une mission
      const { id } = req.query;
      
      const deletedMission = await Mission.findOneAndDelete({ _id: id });
      
      if (!deletedMission) {
        return res.status(404).json({ error: 'Mission non trouvée' });
      }
      
      // Transformer pour le frontend
      const transformedMission = {
        ...deletedMission.toObject(),
        id: deletedMission._id.toString(),
        createdAt: deletedMission.createdAt || null,
        updatedAt: deletedMission.updatedAt || null
      };
      
      return res.status(200).json(transformedMission);
    }
    
    // Méthode non autorisée
    return res.status(405).json({ error: 'Méthode non autorisée' });
    
  } catch (error) {
    console.error('Erreur API missions:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  } finally {
    await mongoose.disconnect();
  }
}
