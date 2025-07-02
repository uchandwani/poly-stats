exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ 1. Allow guest login for development
    if (username === "guest" && password === "guest") {
      const guestToken = jwt.sign(
        { userId: "guest-id", username: "guest", role: "guest" },
        process.env.JWT_SECRET,
        { expiresIn: "6h" }
      );

      return res.json({
        message: "Guest login successful",
        token: guestToken,
        user: {
          id: "guest-id",
          username: "guest",
          role: "guest",
        },
      });
    }

    // 🔐 2. Normal login logic
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
