const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'tyardım',
  description: 'Botun komutları hakkında yardım bilgisi gösterir.',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📜 Tombala Bot Yardım Menüsü')
      .setDescription(
        '**Komutlar:**\n' +
        '`!tombalakur` - Tombala oyununu başlatır.\n' +
        '`!katıl` - Tombala oyununa katılmayan kişileri listeler.\n' +
        '`!tinfo` - Oyun durumu hakkında bilgi verir.\n' +
        '`!tdraw` - Çekilen sayıları listeler.\n' +
        '`!tyardım` - Tombala botu komutlarını listeler.\n' +
        '`!tnew` -  Yeni tombala oyunu kurar.\n' +
        '`!tstat` - Kendi veya bir kullanıcının istatistiklerini gösterir.\n' +
        '`!trank` - Kazananların sıralamasını gösterir.\n\n' +
        'Sorularınız için sunucu yetkilileriyle iletişime geçin.'
      )
      .setFooter({ text: 'Tombala Bot' });

    const supportButton = new ButtonBuilder()
      .setLabel('Discord Sunucusu')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/your-server');

    const inviteButton = new ButtonBuilder()
      .setLabel('Davet Bağlantısı')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/your-server');

    const row = new ActionRowBuilder().addComponents(supportButton, inviteButton);

    await message.channel.send({ embeds: [embed], components: [row] });
  }
};
