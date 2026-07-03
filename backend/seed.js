/** Seed the chat database. Usage: npm run seed */
require('dotenv').config();
const mongoose = require('mongoose');
const runSeed = require('./seedRunner');

runSeed()
  .then((r) => {
    console.log(`✓ Seeded ${r.users} users, ${r.rooms} rooms, ${r.messages} messages.`);
    console.log('  Login: amar@chat.io / demo123 (also selam@ and dawit@)');
    return mongoose.connection.close();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
  });
