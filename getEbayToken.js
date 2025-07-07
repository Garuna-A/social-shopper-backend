const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const getEbayAccessToken = async () => {
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString('base64');

  const data = qs.stringify({
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope'
  });

  try {
    const res = await axios.post('https://api.ebay.com/identity/v1/oauth2/token', data, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return res.data.access_token;
  } catch (err) {
    console.error('Failed to get eBay token:', err.response?.data || err.message);
    throw err;
  }
};

module.exports = getEbayAccessToken;
