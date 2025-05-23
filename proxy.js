const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiKey = process.env.API_KEY; // 從環境變量獲取 API Key
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions'; // 官方 DeepSeek API

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: '伺服器錯誤' });
  }
};
