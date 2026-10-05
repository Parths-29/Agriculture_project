import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, password, village, language } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // In a real app, hash the password here (e.g., using bcrypt)
    const newUser = new User({
      name,
      phone,
      password, // Storing in plain text for simplicity per current mock implementation
      village,
      language
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'No account found with this phone number' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
