module.exports = {
  name: "group",
  run: async ({ sock, msg, args, isGroup, sender }) => {
    const from = msg.key.remoteJid

    const text = args.join(" ").toLowerCase()

    if (!isGroup) {
      return sock.sendMessage(from, { text: "❌ This command can only be used in groups." })
    }

    if (text === "everyone") {
      const metadata = await sock.groupMetadata(from)
      const members = metadata.participants.map(p => ({ mentionedJid: [p.id] }))
      await sock.sendMessage(from, {
        text: "📢 Attention everyone!",
        mentions: metadata.participants.map(p => p.id)
      })
    }

    if (text === "antilink on") {
      global.antilinkGroups = global.antilinkGroups || {}
      global.antilinkGroups[from] = true
      return sock.sendMessage(from, { text: "✅ Anti-link is now *enabled* in this group." })
    }

    if (text === "antilink off") {
      if (global.antilinkGroups) global.antilinkGroups[from] = false
      return sock.sendMessage(from, { text: "❌ Anti-link is now *disabled* in this group." })
    }

    if (text.startsWith("kick")) {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid
      if (!mentioned) return sock.sendMessage(from, { text: "⚠️ Mention someone to kick." })
      await sock.groupParticipantsUpdate(from, mentioned, "remove")
    }

    if (text.startsWith("warn")) {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid
      if (!mentioned) return sock.sendMessage(from, { text: "⚠️ Mention someone to warn." })
      await sock.sendMessage(from, { text: `⚠️ Warning issued to ${mentioned[0].split("@")[0]}`, mentions: mentioned })
    }
  }
}
