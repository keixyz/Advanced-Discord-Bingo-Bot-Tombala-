const { EmbedBuilder } = require('discord.js');
const tombalaData = require('../../data/tombalaData');

module.exports = {
  customId: 'show_numbers',
  async execute(interaction) {
    if (!tombalaData.oyunBaslatildi) {
      return interaction.reply({ content: '❗ Oyun henüz başlamamış. Çekilen sayı yok.', ephemeral: true });
    }

    const tumSayilar = Array.from({ length: 90 }, (_, i) => i + 1).filter(n => !tombalaData.sayilar.includes(n));

    const bloklu = [];
    for (let i = 0; i < tumSayilar.length; i += 10) {
      bloklu.push(tumSayilar.slice(i, i + 10).join(', '));
    }

    const embed = new EmbedBuilder()
      .setColor('#F1C40F')
      .setTitle('Çekilen Sayılar')
      .setDescription(bloklu.length > 0 ? bloklu.join('\n') : 'Henüz sayı çekilmedi.')
      .setFooter({ text: `Toplam: ${tumSayilar.length} sayı çekildi.` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
