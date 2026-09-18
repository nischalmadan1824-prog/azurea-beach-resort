const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile Route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile",
    user: req.user,
  });
});

module.exports = router;