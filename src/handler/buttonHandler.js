const path = require('path');
const fs = require('fs');

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  const customId = interaction.customId;

  const filePath = path.join(__dirname, '..', 'interactions', 'buttons', `${customId}.js`);

  if (!fs.existsSync(filePath)) {
    return interaction.reply({ content: `Bu buton için bir işlem tanımlanmamış: ${customId}`, ephemeral: true });
  }

  const button = require(filePath);
  if (typeof button.execute !== 'function') {
    return interaction.reply({ content: 'Bu buton işlenemedi. Kod hatası olabilir.', ephemeral: true });
  }

  try {
    await button.execute(interaction);
  } catch (err) {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Buton çalıştırılırken bir hata oluştu.', ephemeral: true });
    }
  }
};
