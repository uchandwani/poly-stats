// backend/routes/statsRoutes.js
import express from 'express';
const router = express.Router();
import authenticateToken from '../middleware/authMiddleware.js';

// Protected route
router.get('/secure-data', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, here is your secure data.` });
});

export default router; // ✅ required!
