const { Client, GatewayIntentBits, Collection } = require('discord.js');
const connectDB = require('./src/handler/mongoHandler');
const config = require('./src/config/config.json');
const commandHandler = require('./src/handler/commandHandler');
const eventHandler = require('./src/handler/eventHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();

connectDB();
commandHandler(client);
eventHandler(client);

const token = config.token?.trim();
if (!token) {
  console.error('[LOGIN] Discord token config içinde tanımlı değil.');
  process.exit(1);
}

client.login(token);
