// generate-hash.js
import bcrypt from 'bcrypt';

const plainPassword = 'student1pass';

bcrypt.hash(plainPassword, 10).then((hashedPassword) => {
  console.log("✅ Hashed password:", hashedPassword);
});
