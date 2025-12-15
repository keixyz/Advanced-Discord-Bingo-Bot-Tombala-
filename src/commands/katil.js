const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config/config.json');
const tombalaData = require('../data/tombalaData');

module.exports = {
  name: 'katıl',
  description: 'Katılmayan kullanıcıları listeler.',
  async execute(message) {
    const yetkiliRoller = Array.isArray(config.yetkiliRoller) ? config.yetkiliRoller : [];
    const hasYetki = yetkiliRoller.some(roleId => message.member.roles.cache.has(roleId));
    const hasPerm = message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);
    if (!hasYetki && !hasPerm) {
      return message.reply({ content: '❌ Bu komutu kullanmaya yetkin yok.', ephemeral: true });
    }

    const rolId = config.katilimciRolId?.trim();
    if (!rolId) {
      return message.reply('❌ Katılımcı rolü config içinde tanımlı değil.');
    }
    const rol = message.guild.roles.cache.get(rolId);
    if (!rol) return message.reply('❌ Belirtilen rol bulunamadı.');

    try {
      await message.guild.members.fetch();

      const roldekiUyeler = message.guild.members.cache
        .filter(member => member.roles.cache.has(rolId) && !member.user.bot)
        .map(member => member.user);
      const uniqueKatilanlar = [...new Map(tombalaData.katilimcilar.map(u => [u.id, u])).values()];
      const katilmamisUyeler = roldekiUyeler.filter(
        user => !uniqueKatilanlar.some(katilimci => katilimci.id === user.id)
      );

      if (katilmamisUyeler.length === 0) {
        return message.reply('✅ Katılmayan kimse kalmamış, herkes oyunda!');
      }

      const mentionList = katilmamisUyeler
        .map(user => `<@${user.id}> - (\`${user.id}\`)`)
        .join('\n')
        .slice(0, 4000);

      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('🛑 Katılmayan Oyuncular')
        .setDescription(mentionList || 'Yok gibi duruyor.')
        .setFooter({
          text: `Katılmayan: ${katilmamisUyeler.length} kişi | Katılan: ${uniqueKatilanlar.length} kişi`
        })
        .setTimestamp();

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.error('Katıl komutu hatası:', err);
      return message.reply('❌ Bir hata oluştu, üyeleri fetch edemedim.');
    }
  }
};
