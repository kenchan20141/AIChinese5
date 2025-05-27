const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 8192
    })
  });

  const data = await response.json();
  res.status(200).json(data);
};
