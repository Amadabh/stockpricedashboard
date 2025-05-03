const axios = require('axios');
const finnhub = require('finnhub');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 });

const apiKey = process.env.FINNHUB_API_KEY;
const token = apiKey;
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = apiKey;
const finnhubClient = new finnhub.DefaultApi();

module.exports = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let symbols = cache.get('us_symbols');
    if (!symbols) {
      const symbolRes = await axios.get("https://finnhub.io/api/v1/stock/symbol", {
        params: { exchange: "US", token }
      });
      symbols = symbolRes.data;
      cache.set('us_symbols', symbols);
    }

    const quotes = [];
    for (const item of symbols) {
      if (quotes.length >= 10) break;

      try {
        const quote = await new Promise((resolve, reject) => {
          finnhubClient.quote(item.symbol, (error, data) => {
            if (!error && typeof data.c === "number" && typeof data.dp === "number") {
              resolve({
                symbol: item.symbol,
                price: data.c,
                changePercent: data.dp,
              });
            } else {
              reject("Invalid");
            }
          });
        });

        quotes.push(quote);
      } catch {
        continue;
      }
    }

    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
