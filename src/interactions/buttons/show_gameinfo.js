const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const tombalaData = require('../../data/tombalaData');

function createOyunBilgiEmbed() {
  const cekilen = 90 - tombalaData.sayilar.length;
  const sonSayilar = Array.from({ length: 90 }, (_, i) => i + 1)
    .filter(n => !tombalaData.sayilar.includes(n))
    .slice(-5);

  return new EmbedBuilder()
    .setColor('#1ABC9C')
    .setTitle('🎲 Tombala Oyun Durumu')
    .addFields(
      { name: 'Oyun Durumu', value: tombalaData.oyunBaslatildi ? 'Aktif' : 'Aktif Oyun Yok', inline: true },
      { name: 'Çekilen Sayı', value: `${cekilen}/90`, inline: true },
      { name: 'Katılımcı Sayısı', value: `${tombalaData.katilimcilar.length}`, inline: true },
      { name: 'Kalan Kart', value: `${tombalaData.kartlar.length}`, inline: true },
      { name: 'Son Sayılar', value: sonSayilar.length ? sonSayilar.join(', ') : 'Henüz yok', inline: false }
    )
    .setFooter({ text: 'Tombala Bot' })
    .setTimestamp();
}

module.exports = {
  customId: 'show_gameinfo',
  async execute(interaction) {
    const embed = createOyunBilgiEmbed();

    const refreshButton = new ButtonBuilder()
      .setCustomId('refresh_gameinfo')
      .setLabel('Yenile')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(refreshButton);

    await interaction.reply({ embeds: [embed], components: [row], flags: 64 });
  }
};
