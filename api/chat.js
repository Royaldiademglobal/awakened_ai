export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let rawMessage = '';
    if (req.body && req.body.message) {
      rawMessage = req.body.message;
    } else if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        rawMessage = parsed.message || '';
      } catch (e) {
        rawMessage = req.body;
      }
    }

    const response = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://royaldiademglobalservices.com',
        'X-Title': 'Awakened AI Sanctuary'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-70b-instruct:free',
        messages: [
          { role: 'system', content: 'You are a luxury psychoanalytic spiritual guidance companion. Speak with ancient wisdom, depth, and clarity.' },
          { role: 'user', content: rawMessage }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Proxy corridor silent' });
  }
}
