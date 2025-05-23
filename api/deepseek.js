const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt } = req.body;
  const API_KEY = process.env.API_KEY; // 從環境變量獲取
  const API_URL = "https://api.deepseek.com/v1/chat/completions";
  const MODEL = "deepseek-reasoner";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }]
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
