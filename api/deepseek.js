const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // 設置流式回應的標頭
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  // 發送 API 請求，啟用流式回應
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // 處理流式數據
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // 保留未完成的行
    for (const line of lines) {
      if (line.trim()) {
        try {
          const data = JSON.parse(line);
          if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
            res.write(data.choices[0].delta.content); // 逐步發送內容
          }
          if (data.choices && data.choices[0].finish_reason === 'stop') {
            res.end(); // 內容生成完畢，結束回應
            return;
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }
  }
  res.end(); // 流結束時關閉回應
};
