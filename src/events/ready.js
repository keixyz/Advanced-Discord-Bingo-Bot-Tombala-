const { ActivityType, Events } = require('discord.js');
const {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const config = require('../config/config.json');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`[READY] ${client.user.tag} aktif hale geldi.`);

    if (!client.__presenceTimer) {
      const statuses = ['Tombala hazır', 'Yeni oyunlar yolda', 'Komut: /tombalakur'];
      const setPresence = () => {
        const txt = statuses[Math.floor(Math.random() * statuses.length)];
        try {
          client.user.setPresence({
            activities: [{ name: txt, type: ActivityType.Listening }],
            status: 'dnd',
          });
        } catch {}
      };
      setPresence();
      client.__presenceTimer = setInterval(setPresence, 60_000);
    }

    if (!client.__voiceJoined && !client.__voiceConnecting) {
      client.__voiceConnecting = true;

      const voiceChannelId = config.voiceChannelId?.trim();
      if (!voiceChannelId) {
        console.log('[READY] Ses kanal kimliği config içinde tanımlı değil.');
        client.__voiceConnecting = false;
        return;
      }

      const voiceChannel = client.channels.cache.get(voiceChannelId);
      if (!voiceChannel) {
        console.log(`[READY] Ses kanalı bulunamadı (${voiceChannelId})`);
        client.__voiceConnecting = false;
      } else {
        let conn;
        try {
          conn = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: true,
          });

          if (!client.__voiceEventsBound) {
            client.__voiceEventsBound = true;

            conn.on('error', (err) => {
              console.error('[VOICE] Connection error:', err?.message || err);
            });

            conn.on('stateChange', (oldS, newS) => {
              if (newS.status === VoiceConnectionStatus.Disconnected) {
                setTimeout(() => {
                  try {
                    conn.rejoin();
                  } catch (e) {
                    try { conn.destroy(); } catch {}
                    client.__voiceJoined = false;
                    client.__voiceConnecting = false;
                    console.warn('[VOICE] Rejoin başarısız, bağlantı kapatıldı.');
                  }
                }, 5_000);
              }
            });
          }

          await entersState(conn, VoiceConnectionStatus.Ready, 20_000);
          client.__voiceConn = conn;
          client.__voiceJoined = true;
          client.__voiceConnecting = false;
          console.log(`[READY] Bot ${voiceChannel.name} ses kanalına bağlandı.`);
        } catch (e) {
          console.warn('[VOICE] Ready olamadı:', e?.message || e);
          try { conn?.destroy(); } catch {}
          client.__voiceJoined = false;
          client.__voiceConnecting = false;
        }
      }
    }

    global.tombala = global.tombala || {
      oyunBaslatildi: false,
      sayilar: [],
      katilimcilar: [],
      kazananlar: [],
    };
  },
};
