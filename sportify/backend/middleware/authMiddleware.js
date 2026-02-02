import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Middleware to verify JWT token and attach user info to request
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check for presence and format of Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "⚠️ No token provided in Authorization header." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part

  try {
    // ✅ Use JWT_SECRET from .env, fallback if missing
    const secret = process.env.JWT_SECRET || "your-default-secret";

    // 🔐 Verify token
    const decoded = jwt.verify(token, secret);

    console.log("✅ Token Verified. User:", decoded); // Debug log

    req.user = decoded; // Attach decoded payload (user ID, role, etc.)
    next(); // Pass control to the next middleware/route
  } catch (err) {
    console.error("❌ JWT Verification Error:", err.message); // Log detailed error

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "⏰ Token expired. Please login again." });
    }

    return res.status(401).json({ message: "❌ Invalid or expired token." });
  }
};
