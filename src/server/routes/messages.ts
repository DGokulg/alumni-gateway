
import express from 'express';
import { auth } from '../middleware/auth';
import { Message } from '../models/Message';

const router = express.Router();

// Get conversations for a user
router.get('/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id },
        { receiverId: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const newMessage = new Message({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      content: req.body.content
    });

    const message = await newMessage.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Mark messages as read
router.put('/read/:userId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        senderId: req.params.userId,
        receiverId: req.user.id,
        read: false
      },
      { $set: { read: true } }
    );
    
    res.json({ msg: 'Messages marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
