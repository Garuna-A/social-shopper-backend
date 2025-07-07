const express = require('express');
const router = express.Router();
const searchEbayProducts = require('../ebaySearch');

router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const results = await searchEbayProducts(query);
    res.json(results);
  } catch (err) {
    console.error('eBay Search Error:', err);
    res.status(500).json({ message: 'Failed to fetch eBay items' });
  }
});

module.exports = router;
