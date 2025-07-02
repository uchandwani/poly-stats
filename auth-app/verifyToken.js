// auth-app/verifyToken.js
const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODVhMjUxN2JkYmFhZTU3YzkxNjlmNWUiLCJpYXQiOjE3NTA3NDM2MjcsImV4cCI6MTc1MDc0NzIyN30.ZRFvQwNbbkTWgc4zM6BFCqYNRGoA6Jr3cTs2iE1WMUc';
const secret = 'supersecretkey'; // same as your .env JWT_SECRET

try {
  const decoded = jwt.verify(token, secret);
  console.log('✅ Token is valid');
  console.log('Decoded payload:', decoded);
} catch (err) {
  console.error('❌ Invalid token:', err.message);
}
