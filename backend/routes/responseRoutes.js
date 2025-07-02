import express from 'express';
const router = express.Router();
import StudentResponse from '../models/StudentResponse.js';

router.post('/', async (req, res) => {
  try {
    const { exerciseId, userId, answer } = req.body;

    if (!exerciseId || !userId || !answer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newResponse = new StudentResponse({ exerciseId, userId, answer });
    await newResponse.save();

    res.status(201).json({ message: 'Response saved successfully' });
  } catch (err) {
    console.error('❌ Error saving response:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; // ✅ required!
