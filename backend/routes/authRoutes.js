console.log("✅ authRoutes.js loaded");

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // ✅ adjust if your path differs

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`🔐 Login request for username: ${username}`);

  try {
    const user = await User.findOne({ username });

    if (!user) {
      console.warn(`❌ No user found with username: ${username}`);
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.warn(`🚫 Invalid password for user: ${username}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: '1h',
    });

    console.log(`✅ Successful login for ${username}`);
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(`💥 Error during login for ${username}:`, err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
