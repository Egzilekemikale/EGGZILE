const fs = require("fs")
const path = require("path")
const AUTH_FILE = path.join(__dirname, "../authorized.json")

// Load or create authorized list
if (!fs.existsSync(AUTH_FILE)) fs.writeFileSync(AUTH_FILE, JSON.stringify([]))
let authorizedUsers = JSON.parse(fs.readFileSync(AUTH_FILE))

module.exports = {
  name: "auth",
  run: async ({ sock, msg, args, sender }) => {
    const from = msg.key.remoteJid
    const command = args[0]?.toLowerCase()
    const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

    if (!["auth", "unauth", "ban"].includes(command)) {
      return sock.sendMessage(from, {
        text: `🔐 Usage:\n.auth auth @user\n.auth unauth @user\n.auth ban @user`
      })
    }

    if (!target) return sock.sendMessage(from, { text: `⚠️ Please mention a user.` })

    if (command === "auth") {
      if (!authorizedUsers.includes(target)) {
        authorizedUsers.push(target)
        fs.writeFileSync(AUTH_FILE, JSON.stringify(authorizedUsers))
        await sock.sendMessage(from, { text: `✅ User authorized: ${target}` })
      } else {
        await sock.sendMessage(from, { text: `🟡 User is already authorized.` })
      }
    }

    if (command === "unauth") {
      authorizedUsers = authorizedUsers.filter(user => user !== target)
      fs.writeFileSync(AUTH_FILE, JSON.stringify(authorizedUsers))
      await sock.sendMessage(from, { text: `❌ Removed access for: ${target}` })
    }

    if (command === "ban") {
      // Ban logic placeholder — can expand in future
      await sock.sendMessage(from, { text: `🚫 ${target} is banned (not implemented yet)` })
    }
  }
}
