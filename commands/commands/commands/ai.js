const axios = require("axios")

module.exports = {
  name: "ai",
  run: async ({ sock, msg, args }) => {
    const input = args.join(" ")
    if (!input) return sock.sendMessage(msg.key.remoteJid, { text: "🧠 Please provide a prompt.\nExample: .ai Who is Elon Musk?" })

    const res = await axios.get(`https://api.affiliateplus.xyz/api/chatbot`, {
      params: {
        message: input,
        botname: "EGGZILE",
        ownername: "EgzileKemikale",
        user: msg.key.participant || msg.key.remoteJid
      }
    })

    await sock.sendMessage(msg.key.remoteJid, { text: "🤖 " + res.data.message })
  }
}
