const Booking = require("../models/Booking");
const Room = require("../models/Room");

// =================================
// CREATE BOOKING
// =================================
const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, paymentMethod } = req.body;
    // Validate required fields
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "Please provide room, check-in, check-out and guests",
      });
    }

    // Find room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // Check room availability
    if (!room.available) {
      return res.status(400).json({
        message: "This room is currently unavailable",
      });
    }

    // Validate guest capacity
    if (guests > room.maxGuests) {
      return res.status(400).json({
        message: `Maximum guests allowed is ${room.maxGuests}`,
      });
    }

    // Convert dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // Calculate number of nights
    const timeDifference = checkOutDate - checkInDate;

    const nights = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
    );

    // Calculate total price
    const totalPrice = nights * room.price;
    // Check again for overlapping bookings before creating
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: "This room is already booked for the selected dates",
      });
    }
    // Create booking
const booking = await Booking.create({
  user: req.user._id,
  room: roomId,
  checkIn: checkInDate,
  checkOut: checkOutDate,
  guests,
  nights,
  totalPrice,
  paymentStatus: "paid",
  paymentMethod: paymentMethod || "demo",
});

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
  console.error("CREATE BOOKING ERROR:", error);

  res.status(500).json({
    message: "Booking failed",
    error: error.message,
  });
}
};

// =================================
// GET MY BOOKINGS
// =================================
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("room", "name type image price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// =================================
// CANCEL BOOKING
// =================================
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Make sure booking belongs to logged-in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};
// ==========================================
// ADMIN UPDATE BOOKING STATUS
// ==========================================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "confirmed",
      "cancelled",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("room", "name type price image");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = status;

    await booking.save();

    const updatedBooking = await Booking.findById(
      booking._id
    )
      .populate("user", "name email")
      .populate("room", "name type price image");

    res.status(200).json({
      message: `Booking marked as ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};
// =========================================
// GET ALL BOOKINGS - ADMIN
// =========================================

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("room", "name type image price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all bookings",
      error: error.message,
    });
  }
};
// =================================
// CHECK ROOM AVAILABILITY
// =================================
const checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    // Validate required fields
    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "Please provide check-in, check-out and guests",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guestCount = Number(guests);

    // Validate dates
    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid check-in or check-out date",
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // Validate guests
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        message: "Guests must be at least 1",
      });
    }

    // Find rooms that are generally available
    const rooms = await Room.find({
      available: true,
      maxGuests: { $gte: guestCount },
    });

    // Find bookings that overlap the requested dates
    const overlappingBookings = await Booking.find({
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).select("room");

    const bookedRoomIds = new Set(
      overlappingBookings.map((booking) =>
        booking.room.toString()
      )
    );

    // Remove rooms that are already booked
    const availableRooms = rooms.filter(
      (room) => !bookedRoomIds.has(room._id.toString())
    );

    res.status(200).json({
      count: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check availability",
      error: error.message,
    });
  }
};
module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  checkAvailability,
  updateBookingStatus,
};