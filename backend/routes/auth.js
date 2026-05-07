const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    console.log("SIGNUP HIT");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ msg: "User registered successfully" });

  } catch (err) {
    console.log("❌ SIGNUP ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN HIT");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // TOKEN
    const token = jwt.sign(
      { id: user._id },
      "secret123",   // ⚠️ keep SAME everywhere
      { expiresIn: "1d" }
    );

    res.json({
      token,
      userId: user._id
    });

  } catch (err) {
    console.log("❌ LOGIN ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;