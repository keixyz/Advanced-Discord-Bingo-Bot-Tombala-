const mongoose = require('mongoose');

const tombalaStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  totalGames: { type: Number, default: 0 },
  winCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('TombalaStats', tombalaStatsSchema);
