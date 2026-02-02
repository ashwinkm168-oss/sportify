import mongoose from "mongoose";

const turfSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  location: String,
  description: String,
  contact: String,
  price: Number,
  size: String,
  images: [String],
}, { timestamps: true });

const Turf = mongoose.model("Turf", turfSchema);
export default Turf;
