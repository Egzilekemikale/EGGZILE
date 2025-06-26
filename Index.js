const { Boom } = require('@hapi/boom')
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore
} = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")
const fs = require("fs")
const figlet = require("figlet")
const chalk = require("chalk")
require("dotenv").config()

const { BOT_NAME, OWNER_NUMBER, LOGIN_METHOD } = process.env

const store = makeInMemoryStore({ logger: undefined })

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: [BOT_NAME || "EGGZILE", "Chrome", "1.0"],
    logger: undefined
  })

  store.bind(sock.ev)

  if (!sock.authState.creds.registered) {
    const loginMethod = (LOGIN_METHOD || 'choose').toLowerCase()

    if (loginMethod === 'pairing') {
      const code = await sock.requestPairingCode(
        OWNER_NUMBER.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      )
      console.log(chalk.greenBright("Your pairing code:"), chalk.yellow(code))
    } else if (loginMethod === 'qr') {
      sock.ev.on("connection.update", (update) => {
        const { qr } = update
        if (qr) qrcode.generate(qr, { small: true })
      })
    } else {
      console.log(chalk.cyanBright("\nChoose login method:"))
      console.log("1. Pairing code\n2. QR code")
      const prompt = require('prompt-sync')()
      const choice = prompt("Your choice: ").trim()
      if (choice === '1') {
        const code = await sock.requestPairingCode(
          OWNER_NUMBER.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        )
        console.log(chalk.greenBright("Your pairing code:"), chalk.yellow(code))
      } else {
        sock.ev.on("connection.update", (update) => {
          const { qr } = update
          if (qr) qrcode.generate(qr, { small: true })
        })
      }
    }
  }

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    require('./handler')(sock, msg)
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("Connection closed due to", lastDisconnect.error, "\nReconnecting...", shouldReconnect)
      if (shouldReconnect) startBot()
    } else if (connection === 'open') {
      console.log(chalk.green(figlet.textSync("EGGZILE BOT")))
      console.log(chalk.magentaBright(`\n[✅] ${BOT_NAME || 'EGGZILE'} is online!\n`))
    }
  })
}

startBot()
