const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  const { prompt } = req.body;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`API 調用失敗: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
