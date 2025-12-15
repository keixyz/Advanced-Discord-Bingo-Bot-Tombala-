const { EmbedBuilder } = require('discord.js');
const tombalaData = require('../../data/tombalaData');

module.exports = {
  customId: 'show_card',
  async execute(interaction) {
    const player = tombalaData.katilimcilar.find(u => u.id === interaction.user.id);

    if (!player) {
      return interaction.reply({ content: '❌ Oyuna katılmadığın için kartın yok.', ephemeral: true });
    }

    const orijinalSayilar = player.kart.orijinalSayilar || player.kart.sayilar;
    const kalanSayilar = player.kart.sayilar;
    const isaretlenenSayilar = orijinalSayilar.filter(n => !kalanSayilar.includes(n));

    const isaretlenenStr = isaretlenenSayilar.length > 0 ? isaretlenenSayilar.map(n => `~~${n}~~`).join(', ') : 'Yok';
    const kalanStr = kalanSayilar.length > 0 ? kalanSayilar.join(', ') : '🎉 Hiç sayı kalmadı!';

    const embed = new EmbedBuilder()
      .setColor('#3498DB')
      .setTitle(`${interaction.user.username} - Kart Bilgisi`)
      .addFields(
        { name: 'Kart Numarası', value: `${player.kart.kartNumarasi}`, inline: true },
        { name: 'İşaretlenen Sayılar', value: isaretlenenStr, inline: false },
        { name: 'Kalan Sayılar', value: kalanStr, inline: false }
      )
      .setImage(player.kart.resimUrl)
      .setFooter({ text: 'Tombala Bot' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
