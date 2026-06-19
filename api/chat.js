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
  req.on('data', (chunk) => { incomingBuffer.push(chunk); });

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
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: 'You are a luxury psychoanalytic spiritual guidance companion. Speak with ancient wisdom, depth, and clarity. Interact in fluid back-and-forth conversation.' },
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
            
            if (openRouterJson && openRouterJson.choices && openRouterJson.choices[0] && openRouterJson.choices[0].message) {
              const aiResponseText = openRouterJson.choices[0].message.content;
              res.setHeader('Content-Type', 'application/json; charset=UTF-8');
              return res.status(200).json({ message: aiResponseText, response: aiResponseText, text: aiResponseText });
            } else {
              const retryData = JSON.stringify({
                model: 'meta-llama/llama-3.1-70b-instruct:free',
                messages: [{ role: 'system', content: 'You are a luxury spiritual companion.' }, { role: 'user', content: finalUserText }]
              });
              options.ContentLength = Buffer.byteLength(retryData);
              const retryRequest = https.request(options, (retryRes) => {
                let rData = '';
                retryRes.on('data', (c) => { rData += c; });
                retryRes.on('end', () => {
                  try {
                    const rJson = JSON.parse(rData);
                    if (rJson && rJson.choices && rJson.choices[0]) {
                      const txt = rJson.choices[0].message.content;
                      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                      return res.status(200).json({ message: txt, response: txt, text: txt });
                    }
                  } catch(err) {}
                  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                  return res.status(200).json({ message: "The currents are gathering. Re-send your message statement once more to align.", response: "The currents are gathering.", text: "The currents are gathering." });
                });
              });
              retryRequest.write(retryData);
              retryRequest.end();
            }
          } catch (e) {
            res.setHeader('Content-Type', 'application/json; charset=UTF-8');
            return res.status(200).json({ message: "Re-aligning text channels. Retry your expression.", response: "Error caught.", text: "Error caught." });
          }
        });
      });

      request.on('error', (error) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        return res.status(200).json({ message: "Network gateway stabilizing. Retry expression.", response: "Error.", text: "Error." });
      });

      request.write(postData);
      request.end();

    } catch (err) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      return res.status(200).json({ message: "Sanctuary corridor clear. Send reflection again.", response: "Error.", text: "Error." });
    }
  });
};
