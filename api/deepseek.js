const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
    const data = await response.json();
    res.json(data);
};
