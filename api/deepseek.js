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
      model: 'deepseek-reasoner',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      stream: true // 啟用流式回應
    })
  });

  // 設置流式傳輸的 HTTP 頭
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 逐塊傳輸數據
  response.body.on('data', (chunk) => {
    res.write(chunk);
  });

  // 流結束時關閉回應
  response.body.on('end', () => {
    res.end();
  });
};
