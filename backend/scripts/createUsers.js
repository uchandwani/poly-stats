// backend/scripts/createUsers.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/User");

const users = [
  { username: "Student1", password: "student1pass", role: "student" },
  { username: "Student2", password: "student2pass", role: "student" },
  { username: "Faculty1", password: "faculty1pass", role: "faculty" },
  { username: "Faculty2", password: "faculty2pass", role: "faculty" },
  { username: "Admin",    password: "adminpass",    role: "admin" }
];

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const { username, password, role } of users) {
      const existing = await User.findOne({ username });
      if (existing) {
        console.log(`⚠️  Skipping ${username}: already exists`);
        continue;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ username, role, passwordHash });
      await user.save();

      console.log(`✅ Created ${username} (${role})`);
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error creating users:", err);
    mongoose.connection.close();
  }
}

createUsers();
