import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
  missionCode: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ["manual", "exploration", "adaptive", "autonomous"], 
    default: "autonomous" 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ["pending", "assigned", "running", "completed", "stopped", "emergency", "failed"], 
    default: "pending" 
  },
  priority: { 
    type: String, 
    required: true, 
    enum: ["low", "normal", "high", "urgent"], 
    default: "normal" 
  },
  robotId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Robot", 
    default: null 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  mapId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Map", 
    default: null 
  },
  destination: {
    x: { 
      type: Number, 
      required: true 
    },
    y: { 
      type: Number, 
      required: true 
    }
  },
  trajectory: {
    algorithm: { 
      type: String, 
      default: "A*" 
    },
    path: [{ 
      x: Number, 
      y: Number, 
      timestamp: Date 
    }],
    recalculated: { 
      type: Boolean, 
      default: false 
    }
  },
  energyConsumed: { 
    type: Number, 
    default: 0 
  },
  startTime: { 
    type: Date, 
    default: null 
  },
  endTime: { 
    type: Date, 
    default: null 
  },
  duration: { 
    type: Number, 
    default: null 
  },
  errorMessage: { 
    type: String, 
    default: null 
  },
  logs: [{
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    level: { 
      type: String, 
      enum: ["info", "warning", "error", "debug"], 
      default: "info" 
    },
    message: { 
      type: String, 
      required: true 
    },
    data: { 
      type: mongoose.Schema.Types.Mixed 
    }
  }]
}, { 
  timestamps: true 
});

// Index pour optimiser les requêtes
missionSchema.index({ status: 1 });
missionSchema.index({ priority: 1 });
missionSchema.index({ robotId: 1 });
missionSchema.index({ createdAt: -1 });
missionSchema.index({ missionCode: 1 }, { unique: true });

// Export nommé pour éviter les erreurs Next.js
export const Mission = mongoose.models.Mission || mongoose.model("Mission", missionSchema);
