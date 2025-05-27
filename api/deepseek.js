const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      }),
      timeout: 240000 // 設置超時為 240 秒（4 分鐘）
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("API 請求錯誤:", error);
    res.status(500).json({ error: "API 請求失敗" });
  }
};
