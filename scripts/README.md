# Scripts d'ajout de robots en mode idle

Ce dossier contient des scripts pour ajouter facilement des robots en statut "idle" (jaune) dans votre projet NavBot.

## 🚀 Utilisation rapide

### Windows (PowerShell)
```powershell
# Ajouter un robot idle par défaut
.\scripts\add-robot.ps1

# Ajouter un robot personnalisé
.\scripts\add-robot.ps1 custom

# Ajouter 3 robots pour test
.\scripts\add-robot.ps1 multiple

# Lister les robots existants
.\scripts\add-robot.ps1 list

# Voir l'aide
.\scripts\add-robot.ps1 help
```

### Linux/Mac (Bash)
```bash
# Rendre le script exécutable
chmod +x scripts/add-robot.sh

# Ajouter un robot idle par défaut
./scripts/add-robot.sh

# Ajouter un robot personnalisé
./scripts/add-robot.sh custom

# Ajouter 3 robots pour test
./scripts/add-robot.sh multiple

# Lister les robots existants
./scripts/add-robot.sh list

# Voir l'aide
./scripts/add-robot.sh help
```

### Node.js (direct)
```bash
# Ajouter un robot idle par défaut
node scripts/add-idle-robot.js 1

# Ajouter un robot personnalisé
node scripts/add-idle-robot.js 2

# Ajouter 3 robots pour test
node scripts/add-idle-robot.js 3

# Lister les robots existants
node scripts/add-idle-robot.js 4
```

## 📋 Prérequis

1. **Node.js** installé sur votre machine
2. **Serveur NavBot** en cours d'exécution (`npm run dev`)
3. **Base de données** MongoDB accessible

## 🤖 Caractéristiques du robot idle

### Par défaut
- **Nom**: `Robot-Idle-{timestamp}`
- **Série**: `TB4-{timestamp}`
- **Modèle**: `TurtleBot4`
- **Statut**: `idle` (affiché en jaune)
- **Batterie**: 85%
- **Température**: 24.5°C
- **Position**: X=0, Y=0
- **Capteurs**: LIDAR, Camera, IMU activés

### Personnalisé
Vous pouvez modifier ces paramètres dans le script `add-idle-robot.js`:
```javascript
{
  name: 'MonRobotIdle',
  serialNumber: 'TB4-CUSTOM-001',
  model: 'TurtleBot4',
  x: 50,
  y: 75,
  battery: 90,
  temperature: 22.5,
  lidar: true,
  camera: true,
  imu: true
}
```

## 🎯 Résultat visuel

Le robot ajouté apparaîtra avec :
- **Badge jaune** dans le dashboard
- **Statut "Idle"** dans la liste des robots
- **Couleur jaune** cohérente dans toute l'application
- **Position aléatoire** pour les tests multiples

## 🔧 API créée

Une nouvelle route API a été créée : `POST /api/addrobot`

**Endpoint**: `http://localhost:3000/api/addrobot`
**Méthode**: `POST`
**Corps** (JSON):
```json
{
  "serialNumber": "TB4-2026-001",
  "name": "Robot-Idle-001",
  "model": "TurtleBot4",
  "battery": 85,
  "temperature": 24.5,
  "position": {
    "x": 0,
    "y": 0,
    "orientation": 0
  },
  "sensors": {
    "lidar": true,
    "camera": true,
    "imu": true
  }
}
```

## 📝 Logs d'exécution

Les scripts affichent des logs détaillés :
```
✅ Robot ajouté avec succès en mode idle!
📋 Détails du robot:
   Nom: Robot-Idle-001
   Série: TB4-1738123456
   Modèle: TurtleBot4
   Statut: idle (idle)
   Batterie: 85%
   Température: 24.5°C
   Position: X=0, Y=0
   Capteurs: LIDAR=ON, Camera=ON, IMU=ON
```

## 🐛 Dépannage

### Erreur: "Serveur non détecté"
```bash
# Démarrez le serveur
npm run dev
```

### Erreur: "Node.js non installé"
```bash
# Installez Node.js
# Windows: https://nodejs.org/
# Mac: brew install node
# Linux: sudo apt install nodejs npm
```

### Erreur: "Numéro de série existe déjà"
Le script génère automatiquement des numéros uniques avec timestamp.

## 🎨 Intégration visuelle

Le robot ajouté sera visible dans :
- **Dashboard** : grille avec badge jaune
- **Page Robots** : section "En attente" en jaune
- **Tableau gestion** : badge jaune avec bordure
- **Détails techniques** : statut idle en jaune

Tous les éléments utilisent la couleur jaune cohérente définie dans les variables CSS.
