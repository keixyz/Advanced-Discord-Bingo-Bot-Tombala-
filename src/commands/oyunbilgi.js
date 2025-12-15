const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'tinfo',
  description: 'Tombala oyunu hakkında bilgi verir.',
  async execute(message) {
    const showButton = new ButtonBuilder()
      .setCustomId('show_gameinfo')
      .setLabel('Bilgiyi Göster')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(showButton);

    await message.channel.send({ content: 'Oyunun durumunu görmek için aşağıdaki butona tıklayın.', components: [row] });
  }
};
