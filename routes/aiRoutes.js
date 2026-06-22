const express = require("express");
const router = express.Router();

const {aiSearch} = require('../controllers/aiController');
router.post("/search",aiSearch);
module.exports = router;