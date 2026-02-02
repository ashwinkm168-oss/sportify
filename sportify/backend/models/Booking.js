import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turf",
    required: true,
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  slot: {
    type: String, // Format: "08:00 AM - 09:00 AM"
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("Booking", bookingSchema);