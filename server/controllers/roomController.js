const Room = require("../models/Room");

// =================================
// GET ALL ROOMS
// =================================
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};

// =================================
// GET SINGLE ROOM
// =================================
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};

// =================================
// CREATE ROOM
// =================================
const createRoom = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      price,
      maxGuests,
      image,
      amenities,
      available,
    } = req.body;

    if (
      !name ||
      !type ||
      !description ||
      !price ||
      !maxGuests ||
      !image
    ) {
      return res.status(400).json({
        message: "Please provide all required room details",
      });
    }

    const room = await Room.create({
      name,
      type,
      description,
      price,
      maxGuests,
      image,
      amenities,
      available,
    });

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create room",
      error: error.message,
    });
  }
};

// =================================
// UPDATE ROOM
// =================================
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update room",
      error: error.message,
    });
  }
};

// =================================
// DELETE ROOM
// =================================
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete room",
      error: error.message,
    });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};