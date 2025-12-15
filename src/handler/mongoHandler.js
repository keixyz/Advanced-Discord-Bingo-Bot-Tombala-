const mongoose = require('mongoose');
const config = require('../config/config.json');

module.exports = async () => {
  const mongoUri = config.mongoUri?.trim();
  if (!mongoUri) {
    console.warn('[MONGO] MongoDB bağlantı adresi config içinde tanımlı değil.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB bağlantısı başarılı.');
  } catch (err) {
    console.error('❌ MongoDB bağlantı hatası:', err);
    process.exit(1);
  }
};
