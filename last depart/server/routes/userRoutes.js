const express = require("express");
const router = express.Router();
const LogInCollection = require("../models/login");  // Adjust path as needed

// POST: Register a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await LogInCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new LogInCollection({ email, password });
    await newUser.save();

    // Send back a response with the user ID and a success message
    res.status(200).json({ message: "User registered successfully", userId: newUser._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// POST: Login the user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await LogInCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Send the userId and a message back to the client
    res.status(200).json({
      message: 'Login successful',
      userId: user._id,  // Return the userId (MongoDB _id)
      token: "someGeneratedTokenHere"  // You can add token generation logic if needed
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
