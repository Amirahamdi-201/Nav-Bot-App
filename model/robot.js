import mongoose from "mongoose";

const robotSchema = new mongoose.Schema(
  {
    serialNumber: { 
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
    model: { 
      type: String, 
      required: true, 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ["online", "offline", "mission", "emergency", "broken-down"], 
      default: "offline" 
    },
    currentState: {
      battery: { 
        type: Number, 
        min: 0, 
        max: 100, 
        default: 0 
      },
      temperature: { 
        type: Number, 
        default: 0 
      },
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        orientation: { type: Number, default: 0 }
      },
      lastUpdate: { 
        type: Date, 
        default: Date.now 
      }
    },
    sensors: {
      lidar: { type: Boolean, default: false },
      camera: { type: Boolean, default: false },
      imu: { type: Boolean, default: false }
    }
  },
  { 
    timestamps: true // createdAt et updatedAt automatiques
  }
);

// Export nommé pour éviter les erreurs Next.js
export const Robot = mongoose.models.Robot || mongoose.model("Robot", robotSchema);