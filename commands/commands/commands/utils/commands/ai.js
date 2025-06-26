const { getAIResponse } = require('../lib/ai-core');

module.exports = {
  name: 'ai',
  alias: ['ask', 'chat'],
  description: 'Chat with AI in normal friendly mode.',
  category: 'AI',
  async execute(msg, args, client) {
    const input = args.join(" ");
    if (!input) return msg.reply('🧠 Please ask something like `.ai What is love?`');

    const reply = await getAIResponse(input, 'normal');
    msg.reply(`🧠 ${reply}`);
  }
};
