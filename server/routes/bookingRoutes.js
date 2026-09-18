const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  checkAvailability,
  updateBookingStatus,
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// =================================
// CHECK ROOM AVAILABILITY
// PUBLIC ROUTE
// =================================

router.get(
  "/availability",
  checkAvailability
);

// =================================
// CUSTOMER
// =================================

router.post(
  "/",
  protect,
  createBooking
);

router.get(
  "/my-bookings",
  protect,
  getMyBookings
);

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

// =================================
// ADMIN
// =================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllBookings
);

router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateBookingStatus
);

module.exports = router;