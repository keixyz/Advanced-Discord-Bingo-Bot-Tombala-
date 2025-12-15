const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config/config.json');
const tombalaData = require('../../data/tombalaData');

module.exports = {
  customId: 'show_participants',
  async execute(interaction) {
    const yetkiliRoller = Array.isArray(config.yetkiliRoller) ? config.yetkiliRoller : [];
    const hasRole = interaction.member.roles.cache.some(role =>
      yetkiliRoller.includes(role.id)
    );
    const hasPerm = interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles);

    if (!hasRole || !hasPerm) {
      return interaction.reply({
        content: '❌ Katılımcı listesini görüntülemek için yetkin yok.',
        ephemeral: true,
        flags: 64,
      });
    }

    if (tombalaData.katilimcilar.length === 0) {
      return interaction.reply({
        content: '📭 Henüz kimse katılmamış.',
        ephemeral: true,
        flags: 64,
      });
    }

    const liste = tombalaData.katilimcilar
      .map((u, i) => `\`${i + 1}.\` <@${u.id}> | Kart No: \`${u.kart.kartNumarasi}\``)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('👥 Katılımcı Listesi')
      .setDescription(liste)
      .setFooter({ text: `Toplam Katılımcı: ${tombalaData.katilimcilar.length}` });

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
      flags: 64,
    });
  },
};
