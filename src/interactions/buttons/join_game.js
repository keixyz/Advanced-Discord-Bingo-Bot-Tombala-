const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config/config.json');
const tombalaData = require('../../data/tombalaData');
module.exports = {
  customId: 'join_game',
  async execute(interaction) {
    if (tombalaData.oyunBaslatildi) {
      return interaction.reply({
        content: '🎮 Oyun şu anda aktif, yeni oyuncu kabul edilmiyor!',
        ephemeral: true,
        flags: 64,
      });
    }
    const katilimciRolId = config.katilimciRolId?.trim();
    if (!katilimciRolId) {
      return interaction.reply({
        content: '❌ Katılımcı rolü config içinde tanımlı değil.',
        ephemeral: true,
        flags: 64,
      });
    }

    const hasRole = interaction.member.roles.cache.has(katilimciRolId);

    if (!hasRole) {
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Rol Gerekli')
        .setDescription(`Bu oyuna katılmak için <@&${katilimciRolId}> rolüne sahip olmalısın.`);
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
        flags: 64,
      });
    }
    if (tombalaData.katilimcilar.some(u => u.id === interaction.user.id)) {
      return interaction.reply({
        content: '✅ Zaten oyuna katıldınız!',
        ephemeral: true,
        flags: 64,
      });
    }
    if (tombalaData.kartlar.length === 0) {
      return interaction.reply({
        content: '📦 Maalesef tüm kartlar tükenmiş!',
        ephemeral: true,
        flags: 64,
      });
    }

    const kart = tombalaData.kartlar.splice(
      Math.floor(Math.random() * tombalaData.kartlar.length),
      1
    )[0];
    const kartWithOriginals = {
      ...kart,
      orijinalSayilar: [...kart.sayilar],
    };

    tombalaData.katilimcilar.push({
      id: interaction.user.id,
      kart: kartWithOriginals,
    });

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Oyun Kartınız')
      .addFields(
        { name: 'Kart Numarası', value: kart.kartNumarasi.toString(), inline: true },
        { name: 'Sayılar', value: kart.sayilar.join(', '), inline: true }
      )
      .setImage(kart.resimUrl);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
      flags: 64,
    });
  },
};
