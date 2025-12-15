# Tombala Bot

## TR

Discord sunucunuzda tombala oyunu oynatmak icin gelistirilmis bir bottur. Oyuncular butonlar araciligiyla oyuna katilir, kartlarini gorur ve cekilen numaralari takip eder.

### Ozellikler
- Tombala oyunu icin kart dagitimi ve numara cekme
- Kazananlari otomatik kaydetme ve istatistiklar
- Yetkili rollere ozel kontroller
- TR/EN coklu dil destegi (komut ile degistirilebilir)

### Kurulum
1. Depoyu klonlayin veya indirin.
2. `npm install` komutu ile bagimliliklari yukleyin.
3. `src/config/config.json` dosyasinda asagidaki alanlari doldurun:
   - `token`: Discord bot tokeni
   - `mongoUri`: MongoDB baglanti adresi (opsiyonel, istatistik icin gerekir)
   - `yetkiliRoller`, `katilimciRolId`, `voiceChannelId`: Sunucu ID bilgileri
4. Botu `node main.js` ile calistirin.

### Komutlar
- `!tombalakur`: Tombala oturumu baslatir.
- `!katil`: Katilmayan kullanicilari listeler.
- `!tyardim`: Yardim menusunu gosterir.
- `!tdraw`: Cekilen sayilari listeler.
- `!tinfo`: Oyun durumunu gosterir.
- `!tnew`: Oyunu sifirlar.
- `!tstat`: Kullanici istatistigi.
- `!trank`: Kazanan siralamasi.
- `!language [tr|en]`: Mesaj dilini ayarlar.

## EN

A Discord bot that hosts a tombola (bingo-style) game for your community. Players join via buttons, see their cards, and track drawn numbers in real time.

### Features
- Card distribution and number drawing for tombola
- Automatic winner logging and stats
- Admin-only controls
- TR/EN multi-language support (switchable with command)

### Setup
1. Clone or download the repository.
2. Install dependencies with `npm install`.
3. Edit `src/config/config.json` and provide:
   - `token`: Discord bot token
   - `mongoUri`: MongoDB connection string (optional, required for stats)
   - `yetkiliRoller`, `katilimciRolId`, `voiceChannelId`: Server IDs
4. Start the bot via `node main.js`.


### Commands
- `!tombalakur`: Start a tombola session.
- `!katil`: List users who did not join.
- `!tyardim`: Show the help menu.
- `!tdraw`: List drawn numbers.
- `!tinfo`: Display game status.
- `!tnew`: Reset the game.
- `!tstat`: Show user stats.
- `!trank`: Display winner rankings.
- `!language [tr|en]`: Set the message language.

## Lisans / License
ISC Lisansi (bkz. package.json).
