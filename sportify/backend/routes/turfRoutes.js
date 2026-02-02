import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import Turf from "../models/Turf.js";

const router = express.Router();

// ✅ Route: POST /api/turfs/add
router.post(
  "/add",
  verifyToken,
  upload.array("images", 5), // Accept up to 5 images
  async (req, res) => {
    try {
      if (req.user.role !== "owner") {
        return res.status(403).json({ message: "Access denied. Only owners can register turfs." });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "At least one image is required." });
      }

      const { name, location, description, contact, price, size } = req.body;

      if (!name || !location || !description || !contact || !price || !size) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const imagePaths = req.files.map((file) => file.filename);

      const newTurf = new Turf({
        ownerId: req.user.id,
        name,
        location,
        description,
        contact,
        price,
        size,
        images: imagePaths,
      });

      await newTurf.save();

      res.status(201).json({ message: "✅ Turf registered successfully!" });
    } catch (err) {
      console.error("❌ Turf registration error:", err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
);

// ✅ Route: GET /api/turfs/all - fetch all turfs
router.get("/all", async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (err) {
    console.error("Error fetching turfs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Route: GET /api/turfs/:id - fetch single turf by ID
router.get("/:id", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    res.json(turf);
  } catch (err) {
    console.error("Error fetching turf by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
