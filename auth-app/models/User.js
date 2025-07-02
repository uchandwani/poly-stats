// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' }, // ✅ Add this line
});


module.exports = mongoose.model('User', userSchema);
