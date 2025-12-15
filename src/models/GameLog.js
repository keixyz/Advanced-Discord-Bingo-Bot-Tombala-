const mongoose = require('mongoose');

const gameLogSchema = new mongoose.Schema({
  userId: String,
  username: String,
  won: Boolean,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameLog', gameLogSchema);
