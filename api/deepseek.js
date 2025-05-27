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
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API 錯誤: ${errorData.error.message || response.statusText}`);
  }

  const data = await response.json();
  res.status(200).json(data);
} catch (error) {
  console.error('API 調用錯誤:', error);
  res.status(500).json({ error: error.message });
}
