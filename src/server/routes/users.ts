
import express from 'express';
import { auth } from '../middleware/auth';
import User from '../models/User';
import mongoose from 'mongoose';

const router = express.Router();

// Get user profile
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: req.body },
      { new: true }
    ).exec();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add connection
router.post('/connections/:id', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const connectionId = req.params.id;
    
    // Check if valid ObjectIds
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(connectionId)) {
      return res.status(400).json({ msg: 'Invalid user ID format' });
    }
    
    const user = await User.findById(userId).exec();
    const targetUser = await User.findById(connectionId).exec();

    if (!user || !targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if connections property exists and is an array
    if (!Array.isArray(user.connections)) {
      user.connections = [];
    }
    
    if (!Array.isArray(targetUser.connections)) {
      targetUser.connections = [];
    }

    // Check if connection already exists
    if (!user.connections.some(conn => conn.toString() === connectionId)) {
      user.connections.push(new mongoose.Types.ObjectId(connectionId));
      targetUser.connections.push(new mongoose.Types.ObjectId(userId));
      await user.save();
      await targetUser.save();
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
