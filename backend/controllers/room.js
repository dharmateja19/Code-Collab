import Room from "../models/Room.js";
import crypto from "crypto";

export const createRoom = async (req, res) => {
  try {
    const roomId = crypto.randomBytes(4).toString("hex");
    const room = await Room.create({
      roomId,
      owner: req.user.id,
      participants: [
        {
          user: req.user.id,
          role: "owner",
        },
      ],
    });

    return res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while creating room" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "room not found" });
    }

    const existingParticipant = room.participants.find(
      (p) => p.user.toString() === req.user.id,
    );

    if (!existingParticipant) {
      room.participants.push({
        user: req.user.id,
        role: "editor",
      });
      await room.save();
    }

    return res.status(200).json({ message: "joined room successfully", room });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "errot while joining" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId }).populate(
      "participants.user",
      "name email",
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(200).json(room);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while getting room" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "room not found" });
    }
    if (room.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "only owner can delete the room" });
    }

    await Room.deleteOne({ roomId });
    return res.status(200).json({ message: "room deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while deleting room" });
  }
};

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "room not found" });
    }
    if (room.owner.toString() === req.user.id) {
      await Room.deleteOne({ roomId });
      return res.status(200).json({ message: "Owner left. Room deleted" });
    }
    room.participants = room.participants.filter(
      (p) => p.user.toString() !== req.user.id,
    );

    await room.save();
    return res.status(200).json({ message: "left successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while leaving room" });
  }
};
