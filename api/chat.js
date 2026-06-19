const https = require('https');

module.exports = function (req, res) {
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

    const postData = JSON.stringify({
      model: 'meta-llama/llama-3-70b-instruct:free',
      messages: [
        { role: 'system', content: 'You are a luxury psychoanalytic spiritual guidance companion. Speak with ancient wisdom, depth, and clarity.' },
        { role: 'user', content: rawMessage }
      ]
    });

    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'https://royaldiademglobalservices.com',
        'X-Title': 'Awakened AI Sanctuary',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          res.setHeader('Content-Type', 'application/json; charset=UTF-8');
          return res.status(200).send(data);
        } catch (e) {
          return res.status(500).json({ error: 'Parsing failure' });
        }
      });
    });

    request.on('error', (error) => {
      return res.status(500).json({ error: 'Transmission failure' });
    });

    request.write(postData);
    request.end();

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
