module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    const prefix = '!';
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    let command = client.commands.get(commandName);
    if (!command) {
      command = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    }
    if (!command) return;

    try {
      await command.execute(message, client, args);
    } catch (err) {
      console.error(`[HATA] ${commandName} komutu çalıştırılırken hata:`, err);
      message.reply('❌ Komut çalıştırılırken bir hata oluştu.');
    }
  },
};
