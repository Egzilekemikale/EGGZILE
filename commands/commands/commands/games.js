module.exports = {
  name: "games",
  run: async ({ sock, msg, args }) => {
    const command = args[0]?.toLowerCase()
    const from = msg.key.remoteJid

    const math = {
      question: `${Math.floor(Math.random() * 20)} + ${Math.floor(Math.random() * 20)}`,
      answer: null
    }
    math.answer = eval(math.question)

    const riddles = [
      { q: "I speak without a mouth and hear without ears. What am I?", a: "An echo" },
      { q: "What has keys but can't open locks?", a: "A piano" }
    ]
    const truths = ["What's your biggest fear?", "Who was your last crush?", "Have you ever lied to a friend?"]
    const dares = ["Text your crush 'I like you 😳'", "Say your full name loudly", "Sing a song out loud!"]

    const fastWords = ["WhatsApp", "Baileys", "Egzile", "Command", "Banana", "Typefast"]

    const guessEmoji = ["😺", "🐶", "🦊", "🐸", "🐼", "🐵"]
    const randomEmoji = guessEmoji[Math.floor(Math.random() * guessEmoji.length)]

    if (command === "mathquiz") {
      await sock.sendMessage(from, { text: `🧠 Solve this: ${math.question}` })
    } else if (command === "riddle") {
      const r = riddles[Math.floor(Math.random() * riddles.length)]
      await sock.sendMessage(from, { text: `🧩 Riddle:\n${r.q}` })
    } else if (command === "truth") {
      await sock.sendMessage(from, { text: `🧠 Truth:\n${truths[Math.floor(Math.random() * truths.length)]}` })
    } else if (command === "dare") {
      await sock.sendMessage(from, { text: `🎯 Dare:\n${dares[Math.floor(Math.random() * dares.length)]}` })
    } else if (command === "fasttype") {
      const word = fastWords[Math.floor(Math.random() * fastWords.length)]
      await sock.sendMessage(from, { text: `⌨️ Type this fast:\n"${word}"` })
    } else if (command === "guess") {
      await sock.sendMessage(from, { text: `🤔 Guess the emoji I'm thinking of:\n🐶 😺 🐼 🐵 🦊 🐸` })
    } else if (command === "tictactoe") {
      await sock.sendMessage(from, { text: "❌⭕ Coming soon! Multiplayer support in development." })
    } else {
      await sock.sendMessage(from, {
        text: `🎮 Available game commands:\n.mathquiz\n.riddle\n.truth\n.dare\n.fasttype\n.guess\n.tictactoe`
      })
    }
  }
}
