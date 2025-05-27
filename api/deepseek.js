const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { parts, topic, structure, toneNote, note } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // 驗證輸入
  if (!parts || !Array.isArray(parts) || parts.length === 0) {
    return res.status(400).json({ error: '無效的請求，parts 必須是一個非空數組' });
  }

  try {
    // 並行處理每個部分的 API 請求
    const results = await Promise.all(parts.map(async (part) => {
      const { part: partName, focus, plot } = part;
      const prompt = `請根據以下大綱內容的「${partName}」部分進行點評和建議，並提供改寫後的大綱。要求：
        1. 為「${partName}」部分提供點評和建議。點評和建議應具體針對該部分的「結構段重點」和「情節大要」。
        2. 為「${partName}」部分提供改寫後的「結構段重點」和「情節大要」。
        3. 請確保內容簡潔明了。
        題目：${topic}
        大綱結構：${structure}
        用戶輸入的大綱（${partName}）：
        結構段重點：${focus}
        情節大要：${plot}
        教學筆記：${note}
        點評及建議語氣：${toneNote}`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 8192
        })
      });

      if (!response.ok) {
        throw new Error(`API 調用失敗: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    }));

    // 合併所有部分的結果，用雙換行分隔
    const combinedResult = results.join("\n\n");
    res.status(200).json({ result: combinedResult });
  } catch (error) {
    console.error("API 調用錯誤:", error);
    res.status(500).json({ error: 'API 調用失敗' });
  }
};
