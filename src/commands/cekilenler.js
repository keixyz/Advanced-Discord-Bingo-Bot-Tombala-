const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const tombalaData = require('../data/tombalaData');

module.exports = {
  name: 'tdraw',
  description: 'Şu ana kadar çekilmiş tüm sayıları listeler.',
  async execute(message) {
    if (!tombalaData.oyunBaslatildi) {
      return message.reply('❗ Oyun henüz başlamamış. Çekilen sayı yok.');
    }

    const embed = new EmbedBuilder()
      .setColor('#F1C40F')
      .setTitle('📊 Çekilen Sayılar')
      .setDescription('Aşağıdaki butona basarak çekilen sayıları görebilirsiniz.')
      .setFooter({ text: `Toplam: ${90 - tombalaData.sayilar.length} sayı çekildi.` });

    const button = new ButtonBuilder()
      .setCustomId('show_numbers')
      .setLabel('Çekilen Sayıları Göster')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.reply({ embeds: [embed], components: [row] });
  },
};
