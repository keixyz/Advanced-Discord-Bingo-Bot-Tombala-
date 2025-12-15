const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
  name: 'tombalakur',
  description: 'Tombala oyununu başlatır.',
  async execute(message, client, args) {
    if (!message.guild || !message.member) {
      return message.reply('❌ Bu komut sadece sunucuda kullanılabilir.');
    }

    const yetkiliRoller = Array.isArray(config.yetkiliRoller) ? config.yetkiliRoller : [];
    const hasYetki = yetkiliRoller.some(roleId => message.member.roles.cache.has(roleId));
    const hasPermission = message.member.permissions.has(PermissionsBitField.Flags.ManageRoles);

    if (!hasYetki && !hasPermission) {
      return message.reply('❌ Bu komutu kullanmaya yetkin yok reis.');
    }

    const joinButton = new ButtonBuilder()
      .setCustomId('join_game')
      .setLabel('Oyuna Katıl')
      .setStyle(ButtonStyle.Primary);

    const startButton = new ButtonBuilder()
      .setCustomId('start_game')
      .setLabel('Oyunu Başlat')
      .setStyle(ButtonStyle.Success);

    const showParticipantsButton = new ButtonBuilder()
      .setCustomId('show_participants')
      .setLabel('Katılımcılar')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(joinButton, startButton, showParticipantsButton);

    const katilimciRolId = config.katilimciRolId?.trim();
    if (!katilimciRolId) {
      return message.reply('❌ Katılımcı rolü config içinde tanımlı değil.');
    }

    const tombalaEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎉 Tombala Başladı! 🎉')
      .setDescription(
        `Tombala oyununa katılmak için aşağıdaki adımları takip edin:\n\n` +
        `🔹 Oyuna Katıl: “Oyuna Katıl” butonuna basarak giriş yapın.\n` +
        `🔹 Katılım Şartı: Sadece <@&${katilimciRolId}> rolüne sahip oyuncular katılabilir.\n\n` +
        `🛑 Sınırlı Kontenjan: Maksimum 30 kişi ile sınırlıdır, yerinizi hemen alın! 🚀`
      );

    await message.reply({
      embeds: [tombalaEmbed],
      components: [row],
    });
  },
};

