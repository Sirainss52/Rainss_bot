import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import axios from "axios";
import Canvas from "canvas";

export default {
  data: new SlashCommandBuilder()
    .setName("rains")
    .setDescription("Command utama Rains bot 🌧️")
    // Subcommands
    .addSubcommand(sub => sub.setName("slap").setDescription("Tampar seseorang").addUserOption(o => o.setName("target").setDescription("Orang yang mau ditampar").setRequired(true)))
    .addSubcommand(sub => sub.setName("hug").setDescription("Peluk seseorang").addUserOption(o => o.setName("target").setDescription("Orang yang mau dipeluk").setRequired(true)))
    .addSubcommand(sub => sub.setName("kiss").setDescription("Cium seseorang").addUserOption(o => o.setName("target").setDescription("Orang yang mau dicium").setRequired(true)))
    .addSubcommand(sub => sub.setName("pat").setDescription("Elus kepala seseorang").addUserOption(o => o.setName("target").setDescription("Orang yang mau dielus").setRequired(true)))
    .addSubcommand(sub => sub.setName("semangat").setDescription("Kasih semangat ke seseorang").addUserOption(o => o.setName("target").setDescription("Orang yang mau disemangati").setRequired(true)))
    .addSubcommand(sub => sub.setName("meme").setDescription("Ambil meme random"))
    .addSubcommand(sub => sub.setName("joke").setDescription("Candaan random"))
    .addSubcommand(sub => sub.setName("coin").setDescription("Lihat harga coin crypto").addStringOption(o => o.setName("symbol").setDescription("Symbol coin, contoh: btc").setRequired(true)))
    .addSubcommand(sub => sub.setName("signal").setDescription("Lihat coin bullish/bearish"))
    .addSubcommand(sub => sub.setName("profile").setDescription("Lihat profil kamu"))
    .addSubcommand(sub => sub.setName("roast").setDescription("Roast seseorang 🔥").addUserOption(o => o.setName("target").setDescription("Orang yang mau diroast").setRequired(true)))
    .addSubcommand(sub => sub.setName("ship").setDescription("Hitung kecocokan cinta ❤️").addUserOption(o => o.setName("user1").setDescription("Orang pertama").setRequired(true)).addUserOption(o => o.setName("user2").setDescription("Orang kedua").setRequired(true)))
    .addSubcommand(sub => sub.setName("roll").setDescription("Lempar dadu 🎲"))
    .addSubcommand(sub => sub.setName("help").setDescription("Lihat daftar command Rains")),

  async execute(data) {
    const interaction = data.interaction;
    const sub = interaction.options.getSubcommand();

    // === rains slap ===
    if (sub === "slap") {
      const target = interaction.options.getUser("target");
      const res = await axios.get("https://nekos.best/api/v2/slap");
      const gif = res.data.results[0].url;
      await interaction.reply(`😤 ${interaction.user.username} menampar ${target}!`);
      await interaction.followUp({ files: [gif] });
    }

    // === rains hug ===
    if (sub === "hug") {
      const target = interaction.options.getUser("target");
      const res = await axios.get("https://nekos.best/api/v2/hug");
      const gif = res.data.results[0].url;
      await interaction.reply({
        content: `${interaction.user.username} memeluk ${target}!`,
        files: [gif]
      });
    }

    // === rains kiss ===
    if (sub === "kiss") {
      const target = interaction.options.getUser("target");
      const res = await axios.get("https://nekos.best/api/v2/kiss");
      const gif = res.data.results[0].url;
      await interaction.reply({
        content: `${interaction.user.username} mencium ${target}!`,
        files: [gif]
      });
    }

    // === rains pat ===
    if (sub === "pat") {
      const target = interaction.options.getUser("target");
      const res = await axios.get("https://nekos.best/api/v2/pat");
      const gif = res.data.results[0].url;
      await interaction.reply({
        content: `${interaction.user.username} mengelus kepala ${target} dengan lembut~ 😽`,
        files: [gif]
      });
    }

    // === rains semangat ===
    if (sub === "semangat") {
      const target = interaction.options.getUser("target");
      const pesanList = [
        "Jangan menyerah, kamu pasti bisa! 💪",
        "Kamu lebih kuat dari yang kamu kira 🔥",
        "Semangat terus ya, semua akan baik-baik saja 🌈",
        "Percaya diri! Langkah kecilmu berarti besar 💫",
        "Kamu nggak sendirian, kami dukung kamu! 🤗",
      ];
      const pesan = pesanList[Math.floor(Math.random() * pesanList.length)];
      const res = await axios.get("https://nekos.best/api/v2/pat");
      const gif = res.data.results[0].url;
      await interaction.reply({
        content: `${interaction.user.username} memberi semangat ke ${target}!\n> ${pesan}`,
        files: [gif]
      });
    }

    // === rains meme ===
    if (sub === "meme") {
      const res = await axios.get("https://meme-api.com/gimme");
      const meme = res.data;
      await interaction.reply({ content: `**${meme.title}**\n${meme.postLink}`, files: [meme.url] });
    }

    // === rains joke ===
    if (sub === "joke") {
      const res = await axios.get("https://candaan-api.vercel.app/api/text/random");
      await interaction.reply(`${res.data.data}🤣`);
    }

    // === rains coin ===
    if (sub === "coin") {
      const symbol = interaction.options.getString("symbol").toLowerCase();
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol}`);
        const data = res.data;
        const price = data.market_data.current_price.usd;
        const change = data.market_data.price_change_percentage_24h.toFixed(2);
        const emoji = change >= 0 ? "📈" : "📉";
        await interaction.reply(`📊 **${data.name} (${data.symbol.toUpperCase()})**\n💰 Harga: $${price.toLocaleString()}\n${emoji} Perubahan 24 jam: ${change}%`);
      } catch {
        await interaction.reply("❌ Coin tidak ditemukan atau API error.");
      }
    }

    // === rains signal ===
    if (sub === "signal") {
      const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: { vs_currency: "usd", order: "market_cap_desc", per_page: 15, page: 1 },
      });
      const coins = res.data;
      const bullish = coins.filter(c => c.price_change_percentage_24h > 2);
      const bearish = coins.filter(c => c.price_change_percentage_24h < -2);
      let msg = "📊 **Signal Rains - Market Overview**\n─────────────────────────────\n";
      msg += "📈 **Bullish Coins**\n";
      bullish.length ? bullish.forEach(c => msg += `💎 ${c.name} (${c.symbol.toUpperCase()}) → $${c.current_price}\n`) : msg += "Tidak ada coin bullish.\n";
      msg += "\n📉 **Bearish Coins**\n";
      bearish.length ? bearish.forEach(c => msg += `🔻 ${c.name} (${c.symbol.toUpperCase()}) → $${c.current_price}\n`) : msg += "Tidak ada coin bearish.\n";
      await interaction.reply(msg);
    }

    // === rains profile ===
    if (sub === "profile") {
      const user = interaction.user;
      const canvas = Canvas.createCanvas(600, 250);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#2b2d31";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: "png", size: 256 }));
      ctx.save();
      ctx.beginPath();
      ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 45, 45, 160, 160);
      ctx.restore();

      ctx.font = "bold 28px Sans";
      ctx.fillStyle = "#fff";
      ctx.fillText(user.username, 230, 100);

      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "profile.png" });
      await interaction.reply({ files: [attachment] });
    }

    // === rains roast ===
  if (sub === "roast") {
    const target = interaction.options.getUser("target");

    try {
      // Ambil roast random dari API
      const res = await axios.get("https://evilinsult.com/generate_insult.php?lang=en&type=json");
      const roastEn = res.data.insult;

      // Terjemahkan ke Bahasa Indonesia pakai LibreTranslate
      const translateRes = await axios.post("https://libretranslate.de/translate", {
        q: roastEn,
        source: "en",
        target: "id",
        format: "text",
      }, {
        headers: { "Content-Type": "application/json" },
      });

      const roastId = translateRes.data.translatedText;

      // Kirim hasil roast
      await interaction.reply(`🔥 ${interaction.user.username} nge-roast ${target}:\n> ${roastId}`);
    } catch (err) {
      console.error(err);
      await interaction.reply("⚠️ Gagal ambil atau terjemahin roast. Coba lagi nanti!");
    }
  }

    // === rains ship ===
    if (sub === "ship") {
      const user1 = interaction.options.getUser("user1");
      const user2 = interaction.options.getUser("user2");
      const percent = Math.floor(Math.random() * 101);
      let emoji = "💞";
      if (percent < 30) emoji = "💔";
      else if (percent < 60) emoji = "❤️‍🔥";
      await interaction.reply(`${emoji} **${user1.username}** ❤️ **${user2.username}** = **${percent}%** cocok!`);
    }

    // === rains roll ===
    if (sub === "roll") {
      const num = Math.floor(Math.random() * 6) + 1;
      await interaction.reply(`🎲 Kamu melempar dadu dan dapet **${num}**!`);
    }

    // === rains help ===
    if (sub === "help") {
      await interaction.reply(
        "🛠️ **Daftar Command Rains Bot:**\n" +
        "💰 `/rains coin <symbol>`\n" +
        "📈 `/rains signal`\n" +
        "🖐️ `/rains slap`\n" +
        "🤗 `/rains hug`\n" +
        "💋 `/rains kiss`\n" +
        "🫶 `/rains pat`\n" +
        "💪 `/rains semangat`\n" +
        "🤣 `/rains meme`\n" +
        "😂 `/rains joke`\n" +
        "👤 `/rains profile`\n" +
        "\n❤️ *Made with love by Sirainss*"
      );
    }
  },
};
