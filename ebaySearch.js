const getEbayAccessToken = require('./getEbayToken');
const axios = require('axios');

const searchEbayProducts = async (query) => {
  const token = await getEbayAccessToken();

  const res = await axios.get(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return res.data.itemSummaries;
};

module.exports = searchEbayProducts;
