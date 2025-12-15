const { PermissionsBitField } = require('discord.js');
const config = require('../../config/config.json');
const tombalaData = require('../../data/tombalaData');
const { startTombalaGame } = require('../../utils/tombalaUtils');

module.exports = {
  customId: 'start_game',
  async execute(interaction) {
    const yetkiliRoller = Array.isArray(config.yetkiliRoller) ? config.yetkiliRoller : [];
    const hasRole = interaction.member.roles.cache.some(role =>
      yetkiliRoller.includes(role.id)
    );
    const hasPerm = interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles);

    if (!hasRole || !hasPerm) {
      return interaction.reply({
        content: '❌ Bu butonu kullanmak için yetkin yok!',
        ephemeral: true,
        flags: 64,
      });
    }

    if (tombalaData.oyunBaslatildi) {
      return interaction.reply({
        content: '❗ Oyun zaten başlamış!',
        ephemeral: true,
        flags: 64,
      });
    }

    tombalaData.oyunBaslatildi = true;
    tombalaData.sayilar = Array.from({ length: 90 }, (_, i) => i + 1);

    await interaction.reply({
      content: '✅ Oyun başlatıldı!',
      ephemeral: true,
      flags: 64,
    });

    startTombalaGame(interaction.channel);
  },
};
