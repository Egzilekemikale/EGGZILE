const axios = require("axios")
const { exec } = require("child_process")

module.exports = {
  name: "media",
  run: async ({ sock, msg, args }) => {
    const command = args[0]?.toLowerCase()
    const input = args.slice(1).join(" ")
    const from = msg.key.remoteJid

    if (command === "ytmp3") {
      if (!input) return sock.sendMessage(from, { text: "🎧 Provide YouTube link.\nExample: .media ytmp3 https://youtube.com/..." })
      await sock.sendMessage(from, { text: "⏳ Fetching MP3..." })
      let res = await axios.get(`https://api.akuari.my.id/downloader/youtubeaudio?link=${input}`)
      await sock.sendMessage(from, { audio: { url: res.data.mp3 }, mimetype: "audio/mp4" })
    }

    else if (command === "ytmp4") {
      if (!input) return sock.sendMessage(from, { text: "🎥 Provide YouTube link.\nExample: .media ytmp4 https://youtube.com/..." })
      await sock.sendMessage(from, { text: "⏳ Downloading video..." })
      let res = await axios.get(`https://api.akuari.my.id/downloader/youtubemp4?link=${input}`)
      await sock.sendMessage(from, { video: { url: res.data.mp4 } })
    }

    else if (command === "tt") {
      if (!input) return sock.sendMessage(from, { text: "🎵 Provide TikTok link.\nExample: .media tt https://tiktok.com/..." })
      await sock.sendMessage(from, { text: "📥 Downloading TikTok..." })
      let res = await axios.get(`https://api.akuari.my.id/downloader/tiktok?link=${input}`)
      await sock.sendMessage(from, { video: { url: res.data.url } })
    }

    else if (command === "sticker") {
      const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage
      if (!quoted) return sock.sendMessage(from, { text: "🖼️ Reply to an image or video to convert to sticker." })
      const mediaType = quoted.imageMessage ? "image" : quoted.videoMessage ? "video" : null
      if (!mediaType) return sock.sendMessage(from, { text: "❌ Unsupported media type." })
      const file = await sock.downloadAndSaveMediaMessage({ message: quoted }, "sticker_input")
      exec(`ffmpeg -i ${file} -vf scale=512:512 sticker.webp`, async (err) => {
        if (err) return sock.sendMessage(from, { text: "⚠️ Sticker creation failed." })
        await sock.sendMessage(from, { sticker: { url: "./sticker.webp" } })
      })
    }

    else if (command === "quote") {
      const res = await axios.get("https://api.quotable.io/random")
      await sock.sendMessage(from, { text: `🧠 Quote:\n"${res.data.content}"\n— ${res.data.author}` })
    }

    else if (command === "anime") {
      const res = await axios.get("https://api.waifu.pics/sfw/waifu")
      await sock.sendMessage(from, { image: { url: res.data.url }, caption: "✨ Here's your anime waifu~" })
    }

    else {
      await sock.sendMessage(from, {
        text: `🎬 Available media commands:\n.media ytmp3 <link>\n.media ytmp4 <link>\n.media tt <link>\n.media sticker\n.media quote\n.media anime`
      })
    }
  }
}
