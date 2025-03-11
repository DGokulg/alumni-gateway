
import express from 'express';
import { auth } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// Get user profile
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add connection
router.post('/connections/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!user || !targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.connections.includes(req.params.id)) {
      user.connections.push(req.params.id);
      targetUser.connections.push(req.user.id);
      await user.save();
      await targetUser.save();
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
