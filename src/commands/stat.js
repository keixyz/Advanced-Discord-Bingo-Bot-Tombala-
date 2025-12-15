const { EmbedBuilder } = require('discord.js');
const TombalaStats = require('../models/TombalaStats');

const EMOJIS = {
  baslangic: '<a:baslangic:832676289675788329>',
  dolu: '<a:ortabar:832676681285500968>',
  doluBitis: '<a:bitis:832676117496070194>',
  bos: '<:bos:832676805386174496>',
  bosBitis: '<:bosbitis:832676465447010324>',
  tik: '✅',
  carpim: '❌'
};

module.exports = {
  name: 'tstat',
  description: 'Bir üyenin tombala istatistiklerini gösterir.',
  async execute(message, args) {
    const member = message.mentions.members.first() || message.member;
    const data = await TombalaStats.findOne({ userId: member.id });

    if (!data) {
      return message.reply('❌ Bu kullanıcıya ait istatistik bulunamadı.');
    }

    const totalGames = data.totalGames;
    const winCount = data.winCount;
    const rate = totalGames > 0 ? (winCount / totalGames) * 100 : 0;

    const totalBlocks = 20;
    const filledBlocks = Math.round((rate / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;

    let bar = EMOJIS.baslangic;

    if (filledBlocks === totalBlocks) {
      bar += EMOJIS.dolu.repeat(totalBlocks - 1) + EMOJIS.doluBitis;
    } else if (filledBlocks === 0) {
      bar += EMOJIS.bos.repeat(totalBlocks - 1) + EMOJIS.bosBitis;
    } else {
      bar += EMOJIS.dolu.repeat(filledBlocks - 1);
      bar += filledBlocks > 0 ? EMOJIS.doluBitis : '';
      bar += EMOJIS.bos.repeat(emptyBlocks - 1);
      bar += EMOJIS.bosBitis;
    }

    const successIcon = rate >= 50 ? EMOJIS.tik : EMOJIS.carpim;

    const embed = new EmbedBuilder()
      .setColor('#8E44AD')
      .setTitle(`${member.user.username} - Tombala İstatistikleri`)
      .addFields(
        { name: 'Toplam Oyun', value: `${totalGames}`, inline: true },
        { name: 'Kazanılan Oyun', value: `${winCount}`, inline: true },
        { name: 'Kazanma Oranı', value: `%${rate.toFixed(1)}`, inline: true },
        { name: 'Performans', value: bar }
      )
      .setFooter({ text: 'Tombala Bot' });

    message.channel.send({ embeds: [embed] });
  },
};
