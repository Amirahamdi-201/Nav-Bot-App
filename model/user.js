import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Number,
      enum: [0, 1],
      default: 0, // 0 = simple user | 1 = admin
    },
    lastLogin: {
      type: Date,
      default: null, // null = première connexion
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
