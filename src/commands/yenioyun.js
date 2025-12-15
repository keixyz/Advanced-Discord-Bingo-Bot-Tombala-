const { PermissionsBitField } = require('discord.js');
const config = require('../config/config.json');
const { resetTombala } = require('../utils/tombalaUtils');
module.exports = {
  name: 'tnew',
  description: 'Oyunu sıfırlar ve yeniden başlatmak için hazır hale getirir.',
  async execute(message) {
    const yetkiliRoller = Array.isArray(config.yetkiliRoller) ? config.yetkiliRoller : [];
    const hasRole = message.member.roles.cache.some(role =>
      yetkiliRoller.includes(role.id)
    );
    const hasPerm = message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);

    if (!hasRole || !hasPerm) {
      return message.reply('❌ Bu komutu kullanmak için yetkili rol ve **Rolleri Yönet** iznine sahip olmalısın.');
    }
    resetTombala();
    return message.reply('🔄 Oyun sıfırlandı! Yeni oyun başlatmak için butonu kullanabilirsin.');
  },
};
