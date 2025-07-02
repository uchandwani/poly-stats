// auth-app/migrateUsers.js

require('dotenv').config();
const mongoose = require('mongoose');

// Source: polyStats
const sourceConn = mongoose.createConnection('mongodb://localhost:27017/poly-stats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Destination: polyStatsAuth
const destConn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Source user schema (passwordHash)
const SourceUser = sourceConn.model('User', new mongoose.Schema({
  username: String,
  role: String,
  passwordHash: String,
}, { collection: 'users' }));


const destUserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: String,
}, { collection: 'users' });

const DestUser = destConn.model('User', destUserSchema);


async function migrateUsers() {
  try {
    const users = await SourceUser.find({});
    console.log(`Found ${users.length} users. Migrating...`);

    for (const user of users) {
    console.log(`Preparing to migrate:`, user);  // 👈 add this line
    await DestUser.updateOne(
      { username: user.username },
      {
        username: user.username,
        password: user.passwordHash,
        role: user.role || 'student',
      },
      { upsert: true }
    );
    console.log(`✅ Migrated: ${user.username}`);
  }

    console.log('🎉 All users migrated to polyStatsAuth.users');
  } catch (err) {
    console.error('❌ Error during migration:', err);
  } finally {
    await sourceConn.close();
    await destConn.close();
  }
}

migrateUsers();
