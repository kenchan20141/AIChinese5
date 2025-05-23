const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { prompt } = req.body;
  const API_KEY = process.env.DEEPSEEK_API_KEY;
  const API_URL = "https://api.deepseek.com/v1/chat/completions";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-reasoner",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices[0].message.content });
};
