// backend/routes/protected.js


import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import requireRole from '../middleware/requireRole.js';


router.get('/any', verifyToken, (req, res) => {
  res.json({ message: '✅ You are authenticated', user: req.user });
});

router.get('/faculty', verifyToken, requireRole('faculty', 'admin'), (req, res) => {
  res.json({ message: '✅ Hello Faculty/Admin', user: req.user });
});

router.get('/admin', verifyToken, requireRole('admin'), (req, res) => {
  res.json({ message: '✅ Welcome Admin', user: req.user });
});

export default router; // ✅ required!
