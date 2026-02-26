import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["text", "system"], default: "text" },
},{ timestamps: true });

export default mongoose.model("Message", messageSchema);
