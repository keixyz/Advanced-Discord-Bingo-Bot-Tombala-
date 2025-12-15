const { EmbedBuilder } = require('discord.js');
const GameLog = require('../models/GameLog');
const TombalaStats = require('../models/TombalaStats');

module.exports = {
  name: 'trank',
  description: 'Tombala kazanan sıralamasını gösterir.',
  async execute(message, args) {
    let zamanFiltre = {};
    const now = new Date();
    const input = args[0]?.toLowerCase();

    if (["today", "1d", "d", "daily"].includes(input)) {
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
      zamanFiltre = { timestamp: { $gte: oneDayAgo } };
    } else if (input === "7d") {
      const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      zamanFiltre = { timestamp: { $gte: sevenDaysAgo } };
    }

    const logs = await GameLog.aggregate([
      { $match: { ...zamanFiltre, won: true } },
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          winCount: { $sum: 1 }
        }
      },
      { $sort: { winCount: -1 } },
      { $limit: 10 }
    ]);

    if (!logs.length) {
      return message.reply("❗ Bu dönem için kazanan bulunamadı.");
    }

    const userIds = logs.map(u => u._id);
    const stats = await TombalaStats.find({ userId: { $in: userIds } });

    const statsMap = {};
    for (const stat of stats) {
      statsMap[stat.userId] = stat;
    }

    const lines = logs.map((u, i) => {
      const stat = statsMap[u._id];
      let rate = "0.0";
      if (stat && stat.totalGames > 0) {
        rate = ((stat.winCount / stat.totalGames) * 100).toFixed(1);
      }
      return `\`${i + 1}.\` <@${u._id}> - \`${u.winCount}\` Win - \`Win Rate %${rate}\``;
    });

    const embed = new EmbedBuilder()
      .setColor("#2ECC71")
      .setTitle("🏆 Tombala Kazananlar Sıralaması")
      .setDescription(lines.join("\n"))
      .setFooter({ text: `Dönem: ${input || "Tüm Zamanlar"}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
};
