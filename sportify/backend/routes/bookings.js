import express from "express";
import Booking from "../models/Booking.js";
import Turf from "../models/Turf.js";
import { verifyToken } from "../middleware/authMiddleware.js";




const router = express.Router();

// ✅ Create a booking
router.post("/create", verifyToken, async (req, res) => {

  const { turfId, date, slot } = req.body;

  if (!turfId || !date || !slot) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Check for duplicate booking
  const alreadyBooked = await Booking.findOne({ turfId, date, slot });
  if (alreadyBooked) {
    return res.status(409).json({ message: "Slot already booked" });
  }

  const booking = new Booking({
    turfId,
    playerId: req.user.id,
    date,
    slot,
  });

  await booking.save();
  res.status(201).json({ message: "Booking confirmed" });
});

// ✅ Get booked slots for a turf on a given date
router.get("/slots/:turfId/:date", async (req, res) => {
  const { turfId, date } = req.params;

  const bookings = await Booking.find({ turfId, date });
  const slots = bookings.map(b => b.slot);
  res.json(slots);
});


// ✅ Get all bookings for a player
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "player") {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find({ playerId: req.user.id })
      .populate("turfId") // includes turf details
      .sort({ date: -1, slot: 1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Cancel a booking
router.delete("/cancel/:id", verifyToken, async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);

    // Optional: Check if the booking belongs to the logged-in user
    if (!booking || booking.playerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized or booking not found" });
    }

    await Booking.findByIdAndDelete(bookingId);
    res.json({ message: "✅ Booking cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel error:", err);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});


// 📌 Get bookings for all turfs owned by the logged-in owner
router.get("/owner", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Access denied." });
    }

    // Get all turfs owned by this user
    const turfs = await Turf.find({ ownerId: req.user.id });

    const turfIds = turfs.map((t) => t._id);

    const bookings = await Booking.find({ turfId: { $in: turfIds } }).populate("turfId playerId");

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching owner's bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
