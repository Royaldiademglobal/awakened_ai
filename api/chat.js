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

  let incomingBuffer = [];
  req.on('data', (chunk) => {
    incomingBuffer.push(chunk);
  });

  req.on('end', () => {
    try {
      const fullBuffer = Buffer.concat(incomingBuffer);
      const rawText = fullBuffer.toString('utf8');
      
      let finalUserText = '';
      if (rawText) {
        try {
          const parsed = JSON.parse(rawText);
          finalUserText = parsed.message || parsed.text || rawText;
        } catch (e) {
          if (rawText.includes('"message":')) {
            const match = rawText.match(/"message"\s*:\s*"([^"]+)"/);
            finalUserText = match ? match : rawText;
          } else {
            finalUserText = rawText;
          }
        }
      }

      const postData = JSON.stringify({
        model: 'meta-llama/llama-3.1-70b-instruct:free',
        messages: [
          { role: 'system', content: 'You are a luxury psychoanalytic spiritual guidance companion. Speak with ancient wisdom, depth, and clarity.' },
          { role: 'user', content: finalUserText }
        ]
      });

      const options = {
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': 'https://awakened.royaldiademglobalservices.com',
          'X-Title': 'Awakened AI Sanctuary',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const request = https.request(options, (response) => {
        let responseData = '';
        response.on('data', (chunk) => { responseData += chunk; });
        response.on('end', () => {
          try {
            const openRouterJson = JSON.parse(responseData);
            
            if (openRouterJson.choices && openRouterJson.choices[0] && openRouterJson.choices[0].message) {
              const aiResponseText = openRouterJson.choices[0].message.content;
              
              res.setHeader('Content-Type', 'application/json; charset=UTF-8');
              return res.status(200).json({ message: aiResponseText, response: aiResponseText });
            } else {
              res.setHeader('Content-Type', 'application/json; charset=UTF-8');
              return res.status(200).json({ message: "The message stream is settling. Send it once more.", response: "The message stream is settling. Send it once more." });
            }
          } catch (e) {
            res.setHeader('Content-Type', 'application/json; charset=UTF-8');
            return res.status(200).json({ message: "Cosmic alignment processing. Please re-send.", response: "Cosmic alignment processing. Please re-send." });
          }
        });
      });

      request.on('error', (error) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        return res.status(200).json({ message: "Network field stabilizing. Retry message.", response: "Network field stabilizing. Retry message." });
      });

      request.write(postData);
      request.end();

    } catch (err) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      return res.status(200).json({ message: "Sanctuary balancing. Refresh to connect.", response: "Sanctuary balancing. Refresh to connect." });
    }
  });
};
