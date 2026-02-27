import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, unique: true, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "editor",
        },
      },
    ],
    language: { type: String,enum : ["javascript","python", "c++", "Java"], default: "javascript" },
    code: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
