const { Events } = require('discord.js');
const handleButton = require('../handler/buttonHandler');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      if (interaction.isButton()) return handleButton(interaction, client);
      if (interaction.isModalSubmit()) return handleModal(interaction, client);
      if (
        interaction.isStringSelectMenu() ||
        interaction.isRoleSelectMenu() ||
        interaction.isUserSelectMenu() ||
        interaction.isChannelSelectMenu()
      ) {
        return handleSelect(interaction, client);
      }
    } catch (err) {
      console.error(`[INTERACTION ERROR]`, err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
      }
    }
  }
};
