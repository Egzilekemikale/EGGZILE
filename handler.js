const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

// Load all command files
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter(file => file.endsWith(".js"))

const commands = {}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  if (command && command.name) {
    commands[command.name] = command
  }
}

module.exports = async (sock, msg) => {
  try {
    const from = msg.key.remoteJid
    const isGroup = from.endsWith("@g.us")
    const sender = isGroup ? msg.key.participant : from

    const body = (
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      msg.message?.documentMessage?.caption ||
      ""
    ).trim()

    if (!body.startsWith(".")) return // Commands start with dot (.)

    const args = body.slice(1).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = commands[commandName]

    if (command) {
      console.log(chalk.blue(`[CMD] .${commandName} from ${sender}`))
      await command.run({ sock, msg, args, sender, isGroup })
    } else {
      console.log(chalk.gray(`[UNKNOWN CMD] ${body}`))
    }
  } catch (err) {
    console.log(chalk.redBright("[ERROR in handler]"), err)
  }
}
