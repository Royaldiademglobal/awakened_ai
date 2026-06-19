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
          'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
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
            
            let cleanAiText = '';
            if (openRouterJson && openRouterJson.choices && openRouterJson.choices[0] && openRouterJson.choices[0].message) {
              cleanAiText = openRouterJson.choices[0].message.content;
            } else if (openRouterJson && openRouterJson.message) {
              cleanAiText = openRouterJson.message;
            } else {
              cleanAiText = "The sanctuary pathways are actively balancing your frequency. Repeat your reflection once more to lock in the alignment.";
            }

            res.setHeader('Content-Type', 'application/json; charset=UTF-8');
            return res.status(200).json({
              message: cleanAiText,
              response: cleanAiText,
              text: cleanAiText
            });

          } catch (e) {
            res.setHeader('Content-Type', 'application/json; charset=UTF-8');
            return res.status(200).json({
              message: "Cosmic alignment processing. Please re-send your reflection.",
              response: "Cosmic alignment processing. Please re-send your reflection.",
              text: "Cosmic alignment processing. Please re-send your reflection."
            });
          }
        });
      });

      request.on('error', (error) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        return res.status(200).json({
          message: "Network field stabilizing. Retry message.",
          response: "Network field stabilizing. Retry message.",
          text: "Network field stabilizing. Retry message."
        });
      });

      request.write(postData);
      request.end();

    } catch (err) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      return res.status(200).json({
        message: "Sanctuary balancing completed. Refresh once to connect with the core.",
        response: "Sanctuary balancing completed. Refresh once to connect with the core.",
        text: "Sanctuary balancing completed. Refresh once to connect with the core."
      });
    }
  });
};
