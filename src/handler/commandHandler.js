const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (!command.name || typeof command.execute !== 'function') {
      console.log(`[KOMUT] ${file} geçersiz veya eksik!`);
      continue;
    }

    client.commands.set(command.name, command);
    console.log(`[KOMUT] ${command.name} yüklendi.`);
  }
};
