const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const tombalaData = require('../data/tombalaData');
const kartlarJson = require('../data/kartlar.json');
const TombalaStats = require('../models/TombalaStats');
const GameLog = require('../models/GameLog');

function resetTombala() {
  tombalaData.oyunBaslatildi = false;
  tombalaData.sayilar = [];
  tombalaData.katilimcilar = [];
  tombalaData.kartlar = [...kartlarJson];
  if (tombalaData.timer) {
    clearInterval(tombalaData.timer);
    tombalaData.timer = null;
  }
}

async function finalizeGame(channel, kazananlar) {
  try {
    await channel.send('🎉 Oyun sona erdi!');
    await logGameResults(kazananlar, tombalaData.katilimcilar);
  } catch (e) {
    console.error('Finalize error:', e);
  } finally {
    resetTombala();
  }
}

async function startTombalaGame(channel) {
  if (tombalaData.oyunBaslatildi && tombalaData.timer) {
    await channel.send('⚠️ Zaten devam eden bir tombala oyunu var.');
    return;
  }

  tombalaData.oyunBaslatildi = true;
  const kazananlar = [];
  if (tombalaData.timer) {
    clearInterval(tombalaData.timer);
    tombalaData.timer = null;
  }
  let endedThisTick = false;

  tombalaData.timer = setInterval(async () => {
    if (endedThisTick) return;
    try {
      if (tombalaData.sayilar.length === 0) {
        clearInterval(tombalaData.timer);
        tombalaData.timer = null;
        await channel.send('🎉 Tüm sayılar çekildi, kimse kartını tamamlayamadı gibi. Oyun bitti!');
        await finalizeGame(channel, kazananlar);
        return;
      }
      const randomIndex = Math.floor(Math.random() * tombalaData.sayilar.length);
      const drawn = tombalaData.sayilar.splice(randomIndex, 1)[0];

      const showCardButton = new ButtonBuilder()
        .setCustomId('show_card')
        .setLabel('Kartımı Göster')
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(showCardButton);
      await channel.send({ content: `**Çekilen Sayı:** ${drawn}`, components: [row] });
      for (const player of tombalaData.katilimcilar) {
        if (player?.kart?.sayilar?.includes?.(drawn)) {
          player.kart.sayilar = player.kart.sayilar.filter(n => n !== drawn);

          const progress = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Kart Durumu - ${channel.guild.members.cache.get(player.id)?.user.username || 'Bilinmeyen'}`)
            .addFields(
              { name: 'Kart Numarası', value: String(player.kart.kartNumarasi), inline: true },
              { name: 'Kalan Sayılar', value: player.kart.sayilar.length > 0 ? player.kart.sayilar.join(', ') : 'Hepsi tamamlandı!', inline: true }
            )
            .setImage(player.kart.resimUrl);

          await channel.send({ embeds: [progress] });
        }
      }
      const winner = tombalaData.katilimcilar.find(p => p.kart.sayilar.length === 0 && !kazananlar.includes(p.id));
      if (winner) {
        kazananlar.push(winner.id);

        const kazanEmbed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle(`🏆 Kazanan ${kazananlar.length}.!`)
          .setDescription(`<@${winner.id}> tüm sayıları tamamladı!`)
          .setTimestamp();

        await channel.send({ embeds: [kazanEmbed] });
        endedThisTick = true;
        if (tombalaData.timer) {
          clearInterval(tombalaData.timer);
          tombalaData.timer = null;
        }

        await finalizeGame(channel, kazananlar);
        return;
      }
    } catch (err) {
      console.error('Tombala interval error:', err);
      if (tombalaData.timer) {
        clearInterval(tombalaData.timer);
        tombalaData.timer = null;
      }
      await finalizeGame(channel, kazananlar);
    }
  }, 5000);
}

async function logGameResults(winnerIds, participants) {
  try {
    for (const player of participants) {
      const isWinner = winnerIds.includes(player.id);

      await GameLog.create({
        userId: player.id,
        username: player.username || player.id,
        won: isWinner,
      });

      let stat = await TombalaStats.findOne({ userId: player.id });
      if (!stat) {
        stat = new TombalaStats({
          userId: player.id,
          username: player.username || player.id,
          totalGames: 0,
          winCount: 0,
        });
      }
      stat.totalGames += 1;
      if (isWinner) stat.winCount += 1;
      await stat.save();
    }
  } catch (error) {
    console.error('Game logging error:', error);
  }
}

module.exports = {
  resetTombala,
  startTombalaGame,
};
