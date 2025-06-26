const fetch = require('node-fetch');

async function getAIResponse(prompt, mode = 'normal') {
  let personality = '';

  if (mode === 'silly') {
    personality = 'You are a funny, random AI who responds with goofy or meme-like style.';
  } else if (mode === 'darkgpt') {
    personality = 'You are a bold, powerful and no-nonsense AI, replying with strong tone but no illegal, unsafe, or NSFW content.';
  } else {
    personality = 'You are a helpful, calm assistant.';
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_OPENAI_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: personality },
        { role: 'user', content: prompt }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '⚠️ Failed to fetch AI reply.';
}

module.exports = { getAIResponse };
