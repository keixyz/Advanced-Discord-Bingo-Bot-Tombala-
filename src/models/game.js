const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  kart: {
    kartNumarasi: Number,
    sayilar: [Number]
  },
  isaretlenenSayilar: { type: [Number], default: [] },
  tamamlandi: { type: Boolean, default: false }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  gameStatus: { type: String, enum: ['active', 'finished'], default: 'active' },
  cekilenSayilar: { type: [Number], default: [] },
  oyuncular: [playerSchema],
  winners: [{ type: String }],
  startedAt: { type: Date, default: Date.now },
  finishedAt: { type: Date }
});

module.exports = mongoose.model('Game', gameSchema);
