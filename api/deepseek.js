const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // 檢查輸入是否有效
  if (!prompt) {
    return res.status(400).json({ error: '請提供大綱內容' });
  }

  // 將 prompt 分成兩段
  const splitIndex = Math.ceil(prompt.length / 2); // 平均分割
  const firstHalf = prompt.slice(0, splitIndex);   // 前半段
  const secondHalf = prompt.slice(splitIndex);     // 後半段

  // 構造兩個 API 請求的 payload
  const payloads = [
    {
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: firstHalf }],
      max_tokens: 450
    },
    {
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: secondHalf }],
      max_tokens: 450
    }
  ];

  try {
    // 同時發送兩個 API 請求
    const responses = await Promise.all(
      payloads.map(payload =>
        fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        }).then(response => {
          if (!response.ok) {
            throw new Error(`API 請求失敗，狀態碼: ${response.status}`);
          }
          return response.json();
        })
      )
    );

    // 合併兩個請求的結果
    const combinedResult = responses
      .map(data => data.choices[0].message.content.trim())
      .join('\n\n'); // 用兩個換行符分隔兩段結果

    // 返回合併後的結果
    res.status(200).json({ result: combinedResult });
  } catch (error) {
    console.error('API 調用錯誤:', error);
    res.status(500).json({ error: '點評生成失敗，請稍後重試' });
  }
};
